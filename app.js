// Configuration
let targetNumber = 50;
let enteredCode = '';
let timerInterval = null;
let startTime = 0;
let elapsedTime = 0;
let isRunning = false;

// Éléments DOM
const screens = {
    code: document.querySelector('.code-screen'),
    settings: document.querySelector('.settings-screen'),
    timer: document.querySelector('.timer-screen')
};

const codeDisplay = document.getElementById('codeDisplay');
const targetNumberDisplay = document.getElementById('targetNumber');
const timerDisplay = document.getElementById('timerDisplay');
const startStopBtn = document.getElementById('startStopBtn');
const resetBtn = document.getElementById('resetBtn');
const codeInfo = document.getElementById('codeInfo');
const targetInfo = document.getElementById('targetInfo');
const resultInfo = document.getElementById('resultInfo');
const settingsBtn = document.getElementById('settingsBtn');
const backBtn = document.getElementById('backBtn');
const saveBtn = document.getElementById('saveBtn');
const targetInput = document.getElementById('targetInput');

// Navigation entre écrans
function showScreen(screenName) {
    Object.values(screens).forEach(screen => screen.classList.remove('active'));
    screens[screenName].classList.add('active');
}

// Pavé numérique
document.querySelectorAll('.num-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const num = btn.dataset.num;
        
        if (num === 'C') {
            enteredCode = '';
            codeDisplay.textContent = '--';
        } else if (num === 'OK') {
            if (enteredCode.length >= 1) {
                validateCode();
            }
        } else {
            if (enteredCode.length < 2) {
                enteredCode += num;
                codeDisplay.textContent = enteredCode.padStart(2, '-');
            }
        }
    });
});

// Validation du code
function validateCode() {
    const code = parseInt(enteredCode);
    const result = calculateForcedCentiseconds(targetNumber, code);
    
    codeInfo.textContent = code;
    targetInfo.textContent = targetNumber;
    resultInfo.textContent = result;
    
    showScreen('timer');
}

// Calcul des centièmes forcés
function calculateForcedCentiseconds(target, code) {
    let result = target - code;
    // Assurer que le résultat est entre 0 et 99
    while (result < 0) result += 100;
    while (result >= 100) result -= 100;
    return result;
}

// Timer
function formatTime(ms, forcedCentiseconds = null) {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const centiseconds = forcedCentiseconds !== null ? forcedCentiseconds : Math.floor((ms % 1000) / 10);
    
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(centiseconds).padStart(2, '0')}`;
}

function updateTimer() {
    const now = Date.now();
    elapsedTime = now - startTime;
    
    // Affichage normal pendant que le timer tourne
    timerDisplay.textContent = formatTime(elapsedTime);
}

startStopBtn.addEventListener('click', () => {
    if (!isRunning) {
        // Démarrer
        startTime = Date.now() - elapsedTime;
        timerInterval = setInterval(updateTimer, 10);
        isRunning = true;
        startStopBtn.classList.add('running');
        startStopBtn.querySelector('span').textContent = 'Arrêter';
    } else {
        // Arrêter avec centièmes forcés
        clearInterval(timerInterval);
        isRunning = false;
        
        const code = parseInt(enteredCode);
        const forcedCentiseconds = calculateForcedCentiseconds(targetNumber, code);
        
        // Afficher avec les centièmes truqués
        timerDisplay.textContent = formatTime(elapsedTime, forcedCentiseconds);
        
        startStopBtn.classList.remove('running');
        startStopBtn.querySelector('span').textContent = 'Démarrer';
    }
});

resetBtn.addEventListener('click', () => {
    clearInterval(timerInterval);
    isRunning = false;
    elapsedTime = 0;
    timerDisplay.textContent = '00:00.00';
    startStopBtn.classList.remove('running');
    startStopBtn.querySelector('span').textContent = 'Démarrer';
    
    // Retour à l'écran de code
    enteredCode = '';
    codeDisplay.textContent = '--';
    showScreen('code');
});

// Réglages
settingsBtn.addEventListener('click', () => {
    targetInput.value = targetNumber;
    showScreen('settings');
});

backBtn.addEventListener('click', () => {
    showScreen('code');
});

saveBtn.addEventListener('click', () => {
    const newTarget = parseInt(targetInput.value);
    if (newTarget >= 0 && newTarget <= 99) {
        targetNumber = newTarget;
        targetNumberDisplay.textContent = targetNumber;
        localStorage.setItem('targetNumber', targetNumber);
        showScreen('code');
    }
});

// Charger les paramètres sauvegardés
const savedTarget = localStorage.getItem('targetNumber');
if (savedTarget) {
    targetNumber = parseInt(savedTarget);
    targetNumberDisplay.textContent = targetNumber;
}

// Mise à jour de l'heure dans la barre de statut
function updateStatusTime() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    document.querySelectorAll('.time-status').forEach(el => {
        el.textContent = `${hours}:${minutes}`;
    });
}
updateStatusTime();
setInterval(updateStatusTime, 60000);

// Service Worker pour PWA
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js');
}
