export default async function getUserInfo(token) {
  try {
    return await fetch('/users/user-info', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.log(error);
    return error;
  }
}
