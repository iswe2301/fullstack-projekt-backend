"use strict";

const mongoose = require('mongoose'); // Inkludera Mongoose
const bcrypt = require('bcrypt'); // Inkludera bcrypt för att hasha lösenord

// Skapa ett schema för användare
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Du måste ange en e-postadress"],
        unique: [true, "E-postadressen finns redan"],
        match: [/.+\@.+\..+/, "Ange en giltig e-postadress"] // Validera att e-posten är en giltig epost-adress
    },
    password: {
        type: String,
        required: [true, "Du måste ange ett lösenord"],
        validate: {
            validator: function (value) {
                // Validera att lösenordet är minst 8 tecken långt, innehåller minst en stor bokstav och minst en siffra
                return /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/.test(value);
            },
            message: "Lösenordet måste vara minst 8 tecken långt och innehålla minst en stor bokstav och en siffra"
        }
    }
}, { timestamps: true }); // Skapar "createdAt" och "updatedAt"


// Pre-hook för att hasha lösenordet innan det sparas
userSchema.pre('save', async function (next) {
    // Kontrollera om lösenordet har ändrats eller är nytt
    if (!this.isModified('password')) return next();

    try {
        // Hasha lösenordet med bcrypt och salt (10 tecken)
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error); // Skicka vidare felet om något går fel
    }
});

// Metod för att validera lösenordet vid inloggning
userSchema.methods.isValidPassword = async function (password) {
    return await bcrypt.compare(password, this.password); // Jämför lösenordet med hashen
};

// Skapa en modell för användare
const User = mongoose.model('User', userSchema);

// Exportera modellen
module.exports = User;