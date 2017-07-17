const DataStore = require('nedb');
const db = new DataStore({ filename: 'subscribers.db', autoSave: true });

module.exports = db;