const express = require('express');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const router = express.Router();
const UserDB = require('../DB/entities/potential_users.entity');
const projectsDB = require('../DB/entities/project.entity');

const upload = multer({ dest: 'uploads/' });

router.post('/potential_users', upload.single('file'), (req, res) => {
    const results = [];

    fs.createReadStream(req.file.path)
        .pipe(csv())
        .on('data', (data) => results.push({ ID: data.ID }))
        .on('end', () => {
            UserDB.insertMany(results, { ordered: false })
                .then(dbRes => res.status(201).json(dbRes))
                .catch(err => {
                    if (err.code === 11000) {
                        // Duplicate key error
                        res.status(400).json({ error: 'Duplicate IDs found in the file' });
                    } else {
                        res.status(400).json({ error: err.message });
                    }
                });
        });
});

router.post('/projects', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const results = [];
    const filePath = req.file.path;

    console.log('Started uploading');

    fs.createReadStream(filePath, { encoding: 'utf8' })
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('error', (error) => {
            console.error('Error while parsing CSV:', error);
            fs.unlinkSync(filePath); // Clean up the temp file
            res.status(500).json({ error: 'Error while parsing CSV' });
        })
        .on('end', () => {
            projectsDB.insertMany(results, { ordered: false })
                .then(dbRes => {
                    fs.unlinkSync(filePath); // Clean up the temp file
                    res.status(201).json(dbRes);
                })
                .catch(err => {
                    fs.unlinkSync(filePath); // Clean up the temp file
                    res.status(400).json({ error: err.message });
                });
        });
});

module.exports = router;