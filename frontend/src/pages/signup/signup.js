import './signup.css';

const form = document.getElementById('sign-up-form');

form.addEventListener('submit', e => {
  e.preventDefault();

  const formData = new FormData(e.target);

  const userData = {
    email: formData.get('email'),
    password: formData.get('password'),
    name: formData.get('name'),
  };

  fetch('/users/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
});
