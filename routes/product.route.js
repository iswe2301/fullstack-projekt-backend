"use strict";

const ProductController = require("../controllers/product.controller"); // Importera produktcontroller

// Exportera routes
module.exports = (server) => {
    // Skapa en array med routes
    server.route([
        {
            method: "GET",
            path: "/products",
            handler: ProductController.getProducts,
        },
        {
            method: "GET",
            path: "/products/{id}",
            handler: ProductController.getProductById,
        },
        {
            method: "POST",
            path: "/products",
            handler: ProductController.createProduct,
        },
        {
            method: "PUT",
            path: "/products/{id}",
            handler: ProductController.updateProduct,
        },
        {
            method: "DELETE",
            path: "/products/{id}",
            handler: ProductController.deleteProduct,
        },
    ]);
};