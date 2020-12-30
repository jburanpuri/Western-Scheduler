const express = require('express');
const path = require('path');
const cors = require('cors');
const connectToDb = require('./config/db');

const app = express();

//for aws or local host 5000
const PORT = process.env.PORT || 5000;

connectToDb(); //to connect to database

app.use(express.json({ extended: false }));

app.use(cors());
//routes for app.use
app.use('/api/users', require('./api/users'));
app.use('/api/courses', require('./api/courses'));
app.use('/api/schedule', require('./api/schedule'));


app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => (`Server started on port ${PORT}`));