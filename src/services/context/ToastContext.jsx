import { createContext, useState, useContext } from 'react'
import Toast from '../../components/Atoms/Toast/Toast'

const ToastContext = createContext()

export const useToast = () => {
  return useContext(ToastContext);
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  // Add a toast to the list
  const addToast = (type, message) => {
    const id = Date.now();

    // Add the toast to the state at the start of the array
    setToasts((prevToasts) => [
      { id, type, message },
      ...prevToasts,
    ]);

    // Set a timer to remove the toast after 3 seconds
    setTimeout(() => {
      removeToast(id);
    }, 3000);
  };

  // Remove a toast from the list
  const removeToast = (id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div
        className="toast-container"
        style={{
          position: 'fixed',
          top: '20px',
          left: '20px',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}
      >
        {toasts.map((toast, index) => (
          <Toast
            key={toast.id}
            type={toast.type}
            message={toast.message}
            onClose={() => removeToast(toast.id)}
            index={index}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};
