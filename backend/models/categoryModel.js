import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    name: { type: String, unique: true, required: true }
});

const categories = mongoose.model('categories', categorySchema);

export default categories;