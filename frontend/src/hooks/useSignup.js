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

      if (!response.ok) {
        const errorData = await response.json()
        setError(errorData.error || 'Signup failed')
        setIsLoading(false)
        return
      }

      const json = await response.json()

      // Save user data to localStorage and dispatch to context
      localStorage.setItem('user', JSON.stringify(json))

      // Update the auth context
      dispatch({ type: 'LOGIN', payload: json })

      setIsLoading(false)

    } catch (err) {
      console.error('Error:', err)
      setError('An error occurred during signup.')
      setIsLoading(false)
    }
  }

  return { signup, isLoading, error }
}
