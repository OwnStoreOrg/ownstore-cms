import React from 'react'
import Error from './Error'

interface IErrorBoundaryProps {}

interface IErrorBoundaryState {
  hasError: boolean
}

class ErrorBoundary extends React.PureComponent<IErrorBoundaryProps, IErrorBoundaryState> {
  constructor(props: IErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return <Error />
    }

    return this.props.children
  }
}

export default ErrorBoundary
