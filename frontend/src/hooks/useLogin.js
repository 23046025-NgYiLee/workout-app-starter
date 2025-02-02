import { useState } from 'react'
import { useAuthContext } from './useAuthContext'

export const useLogin = () => {
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(null)
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

      const text = await response.text(); // Get raw response text
      console.log('Raw response:', text);

      let json;
      try {
        json = JSON.parse(text); // Try to parse it as JSON
      } catch (e) {
        console.error('Error parsing JSON:', e);
        setError('An unexpected error occurred');
        setIsLoading(false);
        return;
      }

      if (!response.ok) {
        setIsLoading(false)
        setError(json.error)
        return;
      }

      // Save the user to local storage
      localStorage.setItem('user', JSON.stringify(json))

      // Update the auth context
      dispatch({ type: 'LOGIN', payload: json })

      // Update loading state
      setIsLoading(false)

    } catch (error) {
      console.error('Login failed:', error);
      setIsLoading(false);
      setError('Something went wrong. Please try again.');
    }
  }

  return { login, isLoading, error }
}
