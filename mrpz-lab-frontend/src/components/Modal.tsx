import { useEffect, type ReactNode } from 'react';

interface ModalProps {
  title?: ReactNode;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}

export default function Modal({
  title,
  onClose,
  children,
  footer,
  className,
}: ModalProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
      <div
        className={`bg-white rounded-lg p-6 max-w-md w-full mx-4 ${
          className ?? ''
        }`}
      >
        {title && (
          <div className='mb-4'>
            <h3 className='text-xl font-bold text-gray-900'>{title}</h3>
          </div>
        )}
        <div>{children}</div>
        {footer && <div className='mt-4'>{footer}</div>}
      </div>
    </div>
  );
}
