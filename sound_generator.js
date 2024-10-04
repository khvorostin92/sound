const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const oscillator = audioContext.createOscillator();
const gainNode = audioContext.createGain();
oscillator.connect(gainNode);
gainNode.connect(audioContext.destination);

const frequencyControl = document.getElementById('frequency');
const frequencyValue = document.getElementById('freq-value');
const amplitudeControl = document.getElementById('amplitude');
const amplitudeValue = document.getElementById('amp-value');
const canvas = document.getElementById('visualization');
const ctx = canvas.getContext('2d');

oscillator.type = 'sine';

document.getElementById('start-button').addEventListener('click', () => {
    audioContext.resume().then(() => {
        oscillator.start();
    });
});

frequencyControl.addEventListener('input', function() {
    const frequency = frequencyControl.value;
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    frequencyValue.textContent = `${frequency} Hz`;
});

amplitudeControl.addEventListener('input', function() {
    const amplitude = amplitudeControl.value;
    gainNode.gain.setValueAtTime(amplitude, audioContext.currentTime);
    amplitudeValue.textContent = amplitude;
});

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const frequency = oscillator.frequency.value;
    const amplitude = gainNode.gain.value;
    const time = audioContext.currentTime;

    // Рассчитываем частоту колебаний мембраны
    const membraneFrequency = Math.log10(frequency) * 2;
    const x = canvas.width / 2 + Math.sin(time * membraneFrequency * 2 * Math.PI) * amplitude * 100;
    const y = canvas.height / 2;

    // Рисуем мембрану (круг)
    ctx.beginPath();
    ctx.arc(x, y, 30, 0, 2 * Math.PI); // Радиус круга равен 30
    ctx.fillStyle = 'red';
    ctx.fill();
    requestAnimationFrame(draw);
}

draw();
