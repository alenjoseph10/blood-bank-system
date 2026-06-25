const mongoose = require('mongoose');
const { isConnected, readData, writeData } = require('./fallbackHelper');

const donorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    bloodType: {
      type: String,
      enum: ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'],
      required: true,
    },
    ailments: {
      type: String,
      default: 'None',
    },
    lastDonationDate: {
      type: Date,
      default: null,
    },
    unitsAvailable: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const realDonorModel = mongoose.model('Donor', donorSchema);

class DonorWrapper {
  constructor(data) {
    Object.assign(this, data);
    if (!this._id) {
      this._id = 'donor_' + Math.random().toString(36).substr(2, 9);
    }
    if (this.unitsAvailable === undefined) {
      this.unitsAvailable = 0;
    }
    if (this.ailments === undefined) {
      this.ailments = 'None';
    }
  }

  async save() {
    const data = readData();
    const existingIdx = data.donors.findIndex(d => d._id === this._id);
    if (existingIdx !== -1) {
      data.donors[existingIdx] = { ...this };
    } else {
      data.donors.push({ ...this });
    }
    writeData(data);
    return this;
  }
}

function Donor(data) {
  if (isConnected()) {
    return new realDonorModel(data);
  } else {
    return new DonorWrapper(data);
  }
}

Donor.find = async function() {
  if (isConnected()) {
    return await realDonorModel.find();
  } else {
    const data = readData();
    return data.donors.map(d => new DonorWrapper(d));
  }
};

Donor.findByIdAndUpdate = async function(id, updateData, options) {
  if (isConnected()) {
    return await realDonorModel.findByIdAndUpdate(id, updateData, options);
  } else {
    const data = readData();
    const idx = data.donors.findIndex(d => d._id === id);
    if (idx === -1) return null;
    const updated = { ...data.donors[idx], ...updateData };
    data.donors[idx] = updated;
    writeData(data);
    return new DonorWrapper(updated);
  }
};

Donor.findByIdAndDelete = async function(id) {
  if (isConnected()) {
    return await realDonorModel.findByIdAndDelete(id);
  } else {
    const data = readData();
    const idx = data.donors.findIndex(d => d._id === id);
    if (idx === -1) return null;
    const deleted = data.donors.splice(idx, 1)[0];
    writeData(data);
    return new DonorWrapper(deleted);
  }
};

module.exports = Donor;
