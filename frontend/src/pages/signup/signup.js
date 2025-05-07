import '../../shared/styles/shared.css';
import './signup.css';

const form = document.getElementById('sign-up-form');

form.addEventListener('submit', async e => {
  e.preventDefault();

  const formData = new FormData(e.target);

  const userData = {
    email: formData.get('email'),
    password: formData.get('password'),
    name: formData.get('name'),
  };
  const res = await fetch('/users/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
  const data = await res.json();
  const result = document.getElementById('result');
  if (res.status === 200) {
    result.textContent = data.message;
  } else if (res.status === 400) {
    result.textContent = 'Email already in use!';
  }
});
