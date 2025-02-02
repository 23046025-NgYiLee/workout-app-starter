import { useState } from 'react'
import { useAuthContext } from './useAuthContext'

export const useSignup = () => {
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(null)
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

      // Check for response OK status and handle errors accordingly
      if (!response.ok) {
        const errorData = await response.json()
        setError(errorData.error || 'Signup failed')
        setIsLoading(false)
        return
      }

      // Handle empty response bodies
      const jsonResponse = await response.text() // Fetch as text first
      const data = jsonResponse ? JSON.parse(jsonResponse) : {}

      // Log to check the response
      console.log('Response JSON:', data)

      // Save user data to localStorage and dispatch to context
      localStorage.setItem('user', JSON.stringify(data))

      // Update the auth context
      dispatch({ type: 'LOGIN', payload: data })

      // Set loading state to false
      setIsLoading(false)

    } catch (err) {
      console.error('Error parsing JSON:', err)
      setError('An error occurred during signup. Please try again later.')
      setIsLoading(false)
    }
  }

  return { signup, isLoading, error }
}
