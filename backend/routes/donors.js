const express = require('express');
const { auth, adminAuth } = require('../middleware/auth');
const Donor = require('../models/Donor');
const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const donors = await Donor.find();
    
    const hasAilments = (ailments) => {
      if (!ailments) return false;
      const clean = ailments.toLowerCase().trim();
      return clean !== 'none' && clean !== 'no' && clean !== '' && clean !== 'n/a';
    };

    if (req.user && req.user.role === 'admin') {
      const filtered = donors.filter(d => !hasAilments(d.ailments));
      return res.status(200).json(filtered);
    }
    res.status(200).json(donors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', adminAuth, async (req, res) => {
  try {
    const { name, age, email, phone, bloodType, ailments } = req.body;

    if (!name || !age || !email || !phone || !bloodType) {
      return res.status(400).json({ message: 'All required fields must be provided' });
    }

    const donor = new Donor({
      name,
      age,
      email,
      phone,
      bloodType,
      ailments: ailments || 'None',
      unitsAvailable: 1,
    });

    await donor.save();
    res.status(201).json({ message: 'Donor added successfully', donor });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:id', adminAuth, async (req, res) => {
  try {
    const { name, age, email, phone, bloodType, ailments, unitsAvailable } = req.body;

    const donor = await Donor.findByIdAndUpdate(
      req.params.id,
      { name, age, email, phone, bloodType, ailments, unitsAvailable },
      { new: true, runValidators: true }
    );

    if (!donor) {
      return res.status(404).json({ message: 'Donor not found' });
    }

    res.status(200).json({ message: 'Donor updated successfully', donor });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const donor = await Donor.findByIdAndDelete(req.params.id);

    if (!donor) {
      return res.status(404).json({ message: 'Donor not found' });
    }

    res.status(200).json({ message: 'Donor deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
