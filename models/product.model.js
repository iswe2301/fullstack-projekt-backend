"use strict";

const mongoose = require('mongoose'); // Inkludera Mongoose

// Skapa ett schema för produkter och validera datan
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Du måste ange ett namn"]
    },
    description: {
        type: String,
        required: [true, "Du måste ange en beskrivning"],
        maxlength: [500, "Beskrivningen får max vara 500 tecken"]
    },
    price: {
        type: Number,
        required: [true, "Du måste ange ett pris"],
        min: [0, "Lägsta pris är 0"]
    },
    stock: {
        type: Number,
        required: [true, "Du måste ange antal i lager"],
        min: [0, "Lägsta antal i lager är 0"]
    },
    isinStock: {
        type: Boolean,
        default: true
    },
    stockStatus: {
        type: String,
        default: "I lager"
    },
    category: {
        type: String,
        required: [true, "Du måste ange en kategori"]
    },
    subcategory: {
        type: String,
        required: [true, "Du måste ange en underkategori"]
    },
    imageUrl: {
        type: String
    },
}, { timestamps: true }); // Skapar "createdAt" och "updatedAt"

// Pre-hook för att uppdatera isinStock och stockStatus baserat på stock
productSchema.pre('save', function (next) {
    
    // Sätt isinStock baserat på om stock är större än 0 eller inte (true/false)
    this.isinStock = this.stock > 0;

    // Uppdatera stockStatus baserat på lagersaldot
    if (this.stock === 0) {
        this.stockStatus = "Slut i lager";
    } else if (this.stock < 6) {
        this.stockStatus = "Få kvar";
    } else {
        this.stockStatus = "I lager";
    }

    next();
});

// Skapa en modell för produkter
const Product = mongoose.model('Product', productSchema);

// Exportera modellen
module.exports = Product;
