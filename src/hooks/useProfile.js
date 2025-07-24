import { getCookie } from '@/utils/helper';
// import { cookies } from 'next/headers';
import { useState, useEffect } from 'react';

const useProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'GET',
        credentials: 'include', // include cookies
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch profile');
      }

      setUser(data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if(getCookie('token')){
    // if(cookies().get('token')?.value){
        fetchProfile();
    }else{
        setLoading(false);
    }
  }, []);

  return { user, loading, error };
};

export default useProfile;
