"use strict";

const Hapi = require('@hapi/hapi'); // Importera Hapi
const connectToDB = require('./config/db'); // Importera db-anslutning
require('dotenv').config(); // Läs miljövariabler från .env

const init = async () => {
    // Anslut till databasen
    await connectToDB();

    // Skapa hapi-servern
    const server = Hapi.server({
        port: 5000,
        host: 'localhost',
    });

    // Starta servern
    await server.start();
    console.log(`Server körs på: ${server.info.uri}`);
};

// Hantera oväntade fel
process.on('unhandledRejection', (err) => {
    console.error(err);
    process.exit(1);
});

init(); // Starta servern