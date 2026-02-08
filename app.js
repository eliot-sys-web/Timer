let keypadImage = null;
let timerImage = null;
let targetNumber = 50;

const keypadUpload = document.getElementById('keypadUpload');
const timerUpload = document.getElementById('timerUpload');
const targetInput = document.getElementById('targetNumber');
const launchBtn = document.getElementById('launchBtn');

// Upload image clavier
keypadUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            keypadImage = event.target.result;
            showPreview('keypadPreview', keypadImage);
            document.querySelector('label[for="keypadUpload"]').classList.add('has-image');
            checkReadyToLaunch();
        };
        reader.readAsDataURL(file);
    }
});

// Upload image timer
timerUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            timerImage = event.target.result;
            showPreview('timerPreview', timerImage);
            document.querySelector('label[for="timerUpload"]').classList.add('has-image');
            checkReadyToLaunch();
        };
        reader.readAsDataURL(file);
    }
});

// Nombre cible
targetInput.addEventListener('input', (e) => {
    targetNumber = parseInt(e.target.value) || 50;
    checkReadyToLaunch();
});

// Afficher preview
function showPreview(containerId, imageSrc) {
    const container = document.getElementById(containerId);
    container.innerHTML = `<img src="${imageSrc}" alt="Preview">`;
}

// Vérifier si prêt à lancer
function checkReadyToLaunch() {
    if (keypadImage && timerImage) {
        launchBtn.disabled = false;
    }
}

// Lancer l'app
launchBtn.addEventListener('click', () => {
    // Sauvegarder les données dans localStorage
    localStorage.setItem('keypadImage', keypadImage);
    localStorage.setItem('timerImage', timerImage);
    localStorage.setItem('targetNumber', targetNumber);
    
    // Rediriger vers l'app
    window.location.href = 'app.html';
});
