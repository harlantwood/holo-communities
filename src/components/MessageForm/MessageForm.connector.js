import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { getMe } from 'store/selectors/getMe'
import {
  getTextForMessageThread,
  createMessage,
  updateMessageText
} from './MessageForm.store'
import { CREATE_MESSAGE, FIND_OR_CREATE_THREAD } from 'store/constants'
import { getSocket } from 'client/websockets'

export function mapStateToProps (state, props) {
  return {
    text: getTextForMessageThread(state, props),
    pending: !!state.pending[CREATE_MESSAGE] || (props.forNewThread && !!state.pending[FIND_OR_CREATE_THREAD]),
    currentUser: getMe(state),
    socket: getSocket()
  }
}

export const mapDispatchToProps = {
  createMessage,
  updateMessageText,
  goToThread: messageThreadId => push(`/t/${messageThreadId}`)
}
export default connect(mapStateToProps, mapDispatchToProps, null, {withRef: true})