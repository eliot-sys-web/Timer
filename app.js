// Configuration
let targetNumber = 50;
let enteredCode = '';
let timerInterval = null;
let startTime = 0;
let elapsedTime = 0;
let isRunning = false;

// Éléments DOM
const codeScreen = document.querySelector('.code-screen');
const timerScreen = document.querySelector('.timer-screen');
const codeDisplay = document.getElementById('codeDisplay');
const currentCodeDisplay = document.getElementById('currentCode');
const timerDisplay = document.getElementById('timerDisplay');
const targetInput = document.getElementById('targetInput');
const validateBtn = document.getElementById('validateBtn');
const startStopBtn = document.getElementById('startStopBtn');
const resetBtn = document.getElementById('resetBtn');

// Debug info
const debugCode = document.getElementById('debugCode');
const debugTarget = document.getElementById('debugTarget');
const debugForced = document.getElementById('debugForced');

// Navigation
function showScreen(screenName) {
    codeScreen.classList.remove('active');
    timerScreen.classList.remove('active');
    
    if (screenName === 'code') {
        codeScreen.classList.add('active');
    } else if (screenName === 'timer') {
        timerScreen.classList.add('active');
    }
}

// Gestion du clavier
document.querySelectorAll('.key-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const num = btn.dataset.num;
        
        if (num === 'C') {
            enteredCode = '';
        } else if (num === 'DEL') {
            enteredCode = enteredCode.slice(0, -1);
        } else {
            if (enteredCode.length < 2) {
                enteredCode += num;
            }
        }
        
        updateCodeDisplay();
    });
});

function updateCodeDisplay() {
    const display = enteredCode || '--';
    codeDisplay.textContent = display;
    currentCodeDisplay.textContent = display;
    
    // Activer/désactiver le bouton de validation
    validateBtn.disabled = enteredCode.length === 0;
}

// Validation et passage au timer
validateBtn.addEventListener('click', () => {
    if (enteredCode.length > 0) {
        targetNumber = parseInt(targetInput.value);
        
        const code = parseInt(enteredCode);
        const forcedResult = calculateForcedCentiseconds(targetNumber, code);
        
        debugCode.textContent = code;
        debugTarget.textContent = targetNumber;
        debugForced.textContent = forcedResult;
        
        showScreen('timer');
    }
});

// Calcul des centièmes forcés
function calculateForcedCentiseconds(target, code) {
    let result = target - code;
    while (result < 0) result += 100;
    while (result >= 100) result -= 100;
    return result;
}

// Timer
function formatTime(ms, forcedCentiseconds = null) {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
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

// Service Worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js');
}
