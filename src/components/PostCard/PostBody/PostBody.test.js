import React from 'react'
import { shallow } from 'enzyme'
import PostBody from './index'

it('matches last snapshot', () => {
  const props = {
    post: {
      id: 1,
      title: 'hello there',
      details: 'the details',
      linkPreview: {
        title: 'a walk in the park',
        url: 'www.hylo.com/awitp',
        imageUrl: 'foo.png'
      },
      slug: 'foomunity',
      expanded: true,
      className: 'classy',
      highlightProps: { term: 'foo' },
      fileAttachments: [
        {
          id: 1,
          url: 'https://www.hylo.com/awitp.pdf'
        },
        {
          id: 1,
          url: 'http://www.google.com/lalala.zip'
        }
      ],
      topics: [{ name: 'topic' }]
    }
  }
  const wrapper = shallow(<PostBody {...props} />)
  expect(wrapper).toMatchSnapshot()
})
