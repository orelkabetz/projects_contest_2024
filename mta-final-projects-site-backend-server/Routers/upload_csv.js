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
        .pipe(csv(['ID']))
        .on('data', (data) => results.push(data))
        .on('end', () => {
            UserDB.insertMany(results, {ordered: false})
                .then(dbRes => res.status(201).json(dbRes))
                .catch(err => res.status(400).json({ error: err.message }));
        });
});

router.post('/projects', upload.single('file'), (req, res) => {
    const results = [];
  
    fs.createReadStream(req.file.path)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => {
            projectsDB.insertMany(results, {ordered: false})
                .then(dbRes => res.status(201).json(dbRes))
                .catch(err => res.status(400).json({ error: err.message }));
        });
});

module.exports = router;