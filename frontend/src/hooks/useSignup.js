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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      // Ensure there's content in the response before attempting to parse
      const text = await response.text() // Read the raw response text
      if (!text) {
        setError('No response body returned from server.')
        setIsLoading(false)
        return
      }

      // Now parse the response text
      const json = JSON.parse(text)

      if (!response.ok) {
        setError(json.error || 'Signup failed. Please try again.')
        setIsLoading(false)
        return
      }

      // If signup successful, proceed with saving and dispatching
      localStorage.setItem('user', JSON.stringify(json))
      dispatch({ type: 'LOGIN', payload: json })

      setIsLoading(false)

    } catch (err) {
      setError('An error occurred during signup. Please try again.')
      setIsLoading(false)
    }
  }

  return { signup, isLoading, error }
}

