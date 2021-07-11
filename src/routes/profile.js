const express = require('express');
const router = express.Router();
const { isLoggedIn, isNotLoggedIn } = require('../lib/auth');
const pool = require('../databaseInterviews');
const helpers = require('../lib/helpers');

// EDIT USER
router.get('/profile/:id/',isLoggedIn, async (req,resp)=>{
    const {id} = req.params;
    const users =await pool.query('SELECT * FROM users WHERE id=?',[id]);
    console.log(users[0]);
    resp.render('profile',{ user: users[0] }); 
});



router.post('/profile/:id/',isLoggedIn,async (req,resp)=>{
    const {id} = req.params;
    let {fullname, username, password } = req.body;

    password = await helpers.encryptPassword(password);
    await  pool.query('UPDATE users SET fullname = ?, username = ?, password = ? WHERE id = ?', [fullname, username, password, id]);
    req.flash('success','Cambios guardados');
    resp.redirect('/profile/'+id);
});

  module.exports = router;
  