import '../../shared/styles/shared.css';
import './product.css';

const btn = document.getElementById('clickBtn');

btn.addEventListener('click', () => {
  uploadImage();
});

async function uploadImage() {
  const input = document.getElementById('imageInput');
  const file = input.files[0];
  if (!file) return alert('Choose an image first.');

  const formData = new FormData();
  formData.append('image', file);

  const res = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });

  const data = await res.json();
  console.log(data);
  document.getElementById('result').textContent =
    `${data.estonianWasteType}, ${data.top}` || data.error;
}

document.getElementById('imageInput').addEventListener('change', function (e) {
  const file = e.target.files[0];
  const preview = document.getElementById('preview');
  preview.innerHTML = '';
  if (file) {
    const img = document.createElement('img');
    img.src = URL.createObjectURL(file);
    img.className = 'preview-img';
    preview.appendChild(img);
  }
});


