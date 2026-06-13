export const getIsAdmin = () => {
  const isAdmin = localStorage.getItem('is_admin') === 'true';
  const email = localStorage.getItem('admin_email');
  
  const adminEmails = [
    'jerikbrahmos2004@gmail.com',
    'cottageleemaraj@gmail.com'
  ];
  
  return isAdmin || (email && adminEmails.includes(email));
};

export const getAuthToken = () => localStorage.getItem('access_token');

export const clearAuth = () => {
  localStorage.clear();
};
