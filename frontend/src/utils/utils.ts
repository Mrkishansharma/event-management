import toast from "react-hot-toast";

const appToast = (title: string, type: 'error' | 'warning' | 'success' | 'loading') => {
  return type === 'success' ? toast.success(title) : 
  type === 'error' ? toast.error(title) : 
  toast.loading(title);
}

export { appToast };