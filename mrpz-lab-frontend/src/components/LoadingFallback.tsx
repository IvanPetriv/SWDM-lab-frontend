import type { ReactNode } from 'react';

interface LoadingFallbackProps {
  message?: ReactNode;
}

export default function LoadingFallback({
  message = 'Loading...',
}: LoadingFallbackProps) {
  return (
    <div className='flex justify-center items-center h-screen w-screen bg-gray-100'>
      <div className='text-gray-600'>{message}</div>
    </div>
  );
}
