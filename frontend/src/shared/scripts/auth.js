export function getAuthToken() {
  return localStorage.getItem('token');
}

export async function validateToken() {
  const token = getAuthToken();
  if (!token) {
    return false;
  }

  try {
    const response = await fetch('/api/validate-token', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.ok;
  } catch (error) {
    console.error('Token validation error:', error);
    return false;
  }
}
