export const MODULE_NAME = `Review`
export const CREATE_COMMUNITY = `${MODULE_NAME}/CREATE_COMMUNITY`

export function createCommunity (name, slug) {
  return {
    type: CREATE_COMMUNITY,
    graphql: {
      query: `mutation ($data: CommunityInput) {
        createCommunity(data: $data) {
          id
          hasModeratorRole
          community {
            id
            name
            slug
          }
        }
      }
      `,
      variables: {
        data: {
          name,
          slug
        }
      }
    },
    meta: {
      extractModel: 'Membership',
      slug,
      name
    }
  }
}