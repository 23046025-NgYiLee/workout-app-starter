// useSignup.js
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
      const response = await fetch('/api/user/signup', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ email, password })
      })

      // Check for non-OK responses and handle them
      if (!response.ok) {
        const errorData = await response.json()
        setError(errorData.error || 'Signup failed. Please try again.')
        setIsLoading(false)
        return
      }

      // Handle empty responses gracefully
      const json = await response.json()
      if (!json || !json.token) {
        setError('Invalid response from server')
        setIsLoading(false)
        return
      }

      // Save the user to local storage
      localStorage.setItem('user', JSON.stringify(json))

      // Dispatch to the auth context
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
