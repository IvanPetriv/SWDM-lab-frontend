import { Loader2 } from 'lucide-react';

interface InlineLoaderProps {
  className?: string;
}

export default function InlineLoader({ className = '' }: InlineLoaderProps) {
  return (
    <div className={`flex items-center justify-center py-8 ${className}`}>
      <Loader2 className='w-8 h-8 animate-spin text-blue-600' />
    </div>
  );
}
