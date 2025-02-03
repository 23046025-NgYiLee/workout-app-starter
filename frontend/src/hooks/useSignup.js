import React, { useState } from 'react';
import { useAuthContext } from './useAuthContext';

export const useSignup = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const { dispatch } = useAuthContext();

  const signup = async (email, password) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/user/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error);
        setIsLoading(false);
        return;
      }

      const jsonData = await response.json();

      // save the user to local storage
      localStorage.setItem('user', JSON.stringify(jsonData));

      // update the auth context
      dispatch({ type: 'LOGIN', payload: jsonData });

      setIsLoading(false);
    } catch (error) {
      console.error('Failed to signup:', error);
      setError('An error occurred');
      setIsLoading(false);
    }
  };

  return { signup, isLoading, error };
};
