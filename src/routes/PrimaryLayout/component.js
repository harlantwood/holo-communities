import React, { PropTypes, Component } from 'react'
import { matchPath, Route } from 'react-router-dom'
import Navigation from './components/Navigation'
import TopNav from './components/TopNav'
import Sidebar from './components/Sidebar'
import cx from 'classnames'
import Feed from 'routes/Feed'
import Events from 'routes/Events'
import EventDetail from 'routes/Events/EventDetail'

import globalStyles from '../../css/global/index.scss' // eslint-disable-line no-unused-vars
import p from './component.scss' // eslint-disable-line no-unused-vars

export default class PrimaryLayout extends Component {
  static propTypes = {
    community: PropTypes.object,
    currentUser: PropTypes.object,
    location: PropTypes.object
  }

  render () {
    const { location, community, currentUser } = this.props
    const hasDetail = matchPath(location.pathname, {path: '/events/:eventId'})

    return <div styleName='p.container'>
      <TopNav {...{community, currentUser}} />
      <div styleName='p.row'>
        {/* TODO: is using render here the best way to pass params to a route? */}
        <Route path='/' render={() => <Navigation collapsed={hasDetail} location={location} />} />
        <div styleName='p.content'>
          <Route path='/' exact component={() => <Feed {...{community, currentUser}} />} />
          <Route path='/events' component={Events} />
        </div>
        <div styleName={cx('p.sidebar', {'p.hidden': hasDetail})}>
          <Route path='/' component={Sidebar} />
        </div>
        <div styleName={cx('p.detail', {'p.hidden': !hasDetail})}>
          {/*
            TODO: Display content of last detail page on '/' so that the
            animation transitions correctly.
            Best guess is to replace these routes with a render function
            defined above, and store the previous detail component in state
          */}
          <Route path='/events/:eventId' exact component={EventDetail} />
        </div>
      </div>
    </div>
  }
}
