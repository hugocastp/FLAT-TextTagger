const express =  require('express');
const router =  express.Router();

const pool = require("../databaseInterviews");

router.get('/add',(req,resp)=>{
    resp.render('tags/add');
});
//se envia en el header
router.post('/add',async (req,resp)=>{
    const {title, color, id_user} = req.body;
    const newtag ={
        title,
        color,
        id_user: req.user.id
    };
    console.log(newtag);
    await pool.query('INSERT INTO cat_tags set ?',[newtag]);
    req.flash('success','Categoría agregada satisfactoriamente');
    resp.redirect('/tags');
});

router.get('/',async (req,res)=>{
    const tags = await pool.query('SELECT * FROM  cat_tags WHERE id_user = ?' ,[req.user.id]);
    console.log(tags)
    res.render('tags/list',{tags});
});

router.get('/delete/:id/',async (req,resp)=>{
    /* console.log(req.params.id);
    resp.send('Deleted'); */
    const {id} = req.params;
    await pool.query('DELETE FROM cat_tags WHERE id_cat_tag =?',[id]);
    req.flash('success','Categoría eliminada satisfactoriamente');
    resp.redirect('/tags');
});
router.get('/edit/:id/',async (req,resp)=>{
    const {id} = req.params;
    const tags=await pool.query('SELECT * FROM cat_tags WHERE id_cat_tag =?',[id]);
    console.log(tags[0]);
    resp.render('tags/edit',{ tag: tags[0] }); 
});
router.post('/edit/:id/',async (req,resp)=>{
    const {id} = req.params;
    const {title,color} = req.body;
    const newtag ={
        title,
        color
    };
    await pool.query('UPDATE cat_tags set ? WHERE id_cat_tag =?',[newtag,id]);
    req.flash('success','Categoría actualizada satisfactoriamente');
    resp.redirect('/tags'); 
});
module.exports = router;
 