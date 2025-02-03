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

      // Ensure the response text is logged
      const text = await response.text();
      console.log('Server response text:', text);

      // Attempt to parse the text as JSON
      let json = null;
      try {
        json = text ? JSON.parse(text) : null;
      } catch (e) {
        console.error('Failed to parse JSON:', e);
        throw new Error('Server returned invalid JSON');
      }

      console.log('Parsed JSON:', json);

      if (!response.ok) {
        console.error('Server responded with an error:', json ? json.error : 'Unknown error');
        setError(json ? json.error : 'An error occurred');
        setIsLoading(false);
        return;
      }

      if (!json) {
        console.error('Empty response from server');
        setError('Empty response from server');
        setIsLoading(false);
        return;
      }

      // save the user to local storage
      localStorage.setItem('user', JSON.stringify(json));

      // update the auth context
      dispatch({ type: 'LOGIN', payload: json });

      setIsLoading(false);
    } catch (error) {
      console.error('Failed to signup:', error);
      setError('An error occurred');
      setIsLoading(false);
    }
  };

  return { signup, isLoading, error };
};
