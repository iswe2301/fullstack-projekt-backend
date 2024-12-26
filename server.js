"use strict";

const Hapi = require('@hapi/hapi'); // Importera Hapi
const connectToDB = require('./config/db'); // Importera db-anslutning
require('dotenv').config(); // Läs miljövariabler från .env
const auth = require('./auth'); // Importera autentisering

const init = async () => {
    // Anslut till databasen
    await connectToDB();

    // Skapa hapi-servern
    const server = Hapi.server({
        port: 5000,
        host: 'localhost',
        routes: {
            cors: {
                origin: ['http://localhost:3000', 'https://www.thunderclient.com', 'http://127.0.0.1:5500', 'http://localhost:5500', 'http://localhost:5000'],
                credentials: true,
                maxAge: 86400,
                headers: ["Accept", "Content-Type", "Access-Control-Allow-Origin"]
            }
        },
    });

    // Registrera autentisering
    await auth.register(server);

    // Registrera routes
    require('./routes/user.route')(server);
    require('./routes/product.route')(server);

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