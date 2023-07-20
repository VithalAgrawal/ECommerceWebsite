
const imagePickerElement = document.querySelector('#image-upload-control input');
const imagePreviewElement = document.querySelector('#image-upload-control img');

function updateImagePreview(){
    const file = imagePickerElement.files[0];
    if(!file || file.length === 0){
        imagePreviewElement.style.display = 'none';
        return;
    }
        
    imagePreviewElement.src = URL.createObjectURL(file);
    imagePreviewElement.style.display = 'block';
}

imagePickerElement.addEventListener('change', updateImagePreview);