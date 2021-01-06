const express = require('express');
const path = require('path');
const cors = require('cors');
const connectToDb = require('./database/db');

const app = express();

//for aws or local host 5000
const PORT = process.env.PORT || 5000;

connectToDb(); //to connect to database

app.use(express.json({ extended: false }));

app.use(cors());
//routes for api
app.use('/api/users', require('./api/users'));
app.use('/api/courses', require('./api/courses'));
app.use('/api/schedule', require('./api/schedule'));
app.use('/api/docs', require('./api/docs'));
app.use('/api/auth', require('./api/authentication'));

app.use(express.static(path.join(__dirname, 'www')));
app.get('*', (req,res)=> {
    res.sendFile(path.join(__dirname, '/www/index.html'));
});

app.listen(PORT, () => (`Server started on port ${PORT}`));