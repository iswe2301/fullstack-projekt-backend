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


// Pre-hook för att hasha lösenordet innan det sparas
userSchema.pre('save', async function (next) {
    // Kontrollera om lösenordet har ändrats eller är nytt
    if (!this.isModified('passwordHash')) return next();

    try {
        // Hasha lösenordet med bcrypt och salt (10 tecken)
        const salt = await bcrypt.genSalt(10);
        this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
        next();
    } catch (error) {
        next(error); // Skicka vidare felet om något går fel
    }
});

// Metod för att validera lösenordet vid inloggning
userSchema.methods.isValidPassword = async function (password) {
    return await bcrypt.compare(password, this.passwordHash); // Jämför lösenordet med hashen
};

// Skapa en modell för användare
const User = mongoose.model('User', userSchema);

// Exportera modellen
module.exports = User;