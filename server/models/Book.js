const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: [true, 'Book title is required'], 
        trim: true,
        index: true 
    },
    isbn: { 
        type: String, 
        required: [true, 'ISBN number is required'], 
        unique: true, 
        trim: true,
        index: true 
    },
    author: { 
        type: String, 
        required: [true, 'Author is required'], 
        trim: true,
        index: true 
    },
    publisher: { 
        type: String, 
        trim: true 
    },
    category: { 
        type: String, 
        required: [true, 'Category is required'], 
        trim: true,
        default: 'Computer Science',
        index: true 
    },
    rackLocation: { 
        type: String, 
        default: 'Rack A-1, Floor 2',
        trim: true 
    },
    totalCopies: { 
        type: Number, 
        default: 5,
        min: 1 
    },
    availableCopies: { 
        type: Number, 
        default: 5,
        min: 0 
    },
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department'
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    status: {
        type: String,
        enum: ['Available', 'Reserved', 'Out of Stock'],
        default: 'Available',
        index: true
    },
    isActive: { 
        type: Boolean, 
        default: true,
        index: true 
    }
}, { timestamps: true });

bookSchema.index({ title: 'text', author: 'text', category: 'text' });

module.exports = mongoose.model('Book', bookSchema);
