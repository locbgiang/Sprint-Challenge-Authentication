const express = require('express');
const session = require('express-session')
const cors = require('cors');
const helmet = require('helmet');

const authenticate = require('../auth/authenticate-middleware.js');
const authRouter = require('../auth/auth-router.js');
const jokesRouter = require('../jokes/jokes-router.js');

const server = express();

server.use(helmet());
server.use(cors());
server.use(express.json());

const sessionConfig = {
    cookie: {
        maxAge: 1000 * 60 * 60, //one hour in milliseconds
        secure: process.env.SECURE_COOKIE || false, //send the cookie only over https
        httpOnly: true, //true means client JS cannot access the cookie
    },
    resave: false,
    saveUninitialized: process.env.USER_ALLOW_COOKIE || true,
    name: 'COOKIE MONSTER',
    secret: process.env.COOKIE_SECRET || 'keepitsecret,keepitsafe!',
};
server.use(session(sessionConfig));


server.use('/api/auth', authRouter);
server.use('/api/jokes', authenticate, jokesRouter);
server.get('/',(req,res)=>{
    res.status(200).json({API:'UP'});
})


module.exports = server;
