"use strict";

const User = require('../models/user.model'); // Inkludera User-modellen
const bcrypt = require('bcrypt'); // Inkludera bcrypt för att hasha lösenord
const Jwt = require('@hapi/jwt'); // Inkludera jwt för att skapa JWT-token

// Hämta alla användare
exports.getAllUsers = async (req, h) => {
    try {
        // Hämta alla användare utom lösenorden
        const users = await User.find({}, { password: 0 });
        return h.response(users).code(200);
        // Fånga upp eventuella fel
    } catch (error) {
        console.error("Fel vid hämtning av användare: ", error);
        return h.response(error).code(500);
    }
};

// Hämta en användare med ett specifikt ID
exports.getUserById = async (req, h) => {
    try {
        // Hämta användaren med det specifika ID och exkludera lösenordet
        const user = await User.findById(req.params.id, { password: 0 });
        return h.response(user).code(200);
        // Fånga upp eventuella fel
    } catch (error) {
        console.error("Fel vid hämtning av användare: ", error);
        return h.response(error).code(500);
    }
}

// Skapa en användare
exports.createUser = async (req, h) => {
    try {
        // Extrahera användaruppgifter från payload
        const { email, password } = req.payload;

        // Kontrollera om e-postadressen redan finns
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return h.response({ error: "E-postadressen finns redan" }).code(400);
        }

        // Skapa en ny användare
        const user = new User({ email, password });

        // Spara användaren i databasen
        const savedUser = await user.save();

        // Returnera användars e-postadress med statuskod 201
        return h.response({ message: "Användare skapad", user: { email: savedUser.email } }).code(201);
    } catch (error) {
        // Kontrollera om felet är ett valideringsfel
        if (error.name === "ValidationError") {
            // Skapa ett objekt för att lagra valideringsfelen
            const errors = {};
            // Loopa igenom valideringsfelen och lägg till dem i errors-objektet
            Object.keys(error.errors).forEach((key) => {
                errors[key] = error.errors[key].message;
            });
            // Returnera felmeddelanden med statuskod 400
            return h.response(errors).code(400);
        }
        // Fånga upp andra fel och returnera med statuskod 500
        console.error("Fel vid skapande av användare: ", error);
        return h.response(error).code(500);
    }
}

// Ta bort en användare
exports.deleteUser = async (req, h) => {
    try {
        // Ta bort användaren med det specifika ID
        await User.findByIdAndDelete(req.params.id);
        return h.response({ message: "Användare borttagen" }).code(200);
        // Fånga upp eventuella fel
    } catch (error) {
        console.error("Fel vid borttagning av användare: ", error);
        return h.response(error).code(500);
    }
}

// Logga in en användare
exports.loginUser = async (req, h) => {
    try {
        // Extrahera e-post och lösenord från payload
        const { email, password } = req.payload;

        // Hämta användaren från databasen
        let user = await User.findOne({ email });

        // Kontrollera om användaren finns
        if (!user) {
            return h.response({ message: "Felaktig e-postadress/lösenord" }).code(401);
        }

        // Kontrollera lösenord
        const correctPassword = await bcrypt.compare(password, user.password);

        if (!correctPassword) {
            return h.response({ message: "Felaktig e-postadress/lösenord" }).code(401);
        }

        // Extrahera användarens ID och e-postadress
        const { email: userEmail } = user;

        // Generera en JWT-token för användaren
        const token = generateToken(user);

        // Returnera meddelande och användarens e-postadress samt sätt token i en cookie
        return h
            .response({ message: "Inloggning lyckades", user: { email: userEmail } })
            .state("jwt", token);
    } catch (error) {
        console.error("Fel vid inloggning: ", error);
        return h.response(error).code(500);
    }
}

// Logga ut en användare
exports.logoutUser = async (req, h) => {
    return h.response({ message: "Utloggning lyckades" }).unstate("jwt");
}

// Generera JWT-token
const generateToken = user => {
    const token = Jwt.token.generate(
        { user },
        { key: process.env.JWT_SECRET_KEY, algorithm: "HS256" },
        { ttlSec: 24 * 60 * 60 }
    );
    return token;
}