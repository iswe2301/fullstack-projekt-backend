"use strict";

const Cookie = require("@hapi/cookie"); // Importera cookie-plugin
const Jwt = require("@hapi/jwt"); // Importera JWT-plugin
require("dotenv").config(); // Läs in .env-fil

module.exports = {
    register: async (server) => {
        // Registrera plugins för cookie och JWT
        await server.register([Cookie, Jwt]);

        // Registrera cookie-strategi
        server.auth.strategy("session", "cookie", {
            cookie: {
                name: "jwt", // Cookie-namn
                password: process.env.COOKIE_PASSWORD, // Hemligt lösenord för att kryptera cookien
                isSecure: true, // Kräver HTTPS
                ttl: 24 * 60 * 60 * 1000, // Giltig i 24 timmar
                isSameSite: "None", // För CORS-anrop
                clearInvalid: true,
                isHttpOnly: true,
            },
            // Validera cookien
            validate: async (request, session) => {
                try {
                    // Dekoda token från cookien
                    const token = session;
                    if (!token) {
                        console.warn("Ingen token hittades i sessionen");
                        return { isValid: false };
                    }

                    // Dekoda och verifiera JWT-token
                    const artifacts = Jwt.token.decode(token);

                    try {
                        Jwt.token.verify(artifacts, {
                            key: process.env.JWT_SECRET_KEY,
                            algorithms: ["HS256"],
                        });

                        // Returnera autentiseringsinformation
                        return {
                            isValid: true,
                            credentials: artifacts.decoded.payload,
                        };
                        // Fånga fel vid verifiering
                    } catch (err) {
                        console.error("Fel vid verifiering av token: ", err.message);
                        return { isValid: false };
                    }
                    // Fånga valideringsfel
                } catch (err) {
                    console.error("Valideringsfel: ", err.message);
                    return { isValid: false };
                }
            },
        });

        // Sätt default-strategi till "session"
        server.auth.default("session");
    },
};