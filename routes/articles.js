const express = require('express');
const router = express.Router();
const dbSingleton = require('../dbSingleton');
const multer = require('multer');
const path = require('path');

// Execute a query to the database
const db = dbSingleton.getConnection();

// router.get('/', (req, res) => {
//     const query = 'SELECT * FROM articles';
//     db.query(query, (err, results) => {
//         if (err) {
//             res.status(500).send(err);
//             return;
//         }
//         res.json(results);
//     });
// });

// router.post('/', (req, res) => {
//     const { title, content, author } = req.body;
//     const query = 'INSERT INTO articles  (title, content, author) VALUES (?, ?, ?)';
//     db.query(query, [title, content, author], (err, results) => {
//         if (err) {
//             res.status(500).send(err);
//             return;
//         }
//         res.json({ message: 'article added!', id: results.insertId });
//     });
// });
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { title, content, author } = req.body;
    const query = 'UPDATE articles SET title = ?, content = ?, author = ? WHERE id = ?';
    db.query(query, [title, content, author, id], (err, results) => {
        if (err) {
        res.status(500).send(err);
        return;
        }
        res.json({ message: 'article updated!' });
    });
});
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM articles WHERE id = ?';
    db.query(query, [id], (err, results) => {
        if (err) {
        res.status(500).send(err);
        return;
        }
        res.json({ message: 'article deleted!' });
    });
});
router.post('/articles', upload.single('image'), (req, res) => {
  const { title, content } = req.body;

  // Check if the file was uploaded
  if (!req.file) {
    return res.status(400).json({ message: 'Image file is required!' });
  }

  // Get information about the file
  const imageUrl = `/uploads/${req.file.filename}`;
  const query = 'INSERT INTO articles (title, content, author_id, image) VALUES (?, ?,?, ?)';
    db.query(query, [title, content,2, imageUrl], (err, results) => {
      if (err) {
        return res.status(500).send(err);
      }
      res.json({ 
        message: 'Article added!', 
        id: results.insertId, 
        article: {
          title,
          content,
          image: imageUrl
        } 
      });
    });

 
});

router.get('/post/:id', (req, res) => {
  const { id } = req.params;

  const query = 'SELECT id, title, content, image FROM articles WHERE id = ?';
  db.query(query, [id], (err, results) => {
      if (err) {
          return res.status(500).json({ error: 'Database error', details: err });
      }
      if (results.length === 0) {
          return res.status(404).json({ message: 'Article not found' });
      }

      const article = results[0];

      // If the article has an image, form the full URL
      if (article.image) {
          article.image = `${req.protocol}://${req.get('host')}${article.image}`;
      }

      res.json(article);
  });
});
router.get('/post', (req, res) => {
  const { id } = req.params;

  const query = 'SELECT id, title, content, image FROM articles';
  db.query(query, (err, results) => {
      if (err) {
          return res.status(500).json({ error: 'Database error', details: err });
      }
      if (results.length === 0) {
          return res.status(404).json({ message: 'Articles not found' });
      }

      res.json(results);
  });
});
module.exports = router; 
