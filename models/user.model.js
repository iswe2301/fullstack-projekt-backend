"use strict";

const mongoose = require('mongoose'); // Inkludera Mongoose

// Skapa ett schema för användare
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Du måste ange en e-postadress"],
        unique: true, // Säkerställer att e-post är unik i databasen
        match: [/.+\@.+\..+/, "Ange en giltig e-postadress"] // Validera att e-posten är en giltig epost-adress
    },
    passwordHash: {
        type: String,
        required: [true, "Du måste ange ett lösenord"]
    }
}, { timestamps: true }); // Skapar "createdAt" och "updatedAt"

// Skapa en modell för användare
const User = mongoose.model('User', userSchema);

// Exportera modellen
module.exports = User;