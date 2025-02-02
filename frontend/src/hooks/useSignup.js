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

      // Log the response status and text for debugging
      console.log('Response Status:', response.status)
      const text = await response.text() // Read the response as text first
      console.log('Response Body:', text)

      // Check if the response is not ok (e.g., status code 4xx or 5xx)
      if (!response.ok) {
        setError('Signup failed. Please try again.')
        setIsLoading(false)
        return
      }

      let json;
      try {
        json = JSON.parse(text)  // Attempt to parse JSON
      } catch (e) {
        console.error('Error parsing JSON:', e)
        setError('An error occurred during signup. Please try again.')
        setIsLoading(false)
        return
      }

      // Check if the JSON response contains the token and user data
      if (!json.token || !json.user) {
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
