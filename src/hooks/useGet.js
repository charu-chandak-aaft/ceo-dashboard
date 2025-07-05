// const fetchProfile = async () => {
//     const res = await fetch('/api/auth/profile', {
//       method: 'GET',
//       credentials: 'include', // important to send cookies
//     });
  
//     const data = await res.json();
//     console.log(data);
//   };
import { useState } from 'react';

const useGet = (endpoint) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);
  const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/${endpoint}`;
  // console.log('API_URL get', API_URL)

  const getData = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const res = await fetch(API_URL, {
        method: 'GET',
        credentials: 'include', // important to send cookies
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || 'Something went wrong');
      }

      setResponse(result);
      return result;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { getData, loading, error, response };
};

export default useGet;
