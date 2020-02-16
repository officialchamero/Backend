const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    pid: {
        type: mongoose.Schema.Types.String,
        ref: 'Product',
    },
    status: {
        type: String
    },
    uid: {
        type: mongoose.Schema.Types.String,
        ref: 'user',
    }

})
const Cart = mongoose.model('Cart', cartSchema)
module.exports = Cart 