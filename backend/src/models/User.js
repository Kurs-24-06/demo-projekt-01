// user model für mongodb mit mongoose
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// schema definiert die struktur der user dokumente in der collection
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    // einfache email validierung über regex
    match: [/^\S+@\S+\.\S+$/, 'Bitte gib eine gültige E-Mail-Adresse ein']
  },
  password: {
    type: String,
    required: true,
    // das passwort wird im controller gehasht, nicht hier angezeigt
    minlength: 8
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date,
    default: null
  }
}, { timestamps: true });

// pre-save hook der vor dem speichern ausgeführt wird
// hasht das passwort falls es geändert wurde
userSchema.pre('save', async function(next) {
  const user = this;
  
  // nur hashen wenn das passwort geändert wurde
  if (!user.isModified('password')) return next();
  
  try {
    // salt generieren (10 rounds ist ein guter wert für sicherheit vs. performance)
    const salt = await bcrypt.genSalt(10);
    
    // passwort mit salt hashen
    const hashedPassword = await bcrypt.hash(user.password, salt);
    
    // plain passwort mit dem hash ersetzen
    user.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

// methode zum vergleichen des passworts (für login)
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    // bcrypt vergleicht den hash mit dem eingegebenen passwort
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

// model erstellen und exportieren
module.exports = mongoose.model('User', userSchema);