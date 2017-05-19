import React from 'react'
import { shallow } from 'enzyme'
import FeedList from './FeedList'

describe('FeedList', () => {
  it('has a TabBar', () => {
    const wrapper = shallow(<FeedList />)
    expect(wrapper.find('TabBar')).toBeTruthy()
  })

  it('renders a post list', () => {
    const posts = [{id: 1}, {id: 2}, {id: 3}]
    const wrapper = shallow(<FeedList posts={posts} />)
    expect(wrapper.find('PostCard').length).toEqual(3)
  })
})