const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', err => {
    console.log('UNCAUGHT EXCEPTION! Shutting down...');
    console.log(err.name, err.message);
    process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./app');


const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})
    .then(con => {
        // console.log(con.connections);
        console.log('MongoDB Connected...')
    })
// .catch(err => console.log(`COULD NOT CONNECT TO MONGODB: ${err}`));


// console.log(app.get('env'));
// console.log(process.env);

// START SERVER
const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => console.log(`APP RUNNING ON PORT ${PORT}...`));

process.on('unhandledRejection', err => {
    console.log('UNHANDLED REJECTION! Shutting down...');
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1); // Uncaught exception
    });
});