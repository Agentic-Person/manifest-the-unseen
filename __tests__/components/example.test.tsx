import { render, screen } from '@/lib/test-utils'

describe('Example Test Suite', () => {
  it('should pass a basic test', () => {
    expect(true).toBe(true)
  })

  it('should render a simple component', () => {
    const TestComponent = () => <div>Hello, World!</div>
    render(<TestComponent />)
    expect(screen.getByText('Hello, World!')).toBeInTheDocument()
  })
})
