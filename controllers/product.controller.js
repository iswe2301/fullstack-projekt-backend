"use strict";

const Product = require('../models/product.model'); // Inkludera Product-modellen

// Hämta alla produkter
exports.getProducts = async (req, h) => {
    try {
        // Hämta alla produkter från databasen
        const products = await Product.find();
        // Kontrollera om inga produkter hittades och returnera 404
        if (products.length === 0) {
            return h.response("Inga produkter hittades").code(404);
        }
        // Returnera produkterna med statuskod 200 om allt gick bra
        return h.response(products).code(200);
        // Fånga upp eventuella fel
    } catch (error) {
        console.error("Fel vid hämtning av produkter: ", error);
        return h.response(error).code(500);
    }
};

// Hämta en produkt baserat på ID
exports.getProductById = async (req, h) => {
    try {
        // Hämta produkten baserat på ID
        const product = await Product.findById(req.params.id);
        // Kontrollera om produkten inte hittades och returnera 404
        if (!product) {
            return h.response("Produkten hittades inte").code(404);
        }
        // Returnera produkten med statuskod 200 om allt gick bra
        return h.response(product).code(200);
        // Fånga upp eventuella fel
    } catch (error) {
        console.error("Fel vid hämtning av produkt: ", error);
        return h.response(error).code(500);
    }
};

// Skapa en ny produkt
exports.createProduct = async (req, h) => {
    try {
        // Skapa en ny produkt baserat på datan i request.payload
        const product = new Product(req.payload);
        const savedProduct = await product.save();
        // Returnera den sparade produkten med statuskod 201 om allt gick bra
        return h.response({
            message: "Produkt skapad",
            product: savedProduct
        }).code(201);
        // Fånga upp eventuella fel
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
        // Fånga upp eventuella andra fel och returnera dem
        console.error("Fel vid skapande av produkt: ", error);
        return h.response(error).code(500);
    }
};

// Uppdatera en produkt baserat på ID
exports.updateProduct = async (req, h) => {
    try {

        // Hämta produkten baserat på ID
        const { stock } = req.payload;

        // Uppdatera isinStock och stockStatus baserat på det nya lagersaldot
        const updateFields = {
            ...req.payload,
            isinStock: stock > 0,
            stockStatus:
                stock === 0
                    ? "Slut i lager"
                    : stock < 6
                        ? "Få kvar"
                        : "I lager",
        };

        // Uppdatera produkten
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            updateFields,
            { new: true, runValidators: true }
        );

        // Kontrollera om produkten finns
        if (!updatedProduct) {
            return h.response("Produkten hittades inte").code(404);
        }

        // Returnera den uppdaterade produkten med statuskod 200 
        return h.response({ message: "Produkten har uppdaterats", updatedProduct });

        // Fånga upp eventuella fel
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
        // Fånga upp eventuella andra fel och returnera dem
        console.error("Fel vid skapande av produkt: ", error);
        return h.response(error).code(500);
    }   // Fånga upp eventuella fel
};

// Ta bort en produkt baserat på ID
exports.deleteProduct = async (req, h) => {
    try {
        // Ta bort produkten baserat på ID
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        // Kontrollera om produkten inte hittades och returnera 404
        if (!deletedProduct) {
            return h.response("Produkten hittades inte").code(404);
        }
        // Returnera den borttagna produkten med statuskod 200 om allt gick bra
        return h.response("Produkten har tagits bort").code(200);
        // Fånga upp eventuella fel
    } catch (error) {
        console.error("Fel vid borttagning av produkt: ", error);
        return h.response(error).code(500);
    }
};

