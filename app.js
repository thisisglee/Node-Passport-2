const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const mongoose = require('mongoose')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('passport')

//Passport config
require('./config/passport')(passport)

const app = express()

//DB config
const db = require('./config/keys').MongoURI

//connect to mongo
mongoose.connect(db, { useNewUrlParser: true , useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected...'))
    .catch( err => console.log(err))

//Middleware for EJS
app.use(expressLayouts)
app.set('view engine', 'ejs')


//Body parser
app.use(express.urlencoded({ extended: false }))

// Express Session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  }))

//passport midleware
app.use(passport.initialize());
app.use(passport.session());

//conncet flash
app.use(flash())

//Global Vars
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    next()
} )

//Routes
app.use('/', require('./routes/index'))

//Users
app.use('/users', require('./routes/users'))


const PORT = process.env.PORT || 5000

app.listen(PORT, console.log(`Serving started on PORT ${PORT}`))