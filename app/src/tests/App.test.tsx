import { render } from '@testing-library/react'
import App from '../App'
import '@testing-library/jest-dom'

test('renders app header', () => {
  const { getByText } = render(<App />)
  expect(getByText(/Scan It Know It/i)).toBeInTheDocument()
})