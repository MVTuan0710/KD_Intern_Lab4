require('dotenv').config();
const express = require ('express');
const passport = require ('passport');
const LocalStrategy = require ('passport-local').Strategy;
const session = require ('express-session');
const jwt = require ('jsonwebtoken')
const app = express();

const {PORT,KEY_SESSION} = process.env;
const store = session.MemoryStore();

app.use(express.json());
app.use(session({
    saveUninitialized: false,
    secret: KEY_SESSION,
    cookie: {
        maxAge: 1000 * 20 // 10s
    },
    store
}))


app.use(passport.initialize());
app.use(passport.session());

const user = {
    username: "123",
    password: "123"
}


app.get('/profile', (req, res) => {
    if(req.isAuthenticated()){
        let token = jwt.sign({user: user.username}, 'shhhhh')
        return res.status(200).json({
            status: 'success',
            data: {
                token: token,
                name: 'anonystick',
                age: 38,
                blog: 'anonystick.com'
            }
        })
    }
    res.status(200).json({
        status: 'failed',
        message: 'Missing'
    })
    
})


app.post('/login',
    passport.authenticate('local',{
        successRedirect: '/profile',
        failureRedirect:'/login'
    }),
)

app.get('/login',(req,res,next)=>{
    try{
        
        let token = req.headers.token;
        let result = jwt.verify(token,'shhhhh');
        if(result){
            next();
        }
    }catch(error){
        return res.json('loi dang nhap');
    }
},
    (req,res)=>{
        res.send('welcome')
    }
)

passport.use(new LocalStrategy(function verify(username, password, done) {
    console.log (`username : ${username} , password: ${password}`)
    if(username=== user.username && password === user.password){
        
        
        return done (null,{
            username,
            password,
            active: true
        })
    }
    done(null,false)
}));

passport.serializeUser( (user, done) => done(null, user.username));

passport.deserializeUser( (username, done) => {
    console.log(`deserializeUser:::`, username);
    //check username
    if(username === user.username){
        return done(null, {
            username,
            active: true
        })
    }
    done(null, false)
})

app.get('/status',(req,res)=>{
    res.send("hello")
})
app.listen(PORT, ()=>{
    console.log(`ok at ${PORT}`);
})