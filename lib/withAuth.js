/* eslint-disable react/display-name */
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const withAuth = (WrappedComponent) => {
  return (props) => {
    const router = useRouter();

    useEffect(() => {
      const isAuthenticated = localStorage.getItem('profileDetails');
      if (!isAuthenticated) {
        router.push('/');
      }
    },[router]);

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
