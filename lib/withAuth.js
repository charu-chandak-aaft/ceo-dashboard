/* eslint-disable react/display-name */
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCookie } from '@/utils/helper';

const withAuth = (WrappedComponent) => {
  return (props) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

 useEffect(() => {
      const checkAuth = async () => {
        try {
          const res = await fetch('/api/auth/validate', {
            method: 'GET',
            credentials: 'include', // <-- send HttpOnly cookies
          });

          if (!res.ok) {
            throw new Error('Not authenticated');
          }

          setIsLoading(false);
        } catch (error) {
          console.log('Auth error:', error);
          router.push('/');
        }
      };

      checkAuth();
    }, [router]);

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
