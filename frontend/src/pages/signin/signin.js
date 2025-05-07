import '../../shared/styles/shared.css';
import './signin.css';

const form = document.getElementById('sign-in-form');

form.addEventListener('submit', async e => {
  e.preventDefault();

  const dataForm = new FormData(e.target);
  const userSignInData = {
    email: dataForm.get('email'),
    password: dataForm.get('password'),
  };

  try {
    const res = await fetch('/users/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userSignInData),
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    if (data.token) {
      localStorage.setItem('token', data.token);
      window.location.href = '/'; // Redirect to home page
    }
  } catch (error) {
    console.error('Login error:', error);
    const result = document.getElementById('result');
    if (result) {
      result.textContent = 'Login failed. Please try again.';
    }
  }
});
