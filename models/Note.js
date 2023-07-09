const mongoose = require('mongoose');

const {Schema, model} = mongoose;

const noteSchema = new Schema (
    {
        title: {
            type: String,
            required: true,
        },

        content: {
            type: String,
            default: 'no content written',
        },

        createdOn: {
            type: Date,
            required: true,
            default: Date.now(),
        },

        lastEditedAt: { 
            type: Date,
            required: true,
            default: Date.now(),
        }
    }
);


noteSchema.pre('save',function (next) {
    this.slug = this.title.split(' ').join('%20');
    next();
});

const Note = model('Note',noteSchema);

module.exports = Note;

