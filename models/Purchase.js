const mongoose = require('mongoose');

const PurchaseSchema = new mongoose.Schema({
    pid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    status: {
        type: String
    },
    uid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }

})
const Purchase = mongoose.model('Purchase', PurchaseSchema)
module.exports = Purchase 