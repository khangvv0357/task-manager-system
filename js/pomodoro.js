let timeLeft = 45 * 60;
let timerId = null;

const timerDisplay = document.getElementById('timer');
const startBtn = document.getElementById('start-btn');
const resetBtn = document.getElementById('reset-btn');

function updateDisplay() {
    let m = Math.floor(timeLeft / 60);
    let s = timeLeft % 60;
    timerDisplay.textContent = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

startBtn.addEventListener('click', () => {
    if (timerId) clearInterval(timerId);
    startBtn.disabled = true;
    timerId = setInterval(() => {
        timeLeft--;
        updateDisplay();
        if (timeLeft <= 0) {
            clearInterval(timerId);
            alert("Hết giờ! Nghỉ ngơi thôi!");
            startBtn.disabled = false;
        }
    }, 1000);
});

resetBtn.addEventListener('click', () => {
    clearInterval(timerId);
    timeLeft = 45 * 60;
    startBtn.disabled = false;
    updateDisplay();
});