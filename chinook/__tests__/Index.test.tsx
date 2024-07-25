import {render, waitFor, screen} from 'test-utils'
import {createRemixStub} from '@remix-run/testing'
import Index from '~/routes/_index'
import {json} from '@remix-run/node'
import {describe, it, vi} from 'vitest'

describe('Home Page', () => {
  const RemixStub = createRemixStub([
    {
      path: '/',
      Component: Index,
      loader() {
        return json({ message: 'hello from loader' })
      },
    },
  ])
  render(<RemixStub />)
  it('should render the Albums link', async () => {
    await waitFor(() => screen.getByText('Albums'));
  });
})
