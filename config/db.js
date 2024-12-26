"use strict";

const mongoose = require('mongoose'); // Importera Mongoose

// Funktion för att ansluta till databasen
const connectToDB = async () => {
    try {
        // Anslut till MongoDB med Mongoose
        await mongoose.connect(process.env.DATABASE);
        console.log('Ansluten till MongoDB');
    } catch (error) {
        console.error('Kunde inte ansluta till MongoDB:', error.message);
        process.exit(1); // Avsluta om anslutningen misslyckas
    }
};

module.exports = connectToDB; // Exportera funktionen för att ansluta till databasen