import toast from 'react-hot-toast';

export const showToast = {
  success: (message) => toast.success(message, {
    style: {
      background: '#10b981',
      color: '#fff',
      borderRadius: '12px',
    },
    iconTheme: {
      primary: '#fff',
      secondary: '#10b981',
    },
  }),
  
  error: (message) => toast.error(message, {
    style: {
      background: '#ef4444',
      color: '#fff',
      borderRadius: '12px',
    },
  }),
  
  promise: (promise, messages) => toast.promise(promise, messages),
};