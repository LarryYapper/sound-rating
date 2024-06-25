const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

const soundsDir = path.join(__dirname, 'sounds');
const checkedDir = path.join(__dirname, 'Sounds_checked');
const reviewFile = path.join(__dirname, 'reviews.csv');

// Serve the index.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Get the list of sounds
app.get('/get-sounds', (req, res) => {
    fs.readdir(soundsDir, (err, files) => {
        if (err) {
            console.error('Error reading sounds directory:', err);
            return res.status(500).send('Error reading sounds directory');
        }
        if (files.length === 0) {
            // Send a response indicating no files were found
            return res.status(404).send('Děkuji, pane doktore, za Vaši práci!');
        }
        res.json(files);
    });
});

// Handle rating the sound
app.post('/rate-sound', (req, res) => {
    const { filename, rating } = req.body;
    if (!filename || !rating) {
        return res.status(400).send('Invalid data received');
    }

    const record = `${filename},${rating}\n`;

    fs.appendFile(reviewFile, record, (err) => {
        if (err) {
            console.error('Error writing to CSV:', err);
            return res.status(500).send('Error writing to CSV.');
        }

        const oldPath = path.join(soundsDir, filename);
        const newPath = path.join(checkedDir, filename);

        fs.rename(oldPath, newPath, (err) => {
            if (err) {
                console.error('Error moving file:', err);
                return res.status(500).send('Error processing review');
            }
            res.status(200).send('Review saved successfully');
        });
    });
});

// Endpoint to get the count ratio of sounds to Sounds_checked
app.get('/count-ratio', (req, res) => {
    fs.readdir(soundsDir, (err, soundsFiles) => {
        if (err) {
            console.error('Error reading sounds directory:', err);
            return res.status(500).send('Error reading sounds directory');
        }

        fs.readdir(checkedDir, (err, checkedFiles) => {
            if (err) {
                console.error('Error reading Sounds_checked directory:', err);
                return res.status(500).send('Error reading Sounds_checked directory');
            }

            const ratio = `${checkedFiles.length}:${soundsFiles.length}`;
            res.send(ratio);
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
