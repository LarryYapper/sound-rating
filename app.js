document.getElementById('start-session').addEventListener('click', startSession);
document.getElementById('end-session').addEventListener('click', endSession);
document.getElementById('good-quality').addEventListener('click', () => rateSound('good'));
document.getElementById('bad-quality').addEventListener('click', () => rateSound('bad'));

let sounds = [];
let currentSoundIndex = -1;

function startSession() {
    fetch('/get-sounds')
        .then(response => response.json())
        .then(data => {
            sounds = data;
            currentSoundIndex = -1;
            document.getElementById('start-session').style.display = 'none';
            document.getElementById('end-session').style.display = 'block';
            document.getElementById('player-container').style.display = 'block';
            playNextSound();
            updateCountRatio(); // Call this function to update the ratio
        });
}

function updateCountRatio() {
    fetch('/count-ratio')
        .then(response => response.text())
        .then(ratio => {
            document.getElementById('count-ratio').textContent = `Files Ratio (Checked/Sounds): ${ratio}`;
        });
}
function endSession() {
    document.getElementById('start-session').style.display = 'block';
    document.getElementById('end-session').style.display = 'none';
    document.getElementById('player-container').style.display = 'none';
    sounds = [];
    currentSoundIndex = -1;
    alert('Děkuji za Váš čas!');
}

function playNextSound() {
    currentSoundIndex++;
    if (currentSoundIndex < sounds.length) {
        const audioPlayer = document.getElementById('audio-player');
        const currentSoundInfo = document.getElementById('current-sound-info');
        const currentSound = sounds[currentSoundIndex];
        
        audioPlayer.src = `sounds/${currentSound}`;        
        currentSoundInfo.textContent = `${currentSound}`; // Update the UI with the current sound's filename
        audioPlayer.play();
    } else {
        endSession();
    }
}

function rateSound(rating) {
    if (currentSoundIndex < sounds.length) {
        const soundFile = sounds[currentSoundIndex];
        fetch('/rate-sound', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ filename: soundFile, rating })
        }).then(() => {
            playNextSound();
        });
    }
}
