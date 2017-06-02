import AllTopics, { SearchBar, CommunityTopicListItem } from './AllTopics'
import { shallow, mount } from 'enzyme'
import { MemoryRouter } from 'react-router'
import { Provider } from 'react-redux'
import React from 'react'

describe('AllTopics', () => {
  it('matches the latest snapshot', () => {
    const ct = [
      {
        id: '1',
        topic: {
          id: '2',
          name: 'petitions'
        },
        postsTotal: 24,
        followersTotal: 52,
        isSubscribed: false
      }
    ]
    const wrapper = shallow(<AllTopics
      communityTopics={ct}
      slug='goteam'
      topicsTotal='10'
      toggleSubscribe={() => {}} />)

    expect(wrapper).toMatchSnapshot()
  })

  it.skip('caches totalTopics (using mount)', () => {
    document.getElementById = () => ({
      addEventListener: () => {},
      removeEventListener: () => {}
    })

    const initialState = {
      FullPageModal: {}
    }
    const store = {
      getState: () => initialState,
      dispatch: () => {},
      subscribe: () => {}
    }
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <AllTopics
            fetchCommunityTopics={() => {}}
            toggleSubscribe={() => {}}
            communityTopics={[]}
            selectedSort='followers'
          />
        </MemoryRouter>
      </Provider>)
    const allTopics = wrapper.find('AllTopics')
    console.log('allTopics', allTopics.debug())
    expect(allTopics.state.totalTopicsCached).not.toBeDefined()
    allTopics.setProps({totalTopics: 11})
    expect(allTopics.state.totalTopicsCached).toEqual(11)
    allTopics.setProps({totalTopics: 5})
    expect(allTopics.state.totalTopicsCached).toEqual(5)
  })
})

it('caches totalTopics (using shallow)', () => {
  const wrapper = shallow(<AllTopics
    fetchCommunityTopics={() => {}}
    toggleSubscribe={() => {}}
    communityTopics={[]}
    selectedSort='followers'
  />)

  // calling lifecycle methods by hand here because they don't fire
  // on a shallow rendered component
  wrapper.instance().componentDidMount()
  expect(wrapper.state().totalTopicsCached).not.toBeDefined()
  var prevProps = wrapper.props
  wrapper.setProps({totalTopics: 11})
  wrapper.instance().componentDidUpdate(prevProps, wrapper.props())
  expect(wrapper.state().totalTopicsCached).toEqual(11)
  wrapper.setProps({totalTopics: 5})
  wrapper.instance().componentDidUpdate(prevProps, wrapper.props())
  expect(wrapper.state().totalTopicsCached).toEqual(11)
})

describe('SearchBar', () => {
  it('matches the latest snapshot', () => {
    const props = {
      search: 'test',
      onChangeSearch: () => {},
      selectedSort: 'followers',
      onChangeSort: () => {}
    }
    const wrapper = shallow(<SearchBar {...props} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('throws an error when given a bad selectedSort', () => {
    const props = {
      search: 'test',
      onChangeSearch: () => {},
      selectedSort: 'nogood',
      onChangeSort: () => {}
    }
    expect(() => {
      shallow(<SearchBar {...props} />)
    }).toThrow(new Error('nogood is not a valid value for selectedSort'))
  })
})

describe('TopicListItem', () => {
  it('matches the latest snapshot', () => {
    const ct = {
      id: '1',
      topic: {
        name: 'petitions'
      },
      postsTotal: 24,
      followersTotal: 52,
      isSubscribed: false
    }
    const wrapper = shallow(<CommunityTopicListItem item={ct} slug='goteam' />)
    expect(wrapper).toMatchSnapshot()
  })
})
