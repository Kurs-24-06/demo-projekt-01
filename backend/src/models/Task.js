// task model für mongodb mit mongoose
const mongoose = require('mongoose');

// schema definiert die struktur der dokumente in der collection
const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,  // title ist pflichtfeld
    trim: true       // whitespace am anfang/ende wird entfernt
  },
  description: {
    type: String,
    trim: true
  },
  completed: {
    type: Boolean,
    default: false    // standardwert ist false für neue tasks
  },
  // referenz auf den user, dem der task gehört
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now  // automatisch aktuelles datum setzen
  }
}, { timestamps: true });

// index für schnellere abfragen nach user
taskSchema.index({ user: 1, createdAt: -1 });

// model erstellen und exportieren
// das model stellt die schnittstelle zur datenbank dar
// damit kann man create, read, update, delete operationen ausführen
module.exports = mongoose.model('Task', taskSchema);