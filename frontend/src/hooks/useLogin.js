import { useState } from 'react'
import { useAuthContext } from './useAuthContext'

export const useLogin = () => {
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const { dispatch } = useAuthContext()

  const login = async (email, password) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/user/login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ email, password })
      })

      // Check if response is ok
      if (!response.ok) {
        const text = await response.text() // Get raw response text
        setError(text || 'An error occurred during login')
        setIsLoading(false)
        return
      }

      // Try parsing JSON if the response is ok
      const json = await response.json()
      
      // Save the user to local storage
      localStorage.setItem('user', JSON.stringify(json))

      // Dispatch the login action to update context
      dispatch({ type: 'LOGIN', payload: json })

      // Set loading state to false
      setIsLoading(false)

    } catch (error) {
      console.error('Login failed:', error)
      setIsLoading(false)
      setError('Something went wrong. Please try again.')
    }
  }

  return { login, isLoading, error }
}
