const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const pool = require('../databaseInterviews');
const helpers = require('./helpers');
const fileUpload = require('express-fileupload');
passport.use('local.signin', new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, username, password, done) => {
  const rows = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
  if (rows.length > 0) {
    const user = rows[0];
    const validPassword = await helpers.matchPassword(password, user.password)
    if (validPassword) {
      done(null, user, req.flash('success', 'Bienvenido/a ' + user.fullname));
    } else {
      done(null, false, req.flash('message', 'Contraseña incorrecta'));
    }
  } else {
    return done(null, false, req.flash('message', 'El nombre de usuario no existe.'));
  }
}));

passport.use('local.signup', new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, username, password, done) => {
    let sampleFile;
    let uploadPath;
    
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send('No files were uploaded.');
    }
    console.log("REQFILES "+req.files);
    // name of the input is sampleFile
    sampleFile = req.files.sampleFile;
    uploadPath = __dirname + '/upload/' + sampleFile.name;
  
    // Use mv() to place file on the server
    sampleFile.mv(uploadPath, function (err) {
      if (err) return res.status(500).send(err);
      console.log('Correctr! '+uploadPath);
      res.send('File uploaded');
    });
 
  const { fullname } = req.body;
  let profile_image = uploadPath;

  console.log("FULLNAME "+fullname);
  console.log("uploadPath "+profile_image);
  let newUser = {
    fullname,
    username,
    password,
    profile_image
  };
  newUser.password = await helpers.encryptPassword(password);
  // Saving in the Database
  const result = await pool.query('INSERT INTO users SET ? ', newUser);
  newUser.id = result.insertId;
  return done(null, newUser);
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const rows = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
  done(null, rows[0]);
});

