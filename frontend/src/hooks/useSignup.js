// useSignup.js
import { useState } from 'react';
import { useAuthContext } from './useAuthContext';

export const useSignup = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { dispatch } = useAuthContext();

  const signup = async (email, password) => {
    setIsLoading(true);
    setError(null);
  
    try {
      const response = await fetch('http://localhost:3000/api/user/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
  
      // Check if response is empty or invalid
      if (!response.ok) {
        const errorJson = await response.json().catch(() => null); // Catch any parsing errors
        setIsLoading(false);
        setError(errorJson?.error || 'Signup failed. Please try again.');
        return;
      }
  
      const json = await response.json();  // Parse the JSON response
  
      // Save user data and update auth context
      localStorage.setItem('user', JSON.stringify(json));
      dispatch({ type: 'LOGIN', payload: json });
      setIsLoading(false);
    } catch (err) {
      console.error('Error during signup:', err);
      setError('An error occurred during signup.');
      setIsLoading(false);
    }
  };
  

  return { signup, isLoading, error };
};
