const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { isConnected, readData, writeData } = require('./fallbackHelper');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const realUserModel = mongoose.model('User', userSchema);

class UserWrapper {
  constructor(data) {
    Object.assign(this, data);
    if (!this._id) {
      this._id = 'user_' + Math.random().toString(36).substr(2, 9);
    }
  }

  async save() {
    const data = readData();
    if (this.password && !this.password.startsWith('$2a$') && !this.password.startsWith('$2b$')) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
    const existingIdx = data.users.findIndex(u => u.email.toLowerCase() === this.email.toLowerCase());
    if (existingIdx !== -1) {
      data.users[existingIdx] = { ...this };
    } else {
      data.users.push({ ...this });
    }
    writeData(data);
    return this;
  }

  async matchPassword(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
  }
}

function User(data) {
  if (isConnected()) {
    return new realUserModel(data);
  } else {
    return new UserWrapper(data);
  }
}

User.findOne = async function(query) {
  if (isConnected()) {
    return await realUserModel.findOne(query);
  } else {
    const data = readData();
    const email = query.email ? query.email.toLowerCase() : null;
    const user = data.users.find(u => u.email.toLowerCase() === email);
    if (!user) return null;
    return new UserWrapper(user);
  }
};

module.exports = User;
