// Shri Ganesh
const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const morgan = require("morgan"); 
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
const session = require('express-session');
const app = express();

dotenv.config({path:'config.env'});
const PORT = process.env.PORT || 8000

const connectDB = require('./server/db/db');

// middleware
app.use(morgan('tiny'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(cookieParser());

//Session Middleware
const oneDay = 1000 * 60 * 60 * 24;
app.use(session({
    secret: 'sky',
    resave: false,
    saveUninitialized : true,
    cookie: {
        httpOnly: true,
        maxAge: oneDay}
}))

//set view/template engine
app.set('view engine', 'ejs');



//mongoDB call COnnection/ DB Function call
connectDB();


//load assests
app.use('/css',express.static(path.resolve(__dirname,"assets/css")));
app.use('/img',express.static(path.resolve(__dirname,"assets/img")));
app.use('/icon',express.static(path.resolve(__dirname,"assets/icon")));
app.use('/js',express.static(path.resolve(__dirname,"assets/js")));

//set routes
app.use("/",require('./server/routes/routes'));


app.listen(PORT,()=>{
    console.log(`Server is running on port http://localhost:${PORT} 👍`);
})