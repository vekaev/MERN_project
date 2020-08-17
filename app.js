const express = require('express');
const config = require('config');
const mongoose = require('mongoose');

const app = express();

app.use('/api/auth', require('./routes/auth.routes'));

const PORT = config.get('port') || 50010;

async function start() {
    try {
        await mongoose.connect(config.get('mongoUri'), {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });
        app.listen(PORT, () => {
            console.warn('app started' + PORT)
        });
    } catch (e) {
        console.log('error', e.message);
        process.exit(1);
    }
};

start();

