import React from 'react'
import { get } from 'lodash/fp'

import './MemberProfile.scss'
import Icon from 'components/Icon'
import RoundImage from 'components/RoundImage'
import { bgImageStyle } from 'util/index'

import SimpleTabBar from 'components/SimpleTabBar'
import PostCard from 'components/PostCard'
import CommentCard from 'components/CommentCard'
import RecentActivity from './RecentActivity'
import MemberPosts from './MemberPosts'

const { any, arrayOf, object, string, shape } = React.PropTypes

export default class MemberProfile extends React.Component {
  static propTypes = {
    id: any,
    person: shape({
      id: any,
      avatarUrl: string,
      bannerUrl: string,
      bio: string,
      facebookUrl: string,
      linkedinUrl: string,
      comments: arrayOf(object),
      memberships: arrayOf(object),
      name: string,
      posts: arrayOf(object),
      role: string,
      twitterName: string,
      url: string
    })
  }

  componentDidMount () {
    const id = get('match.params.id', this.props)
    if (id) this.props.fetchPerson(id)
  }

  constructor (props) {
    super(props)
    this.state = {
      currentTab: props.currentTab
    }
  }

  selectTab = tab => this.setState({ currentTab: tab })

  displayError (error) {
    return <div styleName='member-profile'>
      <span styleName='error'>{ error }</span>
    </div>
  }

  render () {
    if (this.props.error) return this.displayError(this.props.error)

    const {
      avatarUrl,
      bannerUrl,
      bio,
      facebookUrl,
      linkedinUrl,
      location,
      name,
      role,
      twitterName,
      url,
      votes
    } = this.props.person
    const { id, slug } = this.props.match.params

    return <div styleName='member-profile'>
      <ProfileBanner bannerUrl={bannerUrl}>
        <ProfileNamePlate avatarUrl={avatarUrl} location={location} name={name} role={role} />
      </ProfileBanner>
      <div styleName='content'>
        <ProfileControls currentTab={this.state.currentTab} selectTab={this.selectTab}>
          <SocialButtons
            facebookUrl={facebookUrl}
            linkedinUrl={linkedinUrl}
            twitterName={twitterName}
            url={url} />
        </ProfileControls>
        <TabContentSwitcher
          bio={bio}
          currentTab={this.state.currentTab}
          personId={id}
          slug={slug}
          votes={votes} />
      </div>
    </div>
  }
}

export function ProfileBanner ({ bannerUrl, children }) {
  return <div styleName='banner'>
    {children}
    {bannerUrl && <div style={bgImageStyle(bannerUrl)} styleName='banner-image' />}
  </div>
}

export function ProfileNamePlate ({ avatarUrl, name, location, role }) {
  return <div styleName='name-plate'>
    <RoundImage styleName='avatar' url={avatarUrl} xlarge />
    <div styleName='details'>
      <h1 styleName='name'>{name}</h1>
      <div styleName='fine-details'>
        <span styleName='location'>{location}</span>
        {role && <span styleName='role-bling'>
          <span styleName='spacer'>•</span>
          <Icon styleName='star' name='Star' />
          <span styleName='role'>{role}</span>
        </span>}
      </div>
    </div>
  </div>
}

export function ProfileControls ({ children, currentTab, selectTab }) {
  return <div styleName='controls'>
    {children}
    <hr styleName='separator' />
    <SimpleTabBar
      currentTab={currentTab}
      selectTab={selectTab}
      tabNames={['Overview', 'Posts', 'Comments', 'Upvotes']} />
  </div>
}

export function SocialButtons ({ facebookUrl, linkedinUrl, twitterName, url }) {
  return <div styleName='social-buttons'>
    {twitterName &&
      <a styleName='social-link' href={`https://twitter.com/${twitterName}`}>
        <Icon name='ProfileTwitter' styleName='icon icon-twitter' />
      </a>}
    {facebookUrl &&
      <a styleName='social-link' href={facebookUrl}>
        <Icon name='ProfileFacebook' styleName='icon icon-facebook' />
      </a>}
    {linkedinUrl &&
      <a styleName='social-link' href={linkedinUrl}>
        <Icon name='ProfileLinkedin' styleName='icon icon-linkedin' />
      </a>}
    {url &&
      <a styleName='social-link' href={url}>
        <Icon name='ProfileUrl' green styleName='icon' />
      </a>}
  </div>
}

export function TabContentSwitcher ({ bio, currentTab, personId, slug, votes }) {
  switch (currentTab) {
    case 'Overview':
      return <div>
        <h2 styleName='subhead'>About Me</h2>
        <div styleName='bio'>{bio}</div>
        <RecentActivity personId={personId} slug={slug} />
      </div>

    case 'Posts':
      return <MemberPosts personId={personId} slug={slug} />

    case 'Comments':
      return <div>
        <h2 styleName='subhead'>Comments</h2>
        {comments && comments.map((comment, i) => {
          return <div styleName='activity-item' key={i}>
            <CommentCard comment={comment} />
          </div>
        })}
      </div>

    case 'Upvotes':
      return <div>
        <h2 styleName='subhead'>Upvotes</h2>
        {votes && votes.map(post => {
          return <div styleName='activity-item' key={post.id}>
            <PostCard post={post} />
          </div>
        })}
      </div>
  }
}
