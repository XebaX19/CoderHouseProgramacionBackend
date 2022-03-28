const admin = require('firebase-admin');
const serviceAccount = require('./firebase.config.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});
console.log('Connected to Firestore!');

module.exports.admin = admin