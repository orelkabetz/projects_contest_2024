const express = require('express');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const router = express.Router();
const UserDB = require('../DB/entities/potential_users.entity');

const upload = multer({ dest: 'uploads/' });

router.post('/', upload.single('file'), (req, res) => {
    const results = [];
  
    fs.createReadStream(req.file.path)
        .pipe(csv(['ID']))
        .on('data', (data) => results.push(data))
        .on('end', () => {
            // You now have an array of objects with IDs
            // Insert these into the database
            UserDB.insertMany(results, {ordered: false})
                .then(dbRes => res.status(201).json(dbRes))
                .catch(err => res.status(400).json({ error: err.message }));
        });
});

module.exports = router;