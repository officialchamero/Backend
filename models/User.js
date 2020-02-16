const mongoose = require('mongoose');
const jwt = require('jsonwebtoken')
const userSchema = new mongoose.Schema({

        fname: { 
            type: String 
        },
        lname: { 
            type: String   
        },
        username: { 
            type: String 
        },
        password: {  
            type: String 
        },
        email:{
            type:String
        },
        usertype:{
            type:String
        },
        image: {
            type: String
        },
        tokens:[{token: {type:String}}]
       
    })
        userSchema.statics.checkCrediantialsDb = async (user22, pass) =>{

            const user1 = await user.findOne({username : user22, password : pass})
             return user1;
    }
       userSchema.methods.generateAuthToken = async function () {
                const user = this
               const token = jwt.sign({ _id: user._id.toString() }, 'thisismynewcourse')
               
               console.log(token);
                user.tokens = user.tokens.concat({ token :token })
                await user.save()
                return token
               }
        
        const user= mongoose.model('user',userSchema)
        module.exports = user;
