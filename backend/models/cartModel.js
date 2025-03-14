import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'user'},
    products: [{
        product: {type: mongoose.Schema.Types.ObjectId, ref: 'product'},
        quantity: {type: Number, required: true, default: 1}
    }]
})

export default mongoose.model('cart', cartSchema)