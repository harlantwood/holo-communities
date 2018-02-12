import { MemoryRouter, Redirect } from 'react-router'
import React from 'react'
import { shallow } from 'enzyme'

import orm from 'store/models'
import
PrimaryLayout,
{
  redirectIfCommunity,
  RedirectToCommunity,
  RedirectOrphanUser
} from './PrimaryLayout'

it('shows DownloadAppModal if the user is on mobile', () => {
  const url = 'some.url'
  const location = {
    pathname: 'path'
  }
  const wrapper = shallow(<PrimaryLayout
    downloadAppUrl={url}
    location={location}
    fetchForCurrentUser={jest.fn}
  />)
  expect(wrapper).toMatchSnapshot()
})

it('shows NotFound if a currentUser is loaded and the community does not exist', () => {
  const wrapper = shallow(<PrimaryLayout isCommunityRoute currentUser={{}} />, { disableLifecycleMethods: true })
  expect(wrapper).toMatchSnapshot()
})

it('shows nothing for a community route if the community and currentUser are not loaded', () => {
  const wrapper = shallow(<PrimaryLayout isCommunityRoute />, { disableLifecycleMethods: true })
  expect(wrapper.name()).toEqual('Loading')
})

it('shows normal children for a community route if the community is loaded', () => {
  const wrapper = shallow(<PrimaryLayout
    isCommunityRoute
    location={{pathname: '/'}}
    community={{id: '1'}}
    currentUser={{}} />, { disableLifecycleMethods: true })
  expect(wrapper.name()).toEqual('div')
})

describe('RedirectToCommunity', () => {
  let session

  beforeEach(() => {
    session = orm.mutableSession(orm.getEmptyState())
    session.Me.create({ id: '1' })
  })

  it('shows a Loading component if currentUser not set yet', () => {
    const wrapper = shallow(<RedirectToCommunity currentUser={null} />)
    const renderWrapper = shallow(wrapper.props().render())
    expect(renderWrapper.find('[data-stylename="loading-top"]').length).toBe(1)
  })

  it('shows a Loading component if currentUser has no memberships', () => {
    const me = session.Me.first()
    const wrapper = shallow(redirectIfCommunity(me)())
    expect(wrapper.find('[data-stylename="loading-top"]').length).toBe(1)
  })

  it('sets `to` prop of Redirect correctly', () => {
    session.Community.create({ id: '1', slug: 'foo' })
    session.Membership.create({ id: '1', community: '1' })
    const me = session.Me.first()
    me.set('memberships', ['1'])

    const wrapper = shallow(<MemoryRouter>
      {redirectIfCommunity(me)()}
    </MemoryRouter>)

    const expected = '/c/foo'
    const actual = wrapper.find(Redirect).props().to
    expect(actual).toBe(expected)
  })
})

describe('RedirectOrphanUser', () => {
  it('returns null if a signup is in progress', () => {
    const currentUser = {settings: {signupInProgress: true}}
    const wrapper = shallow(<RedirectOrphanUser currentUser={currentUser} />)
    expect(wrapper).toMatchSnapshot()
  })
  it('returns null if there are memberships', () => {
    const hasMemberships = true
    const wrapper = shallow(<RedirectOrphanUser hasMemberships={hasMemberships} />)
    expect(wrapper).toMatchSnapshot()
  })
  it('returns null if pathname starts with /signup', () => {
    const pathname = '/signup/any-path-here'
    const wrapper = shallow(<RedirectOrphanUser pathname={pathname} />)
    expect(wrapper).toMatchSnapshot()
  })
  it('returns null if pathname starts with /create-community', () => {
    const pathname = '/create-community/any-path-here'
    const wrapper = shallow(<RedirectOrphanUser pathname={pathname} />)
    expect(wrapper).toMatchSnapshot()
  })
  it('returns null if pathname starts with /all', () => {
    const pathname = '/all'
    const wrapper = shallow(<RedirectOrphanUser pathname={pathname} />)
    expect(wrapper).toMatchSnapshot()
  })
  it('returns null if returnToURL is /h/use-invitation', () => {
    const currentUser = {settings: {signupInProgress: false}}
    const pathname = '/'
    const returnToURL = '/h/use-invitation'
    const wrapper = shallow(<RedirectOrphanUser
      pathname={pathname}
      returnToURL={returnToURL}
      currentUser={currentUser}
    />)
    expect(wrapper).toMatchSnapshot()
  })

  it('redirects to all communities if: signup is complete, a user does not have memberships, and is not already on /signup or /create-community or /all', () => {
    const currentUser = {settings: {signupInProgress: false}}
    const hasMemberships = false
    const pathname = '/'
    const wrapper = shallow(<RedirectOrphanUser
      pathname={pathname}
      hasMemberships={hasMemberships}
      currentUser={currentUser}
    />)
    const expected = '/all'
    const actual = wrapper.find(Redirect).props().to
    expect(actual).toBe(expected)
    expect(wrapper).toMatchSnapshot()
  })
})
