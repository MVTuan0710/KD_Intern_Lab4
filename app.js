const express = require ('express');
const passport = require ('passport');
const LocalStrategy = require ('passport-local').Strategy;
const session = require ('express-session');
require('dotenv').config();

const {PORT,KEY_SESSION} = process.env;
const app = express();

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
        return res.status(200).json({
            status: 'success',
            data: {
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
    (req,res)=>{
    try{
        console.log(req)
        res.json({    
            body: req.body
        })
    }catch(error){
        res.json({
            error: error.stack
        })
    }

})



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