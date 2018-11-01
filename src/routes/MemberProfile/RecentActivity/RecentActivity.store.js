import { createSelector as ormCreateSelector } from 'redux-orm'
import { compact } from 'lodash/fp'
import orm from 'store/models'
import { presentPost } from 'store/selectors/getPost'
import { postsQueryFragment } from 'components/FeedList/FeedList.store'

export const FETCH_RECENT_ACTIVITY = 'FETCH_RECENT_ACTIVITY'

const recentActivityQuery =
`query RecentActivity (
  $id: ID,
  $order: String,
  $sortBy: String,
  $offset: Int,
  $search: String,
  $filter: String,
  $first: Int,
  $topic: ID
) {
  person (id: $id) {
    id
    comments (first: $first, order: $order) {
      items {
        id
        text
        creator {
          id
        }
        post {
          id
          title
        }
        attachments {
          id
          url
          type
        }
        createdAt
      }
    }
    ${postsQueryFragment}
  }
}`

export function fetchRecentActivity (id, first = 3, query = recentActivityQuery) {
  return {
    type: FETCH_RECENT_ACTIVITY,
    graphql: {
      query,
      variables: {id, first, order: 'desc'}
    },
    meta: { extractModel: 'Person' }
  }
}

// Deliberately preserves object references
// Used to display interspersed posts and comments on 'Recent Activity'
export function indexActivityItems (comments, posts) {
  // TODO: support something other than descending order
  return comments.concat(posts)
    .sort((a, b) => {
      const aDate = new Date(a.createdAt)
      const bDate = new Date(b.createdAt)
      return aDate < bDate ? 1 : aDate > bDate ? -1 : 0
    })
}

export function presentComment (comment, communitySlug) {
  if (!comment || !comment.post) return
  return {
    ...comment.ref,
    creator: comment.creator.ref,
    post: comment.post.ref,
    image: comment.attachments.toModelArray()[0],
    slug: communitySlug
  }
}

export const activitySelector = ormCreateSelector(
  orm,
  state => state.orm,
  (_, { personId }) => personId,
  (_, { slug }) => slug,
  ({ Person }, personId, slug) => {
    if (!Person.hasId(personId)) return
    const person = Person.withId(personId)
    const comments = compact(person.comments.toModelArray().map(comment =>
      presentComment(comment, slug)))
    const posts = compact(person.posts.toModelArray().map(post =>
      presentPost(post)))
    return indexActivityItems(comments, posts)
  })
