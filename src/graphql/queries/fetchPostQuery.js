import postFieldsFragment from '../fragments/postFieldsFragment'

export default `query ($id: ID) {
  post(id: $id) @client {
    ${postFieldsFragment(true)}
  }
}`
