const { User } = require('./models')
const express = require('express')


const app = express()
const AAA = '9999'
app.use(express.json())
app.get('/users',async(req,res) => {
    const users = await User.find()
    res.send(users)
})
app.post('/register',async(req,res) => {
    console.log('====',req.body)
    const user = await User.create({
        username: req.body.username,
        password: req.body.password,
    })
    res.send(user)
})

const auth = async (req,res,next) => {
    const raw = String(req.headers.authorization).split(' ').pop()
    const jwt = require('jsonwebtoken')
    const { id }  = jwt.verify(raw,AAA)
   
    req.user = await User.findById(id)

    next()

}

app.get('/userinfo',auth,async(req,res) => {
    return res.send(req.user)
})


app.post('/login',async(req,res) => {
    const user = await User.findOne({
        username: req.body.username
    })
    if(!user){
        return res.status(422).send({
            msg: '用户名不存在'
        })
    }

    const passwordValid = require('bcrypt').compareSync(req.body.password,user.password)

    if(!passwordValid){
        return res.status(422).send({
            msg: '密码错了'
        })
    }
    //生成token
    const jwt = require('jsonwebtoken')
    const token = jwt.sign({
        id: String(user._id),
    },AAA)
    res.send({
        user:{
            username: user.username,
        },
        token: token
    })
})

app.listen(3001,() => {
    console.log('3000 port')
})