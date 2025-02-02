import { useState } from 'react'
import { useAuthContext } from './useAuthContext'

export const useSignup = () => {
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const { dispatch } = useAuthContext()

  const signup = async (email, password) => {
    setIsLoading(true)
    setError(null)

    try {
      // Perform the POST request to signup endpoint
      const response = await fetch('/api/user/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      // Check if the response is not ok (e.g., status code 4xx or 5xx)
      if (!response.ok) {
        const errorData = await response.json()
        setError(errorData.error || 'Signup failed. Please try again.')
        setIsLoading(false)
        return
      }

      // Attempt to parse the response as JSON
      const json = await response.json()

      // Check if the response contains the expected JSON (email & token)
      if (!json.token || !json.email) {
        setError('Invalid response from server')
        setIsLoading(false)
        return
      }

      // Save the user data to localStorage and dispatch to context
      localStorage.setItem('user', JSON.stringify(json))

      // Update the auth context with the user data
      dispatch({ type: 'LOGIN', payload: json })

      setIsLoading(false)

    } catch (err) {
      console.error('Error during signup:', err)
      setError('An error occurred during signup. Please try again.')
      setIsLoading(false)
    }
  }

  return { signup, isLoading, error }
}
