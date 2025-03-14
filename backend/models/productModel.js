import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'category', required: true },
    stock: { type: Number, required: true, default: 0 }
})

const product = mongoose.model('product', productSchema);

export default product;