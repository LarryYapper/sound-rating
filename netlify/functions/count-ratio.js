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
