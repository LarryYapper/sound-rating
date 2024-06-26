const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

const soundsDir = path.join(__dirname, 'public/sounds');
const checkedDir = path.join(__dirname, 'public/Sounds_checked');
const reviewFile = path.join(__dirname, 'public/reviews.csv');

// Serve the index.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Get the list of sounds
app.get('/api/get-sounds', (req, res) => {
    fs.readdir(soundsDir, (err, files) => {
        if (err) {
            console.error('Error reading sounds directory:', err);
            return res.status(500).json({ error: 'Error reading sounds directory' });
        }
        if (files.length === 0) {
            return res.status(404).json({ message: 'Všechny nahrávky ohodnoceny. Děkuji, pane doktore, za Vaši práci!' });
        }
        res.json(files);
    });
});

// Handle rating the sound
app.post('/api/rate-sound', (req, res) => {
    const { filename, rating } = req.body;
    if (!filename || !rating) {
        return res.status(400).json({ error: 'Invalid data received' });
    }

    const record = `${filename},${rating}\n`;

    fs.appendFile(reviewFile, record, (err) => {
        if (err) {
            console.error('Error writing to CSV:', err);
            return res.status(500).json({ error: 'Error writing to CSV.' });
        }

        const oldPath = path.join(soundsDir, filename);
        const newPath = path.join(checkedDir, filename);

        fs.rename(oldPath, newPath, (err) => {
            if (err) {
                console.error('Error moving file:', err);
                return res.status(500).json({ error: 'Error processing review' });
            }
            res.status(200).json({ message: 'Review saved successfully' });
        });
    });
});

// Endpoint to get the count ratio of sounds to Sounds_checked
app.get('/api/count-ratio', (req, res) => {
    fs.readdir(soundsDir, (err, soundsFiles) => {
        if (err) {
            console.error('Error reading sounds directory:', err);
            return res.status(500).json({ error: 'Error reading sounds directory' });
        }

        fs.readdir(checkedDir, (err, checkedFiles) => {
            if (err) {
                console.error('Error reading Sounds_checked directory:', err);
                return res.status(500).json({ error: 'Error reading Sounds_checked directory' });
            }

            const ratio = `${checkedFiles.length}:${soundsFiles.length}`;
            res.json({ ratio });
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
