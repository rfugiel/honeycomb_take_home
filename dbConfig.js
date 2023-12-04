import mongoose from 'mongoose';
const { connect, connection } = mongoose;

const ConnectionURL = 'mongodb://localhost:27017/honeycombProjectDB';

connect(ConnectionURL);

const db = connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("Connected successfully to MongoDB");
});

export default db;