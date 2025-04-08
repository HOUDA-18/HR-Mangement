// migrateDescriptors.js
const mongoose = require('mongoose');
const { User } = require('./models/user');
const db = require('./config/db.json');
mongoose.connect(db.mongo.uri)
.then(async () => {
  console.log('✅ Connecté à MongoDB');
  
  const users = await User.find({});
  for (const user of users) {
    if (user.faceDescriptor instanceof Buffer) {
      user.faceDescriptor = undefined; // Supprimer le descripteur
      await user.save();
      console.log(`🛑 Descripteur supprimé pour ${user.email}`);
    }
  }
  console.log('✅ Tous les descripteurs invalides ont été supprimés.');
  mongoose.disconnect();
})
.catch(err => console.error('❌ Erreur MongoDB:', err));