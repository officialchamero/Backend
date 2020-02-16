const mongoose = require('mongoose');
const ProductSchema = new mongoose.Schema({

    prodimagename:{
    type: String
    },

    prodname: { 
        type: String   
    },
    prodtype: { 
        type: String   
    },
    prodprice: { 
        type: String   
    }
    
})
        
    const Product= mongoose.model('Product',ProductSchema)
    module.exports = Product; 
    