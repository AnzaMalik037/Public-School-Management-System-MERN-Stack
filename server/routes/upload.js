//C:\Users\Anza\Desktop\school3\school\server\routes\upload.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const FeeSlip = require('../models/FeeSlip');

// Define upload folder (make sure it's not inside "server")
const uploadFolder = path.join(__dirname, '..', 'uploads', 'fee-slips');

// Ensure upload folder exists
if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder, { recursive: true });
}

// Set up multer to store temporarily
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadFolder); // temporary name will be overwritten after rename
  },
  filename: function (req, file, cb) {
    const timestamp = Date.now();
    cb(null, `temp_${timestamp}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage });

// Route: POST /upload-receipt
router.post('/upload-receipt', upload.single('receipt'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const { studentName = 'unknownName', studentId = 'unknownID' } = req.body;

  const ext = path.extname(req.file.originalname);
  const safeName = studentName.trim().replace(/[^a-z0-9]/gi, '_');
  const newFileName = `${safeName}_${studentId}${ext}`;
  const newPath = path.join(uploadFolder, newFileName);

  fs.rename(req.file.path, newPath, async (err) => {
    if (err) {
      console.error('Rename error:', err);
      return res.status(500).json({ error: 'Rename failed' });
    }

    try {
      // Save relative path to MongoDB for frontend access
      const fileUrl = `/uploads/fee-slips/${newFileName}`;

      const slip = new FeeSlip({ url: fileUrl });
      await slip.save();

      res.status(200).json({
        message: 'Uploaded and saved',
        url: fileUrl,
      });
    } catch (dbErr) {
      console.error('DB error:', dbErr);
      res.status(500).json({ error: 'DB save failed' });
    }
  });
});


// GET all fee slips
router.get('/fee-slips', async (req, res) => {
  try {
    const slips = await FeeSlip.find().sort({ createdAt: -1 }); // Optional: latest first
    res.status(200).json(slips);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch fee slips' });
  }
});

module.exports = router;
