const express = require('express');
const morgan = require('morgan');
const path = require('path');
const exphbs = require('express-handlebars');
const session = require('express-session');
const flash = require('connect-flash');
const validator = require('express-validator');
const passport = require('passport');
const MySQLStore = require('express-mysql-session')(session);
const { database } = require('./keys');
const app = express();
require('./lib/passport');

//Settings
app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
  defaultLayout: 'main',
  layoutsDir: path.join(app.get('views'), 'layouts'),
  partialsDir: path.join(app.get('views'), 'partials'),
  extname: '.hbs',
  helpers: require('./lib/handlebars')
}))
app.set('view engine', '.hbs');

// Middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({extended:false}));
app.use(express.json());


var sessionStore = new MySQLStore(database);
app.use(session({
    secret: 'mainsession',
    resave:false,
    saveUninitialized:false,
    store: sessionStore
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(validator());
app.use(require('connect-flash')());

//Global variables
app.use((req, res, next) => {
  app.locals.message = req.flash('message');
  app.locals.success = req.flash('success');
  app.locals.user = req.user;
  next();
});

//Routes
app.use(require('./routes'));
app.use(require('./routes/authentication'));
app.use(require('./routes/profile'));
app.use('/tags',require('./routes/tags')); 
app.use('/interviews',require('./routes/interviews'));
app.use('/load',require('./routes/load'));
app.use('/download',require('./routes/download'));

//Public
app.use(express.static(path.join(__dirname, 'public')));


//Starting the server
app.listen(app.get('port'),()=>{
  console.log('Server en el puerto',app.get('port'));
}); 
