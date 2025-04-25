import "./style.css"

const btn = document.getElementById('clickBtn')

btn.addEventListener('click', () => {
    uploadImage()
})

async function uploadImage() {
    const input = document.getElementById('imageInput');
    const file = input.files[0];
    if (!file) return alert("Choose an image first.");

    const formData = new FormData();
    formData.append('image', file);

    const res = await fetch('/upload', {
      method: 'POST',
      body: formData
    });

    const data = await res.json();
    console.log(data)
    document.getElementById('result').innerText = data.estonianTrashType || data.error;
}