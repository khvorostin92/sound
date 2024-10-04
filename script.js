const waves = [
    { amplitude: 50, frequency: 1 },  // 1st overtone
    { amplitude: 40, frequency: 2 },  // 2nd overtone
    { amplitude: 30, frequency: 3 },  // 3rd overtone
    { amplitude: 20, frequency: 4 },  // 4th overtone
    { amplitude: 10, frequency: 5 }   // 5th overtone
];

const canvases = [
    document.getElementById('waveCanvas1'),
    document.getElementById('waveCanvas2'),
    document.getElementById('waveCanvas3'),
    document.getElementById('waveCanvas4'),
    document.getElementById('waveCanvas5')
];

const combinedCanvas = document.getElementById('combinedWaveCanvas');
const combinedCtx = combinedCanvas.getContext('2d');

// Draw individual sine waves
function drawSineWave(ctx, amplitude, frequency) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.beginPath();
    for (let x = 0; x < ctx.canvas.width; x++) {
        const t = x / ctx.canvas.width * 4 * Math.PI;
        const y = amplitude * Math.sin(frequency * t);
        ctx.lineTo(x, ctx.canvas.height / 2 - y);
    }
    ctx.stroke();
}

// Draw initial waves
for (let i = 0; i < waves.length; i++) {
    const ctx = canvases[i].getContext('2d');
    drawSineWave(ctx, waves[i].amplitude, waves[i].frequency);
}

// Normalize the combined wave to fit the canvas
function normalizeWave(yValues) {
    const maxAmplitude = Math.max(...yValues.map(Math.abs));  // Find the max amplitude
    const scaleFactor = (combinedCanvas.height / 2) / maxAmplitude;
    return yValues.map(y => y * scaleFactor);  // Scale the wave values
}

// Combined waveform
function drawCombinedWave() {
    combinedCtx.clearRect(0, 0, combinedCtx.canvas.width, combinedCtx.canvas.height);
    combinedCtx.beginPath();
    let yValues = [];
    for (let x = 0; x < combinedCtx.canvas.width; x++) {
        const t = x / combinedCtx.canvas.width * 4 * Math.PI;
        let y = 0;
        if (document.getElementById('wave1').checked) {
            y += waves[0].amplitude * Math.sin(waves[0].frequency * t);
        }
        if (document.getElementById('wave2').checked) {
            y += waves[1].amplitude * Math.sin(waves[1].frequency * t);
        }
        if (document.getElementById('wave3').checked) {
            y += waves[2].amplitude * Math.sin(waves[2].frequency * t);
        }
        if (document.getElementById('wave4').checked) {
            y += waves[3].amplitude * Math.sin(waves[3].frequency * t);
        }
        if (document.getElementById('wave5').checked) {
            y += waves[4].amplitude * Math.sin(waves[4].frequency * t);
        }
        yValues.push(y);
    }

    // Normalize the wave to fit the canvas height
    const normalizedYValues = normalizeWave(yValues);

    for (let x = 0; x < normalizedYValues.length; x++) {
        combinedCtx.lineTo(x, combinedCtx.canvas.height / 2 - normalizedYValues[x]);
    }
    combinedCtx.stroke();
}

document.getElementById('wave1').addEventListener('change', drawCombinedWave);
document.getElementById('wave2').addEventListener('change', drawCombinedWave);
document.getElementById('wave3').addEventListener('change', drawCombinedWave);
document.getElementById('wave4').addEventListener('change', drawCombinedWave);
document.getElementById('wave5').addEventListener('change', drawCombinedWave);

// Initial combined wave draw
drawCombinedWave();

// Web Audio API setup
let audioCtx;
let gainNodes = [];
let oscillators = [];

function createOscillator(frequency, index) {
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(frequency * 100, audioCtx.currentTime); // Frequency in Hz
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    gainNodes[index] = gainNode;

    return osc;
}

// Play button logic
document.getElementById('playButton').addEventListener('click', () => {
    // Initialize audio context and oscillators when Play button is pressed
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        oscillators = waves.map((wave, index) => createOscillator(wave.frequency, index));
        oscillators.forEach(osc => osc.start());
    }

    oscillators.forEach((osc, index) => {
        const gainNode = gainNodes[index];
        if (document.getElementById(`wave${index + 1}`).checked) {
            gainNode.gain.setValueAtTime(1, audioCtx.currentTime);  // Full volume
        } else {
            gainNode.gain.setValueAtTime(0, audioCtx.currentTime);  // Mute the overtone
        }
    });

    // Stop oscillators after 2 seconds
    setTimeout(() => {
        oscillators.forEach(osc => osc.stop());
        // Reset audio context and oscillators for future use
        audioCtx = null;
        oscillators = [];
        gainNodes = [];
    }, 2000); // Play for 2 seconds
});
