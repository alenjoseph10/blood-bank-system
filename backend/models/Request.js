const mongoose = require('mongoose');
const { isConnected, readData, writeData } = require('./fallbackHelper');

const requestSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
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
    category: {
      type: String,
      enum: ['Donor', 'Receiver'],
      required: true,
    },
    ailments: {
      type: String,
      default: 'None',
    },
    unitsRequired: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending',
    },
  },
  { timestamps: true }
);

const realRequestModel = mongoose.model('Request', requestSchema);

class RequestWrapper {
  constructor(data) {
    Object.assign(this, data);
    if (!this._id) {
      this._id = 'req_' + Math.random().toString(36).substr(2, 9);
    }
    if (this.status === undefined) {
      this.status = 'Pending';
    }
  }

  async save() {
    const data = readData();
    const existingIdx = data.requests.findIndex(r => r._id === this._id);
    if (existingIdx !== -1) {
      data.requests[existingIdx] = { ...this };
    } else {
      data.requests.push({ ...this });
    }
    writeData(data);
    return this;
  }
}

function Request(data) {
  if (isConnected()) {
    return new realRequestModel(data);
  } else {
    return new RequestWrapper(data);
  }
}

Request.find = function(query) {
  if (isConnected()) {
    return realRequestModel.find(query);
  } else {
    const data = readData();
    let requests = data.requests || [];
    if (query && query.userId) {
      requests = requests.filter(r => r.userId === query.userId);
    }
    const wrappers = requests.map(r => new RequestWrapper(r));
    return {
      populate: async function(path, select) {
        const users = data.users || [];
        wrappers.forEach(w => {
          if (w.userId) {
            const user = users.find(u => u._id === w.userId);
            if (user) {
              w.userId = {
                _id: user._id,
                email: user.email,
                name: user.name
              };
            }
          }
        });
        return wrappers;
      },
      then: function(resolve, reject) {
        resolve(wrappers);
      }
    };
  }
};

Request.findByIdAndUpdate = async function(id, updateData, options) {
  if (isConnected()) {
    return await realRequestModel.findByIdAndUpdate(id, updateData, options);
  } else {
    const data = readData();
    const idx = data.requests.findIndex(r => r._id === id);
    if (idx === -1) return null;
    const updated = { ...data.requests[idx], ...updateData };
    data.requests[idx] = updated;
    writeData(data);
    return new RequestWrapper(updated);
  }
};

module.exports = Request;
