// tokenHandler.js
export const getAuthHeaders = () => {
    const token = localStorage.getItem('token'); // or however you store the token
    return {
      Authorization: token ? `Bearer ${token}` : undefined,
      "Access-Control-Allow-Credentials": true,
    };
  };
  