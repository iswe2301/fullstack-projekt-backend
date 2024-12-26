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
        port: process.env.PORT || 3000, // Använd port 3000 om ingen port anges i .env
        host: process.env.HOST || 'localhost', // Använd localhost om ingen host anges i .env
        routes: {
            cors: {
                origin: ["*"], // Tillåt alla CORS-anrop
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