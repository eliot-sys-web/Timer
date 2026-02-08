// Récupérer les données du localStorage
const keypadImage = localStorage.getItem('keypadImage');
const timerImage = localStorage.getItem('timerImage');
const targetNumber = parseInt(localStorage.getItem('targetNumber')) || 50;

// Vérifier si les données existent
if (!keypadImage || !timerImage) {
    window.location.href = 'index.html';
}

// Charger les screenshots
document.getElementById('keypadScreenshot').src = keypadImage;
document.getElementById('timerScreenshot').src = timerImage;

// Variables globales
let enteredCode = '';
let isRunning = false;
let startTime = 0;
let elapsedTime = 0;
let timerInterval = null;

// Éléments DOM
const codeDisplay = document.getElementById('codeDisplay');
const timerDisplay = document.getElementById('timerDisplay');
const startStopBtn = document.getElementById('startStopBtn');
const resetBtn = document.getElementById('resetBtn');

// Gestion des écrans
function showScreen(screenName) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.querySelector(`.${screenName}-screen`).classList.add('active');
}

// Mise à jour affichage code
function updateCodeDisplay() {
    if (enteredCode === '') {
        codeDisplay.textContent = '--';
    } else if (enteredCode.length === 1) {
        codeDisplay.textContent = enteredCode + '-';
    } else {
        codeDisplay.textContent = enteredCode;
    }
}

// Gestion du clavier
document.querySelectorAll('.key-btn[data-num]').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const num = btn.getAttribute('data-num');
        
        if (enteredCode.length < 2) {
            enteredCode += num;
            updateCodeDisplay();
        }
    });
});

// Bouton supprimer
document.querySelector('.key-btn.delete').addEventListener('click', (e) => {
    e.preventDefault();
    enteredCode = enteredCode.slice(0, -1);
    updateCodeDisplay();
});

// Bouton valider
document.querySelector('.key-btn.validate').addEventListener('click', (e) => {
    e.preventDefault();
    if (enteredCode.length === 2) {
        showScreen('timer');
    }
});

// Calcul des centièmes forcés
function calculateForcedCentiseconds(target, code) {
    let result = target - code;
    // Gérer les négatifs avec modulo
    while (result < 0) {
        result += 100;
    }
    return result % 100;
}

// Format du temps
function formatTime(ms, forcedCentiseconds = null) {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const centiseconds = forcedCentiseconds !== null 
        ? forcedCentiseconds 
        : Math.floor((ms % 1000) / 10);
    
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(centiseconds).padStart(2, '0')}`;
}

function updateTimer() {
    const now = Date.now();
    elapsedTime = now - startTime;
    timerDisplay.textContent = formatTime(elapsedTime);
}

// Bouton Start/Stop
startStopBtn.addEventListener('click', (e) => {
    e.preventDefault();
    
    if (!isRunning) {
        // Démarrer
        startTime = Date.now() - elapsedTime;
        timerInterval = setInterval(updateTimer, 10);
        isRunning = true;
    } else {
        // Arrêter avec centièmes truqués
        clearInterval(timerInterval);
        isRunning = false;
        
        const code = parseInt(enteredCode);
        const forcedCentiseconds = calculateForcedCentiseconds(targetNumber, code);
        
        timerDisplay.textContent = formatTime(elapsedTime, forcedCentiseconds);
    }
});

// Bouton Reset
resetBtn.addEventListener('click', (e) => {
    e.preventDefault();
    
    clearInterval(timerInterval);
    isRunning = false;
    elapsedTime = 0;
    timerDisplay.textContent = '00:00.00';
    
    // Retour à l'écran de code
    enteredCode = '';
    updateCodeDisplay();
    showScreen('code');
});

// Initialisation
updateCodeDisplay();
