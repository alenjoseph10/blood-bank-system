const express = require('express');
const { auth, adminAuth } = require('../middleware/auth');
const Request = require('../models/Request');
const router = express.Router();

router.get('/', adminAuth, async (req, res) => {
  try {
    const requests = await Request.find().populate('userId', 'email name');
    res.status(200).json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/my-requests', auth, async (req, res) => {
  try {
    const requests = await Request.find({ userId: req.user.id });
    res.status(200).json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const { name, age, email, phone, bloodType, category, ailments, unitsRequired } = req.body;

    if (!name || !age || !email || !phone || !bloodType || !category || !unitsRequired) {
      return res.status(400).json({ message: 'All required fields must be provided' });
    }

    const request = new Request({
      userId: req.user.id,
      name,
      age,
      email,
      phone,
      bloodType,
      category,
      ailments: ailments || 'None',
      unitsRequired,
      status: 'Pending',
    });

    await request.save();
    res.status(201).json({ message: 'Request created successfully', request });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:id', adminAuth, async (req, res) => {
  try {
    const { status } = req.body;

    if (!['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const request = await Request.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    res.status(200).json({ message: `Request ${status.toLowerCase()} successfully`, request });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
