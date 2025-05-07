import '../../shared/styles/shared.css';
import './product.css';
import { getAuthToken } from '../../utils/auth';

// Variable to store the trash data
let currentTrashData = null;

// Get DOM elements
const uploadButton = document.getElementById('clickBtn');
const imageInput = document.getElementById('imageInput');
const preview = document.getElementById('preview');
const result = document.getElementById('result');
const logBtn = document.getElementById('log-btn');
logBtn.disabled = true;
logBtn.classList.remove('visible'); // Ensure button is hidden initially

// Show and enable button when needed
function enableLogButton() {
  logBtn.disabled = false;
  logBtn.classList.add('visible');
}

// Hide and disable button
function disableLogButton() {
  logBtn.disabled = true;
  logBtn.classList.remove('visible');
}

logBtn.addEventListener('click', async () => {
  if (!currentTrashData) {
    console.error('No trash data available');
    return;
  }
  disableLogButton();
  await logTrash(currentTrashData.estonianWasteType);
});

async function logTrash(trashName) {
  try {
    const token = getAuthToken();
    if (!token) {
      window.location.href = '/signin';
      return;
    }

    const res = await fetch('/api/log-trash', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ trashName }),
    });

    if (!res.ok) {
      throw new Error('Failed to log trash!');
    }
  } catch (err) {
    console.error('Log error:', err);
    result.textContent = 'Error logging trash';
  }
}

// Handle image preview
imageInput.addEventListener('change', e => {
  const file = e.target.files[0];
  preview.innerHTML = '';

  if (file) {
    const img = document.createElement('img');
    img.src = URL.createObjectURL(file);
    img.className = 'preview-img';
    preview.appendChild(img);
  }
});

// Handle image upload
async function uploadImage() {
  try {
    const file = imageInput.files[0];
    if (!file) {
      alert('Please choose an image first.');
      return;
    }

    const token = getAuthToken();
    if (!token) {
      window.location.href = '/signin';
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    const res = await fetch('/api/upload', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!res.ok) {
      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem('token');
        window.location.href = '/signin';
        return;
      }
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    currentTrashData = {
      estonianWasteType: data.estonianWasteType,
      originalType: data.top,
    };

    result.textContent = `${currentTrashData.estonianWasteType}, ${currentTrashData.originalType}`;

    enableLogButton();
    imageInput.value = '';
  } catch (error) {
    console.error('Upload error:', error);
    result.textContent = 'Error processing image';
    currentTrashData = null;
    disableLogButton();
  }
}

// Upload button
uploadButton.addEventListener('click', () => {
  uploadImage();
});
