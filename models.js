const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/login-with-token',{
    useNewUrlParser:true,
    useCreateIndex:true 
})
const UserSchema = new mongoose.Schema({
    username: {type:String,unique:true},
    password: {type:String,
        set(val){
            return require('bcrypt').hashSync(val,10)
        }
    },
})
const User = mongoose.model('User',UserSchema)
//清空表
// User.db.dropCollection('users')

module.exports = { User }