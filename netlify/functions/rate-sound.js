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
