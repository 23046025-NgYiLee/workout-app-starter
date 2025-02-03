import React, { useState } from 'react';
import { useAuthContext } from './useAuthContext';

export const useSignup = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const { dispatch } = useAuthContext();

  const signup = async (email, password) => {
    setIsLoading(true);
    setError(null);

    const response = await fetch('/api/user/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    let json;
    try {
      const text = await response.text();
      console.log('Server response text:', text);
      json = text ? JSON.parse(text) : null;
    } catch (e) {
      json = null;
      console.error('Failed to parse JSON response:', e);
    }

    if (!response.ok) {
      setIsLoading(false);
      setError(json ? json.error : 'An error occurred');
    }
    if (response.ok && json) {
      // save the user to local storage
      localStorage.setItem('user', JSON.stringify(json));

      // update the auth context
      dispatch({ type: 'LOGIN', payload: json });

      // update loading state
      setIsLoading(false);
    }
  };

  return { signup, isLoading, error };
};
