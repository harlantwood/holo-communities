import { connect } from 'react-redux'
import { navigate } from 'routes/NavigationHandler/store'

export function mapStateToProps (state, props) {
  return {}
}

export const mapDispatchToProps = { navigate }

export default connect(mapStateToProps, mapDispatchToProps)
