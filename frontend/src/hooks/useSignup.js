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
      console.log('Server response JSON:', jsonData);

      localStorage.setItem('user', JSON.stringify(jsonData));
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
