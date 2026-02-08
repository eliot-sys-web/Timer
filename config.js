// Éléments DOM
const keypadUpload = document.getElementById('keypadUpload');
const timerUpload = document.getElementById('timerUpload');
const keypadPreview = document.getElementById('keypadPreview');
const timerPreview = document.getElementById('timerPreview');
const targetInput = document.getElementById('targetNumber');
const launchBtn = document.getElementById('launchBtn');

// Variables pour stocker les images
let keypadImage = null;
let timerImage = null;

// Upload capture clavier
keypadUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            keypadImage = event.target.result;
            keypadPreview.innerHTML = `
                <img src="${keypadImage}" alt="Keypad preview">
                <div class="preview-check">✓</div>
            `;
            checkLaunchReady();
        };
        reader.readAsDataURL(file);
    }
});

// Upload capture timer
timerUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            timerImage = event.target.result;
            timerPreview.innerHTML = `
                <img src="${timerImage}" alt="Timer preview">
                <div class="preview-check">✓</div>
            `;
            checkLaunchReady();
        };
        reader.readAsDataURL(file);
    }
});

// Vérifier si on peut lancer
function checkLaunchReady() {
    if (keypadImage && timerImage) {
        launchBtn.disabled = false;
        launchBtn.classList.add('ready');
    }
}

// Validation du nombre cible
targetInput.addEventListener('input', () => {
    let value = parseInt(targetInput.value);
    if (value < 0) targetInput.value = 0;
    if (value > 99) targetInput.value = 99;
});

// Bouton Lancer
launchBtn.addEventListener('click', () => {
    console.log('CLIC LANCER'); // Debug
    
    if (keypadImage && timerImage) {
        // Sauvegarder dans localStorage
        localStorage.setItem('keypadImage', keypadImage);
        localStorage.setItem('timerImage', timerImage);
        localStorage.setItem('targetNumber', targetInput.value);
        
        console.log('Données sauvegardées:', {
            keypad: keypadImage ? 'OK' : 'MANQUANT',
            timer: timerImage ? 'OK' : 'MANQUANT',
            target: targetInput.value
        });
        
        // Redirection
        window.location.href = './app.html';
    } else {
        alert('⚠️ Veuillez télécharger les 2 captures d\'écran');
    }
});

// Afficher la valeur actuelle du nombre cible
targetInput.addEventListener('input', () => {
    document.querySelector('.target-display').textContent = targetInput.value;
});
