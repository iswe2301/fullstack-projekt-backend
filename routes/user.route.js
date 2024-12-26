"use strict";

const UserController = require("../controllers/user.controller"); // Importera användarcontroller

// Exportera routes
module.exports = (server) => {
    // Skapa en array med routes
    server.route([
        {
            method: "GET",
            path: "/users",
            handler: UserController.getAllUsers,
        },
        {
            method: "GET",
            path: "/users/{id}",
            handler: UserController.getUserById,
        },
        {
            method: "POST",
            path: "/users",
            handler: UserController.createUser,
            options: {
                auth: false, // Inget skydd för registrering
            },
        },
        {
            method: "DELETE",
            path: "/users/{id}",
            handler: UserController.deleteUser,
        },
        {
            method: "POST",
            path: "/login",
            handler: UserController.loginUser,
            options: {
                auth: false, // Inget skydd för inloggning
            },
        },
        {
            method: "POST",
            path: "/logout",
            handler: UserController.logoutUser,
        },
    ]);
};