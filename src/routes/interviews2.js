const express = require('express');
const router = express.Router();
const pool = require("../databaseInterviews");

router.get('/:order', async (req, res) => {

   let query = 'SELECT idDialogInterview FROM AustenRiggs.DialogInterviews';
   const {order} = req.params;
   console.log("HOLA");
   const Interviews = await pool.query(query);
   const Cat = await pool.query('select title,id_cat_tag from cat_tags');
   res.render('interviews/all', {Interviews:Interviews,Categories:Cat});
   //res.render('interviews/all', {Interviews:Interviews,Categories:Cat,Text:t});
});

router.get('/watch/:id', async (req, res) => {
   const { id } = req.params;
   console.log("HOLA ID");
   const consultinterview = await pool.query('select * from AustenRiggs.DialogInterviews where idDialogInterview = ?', [id]);
   const consultCategories = await pool.query('select id_cat_tag,title,color from cat_tags');
   var categories = [];
   categories.push(consultCategories);
   categories = categories[0];
   const categoriesInDialog = await pool.query('Select title from tagged_process join cat_tags on tagged_process.id_cat_tag=cat_tags.id_cat_tag where idDialogInterview =?',[id]);
   const tags = await pool.query('Select stamp,sentence,startpos,title,cat_tags.color from tagged_process join cat_tags on tagged_process.id_cat_tag=cat_tags.id_cat_tag where idDialogInterview =?',[id]);
   res.render('interviews/watch', { interview: toArray(consultinterview), idInterview: id, categories: consultCategories, tags: tags,categoriesDialog:categoriesInDialog});
});
router.post('/watch/:id',async(req,res)=>{
   const body = req.body;
   const sbody = JSON.parse(JSON.stringify(body));
   var titles="";
   for (const key in sbody) {
      if (sbody.hasOwnProperty(key)) {
         titles += `,"${key}"`;        
      }
   }
   titles = titles.substring(1);
   const { id } = req.params;
   const consultinterview = await pool.query('select * from AustenRiggs.DialogInterviews where idDialogInterview = ?', [id]);
   const consultCategories = await pool.query('select id_cat_tag,title,color from cat_tags');
   const categoriesInDialog = await pool.query(`Select title from tagged_process join cat_tags on tagged_process.id_cat_tag=cat_tags.id_cat_tag where idDialogInterview =?`,[id]);
   const query =`Select stamp,sentence,startpos,title,cat_tags.color from tagged_process join cat_tags on tagged_process.id_cat_tag=cat_tags.id_cat_tag where idDialogInterview =${id}`.concat((titles != "")? ` and title in (${titles})`:"");
   const tags = await pool.query(query);
   res.render('interviews/watch', { interview: toArray(consultinterview), idInterview: id, categories: consultCategories, tags: tags,categoriesDialog:categoriesInDialog});
});
router.post('/TagsFromInterview/:id', async (req, res) => {
   const { id } = req.params;
   const tags = await pool.query('Select stamp,sentence,title,cat_tags.color,startpos from tagged_process join cat_tags on tagged_process.id_cat_tag=cat_tags.id_cat_tag where idDialogInterview = ? ',[id]);
   res.json(tags);
});
router.post('/addTag', async (req, res) => {
   //Optimizar
   var recibed = req.body.newTags;
   var tagged_text = req.body.tagged_text;
   //console.log(tagged_text)
   if(recibed.length<=0){
      res.sendStatus(200);
      return;
   }
   const id_cat_tags = await pool.query('select id_cat_tag,title from cat_tags');
   var categories = [];
   categories.push(id_cat_tags);
   categories = categories[0];
   //console.log(recibed);
   const idDialogInterview = recibed[0].idDialogInterview;
   await recibed.forEach(async (element) => {
      var category = categories.find((e) => e.title.toLowerCase() == element.id_cat_tag.toLowerCase());
      if (category == undefined) {
         await pool.query('INSERT INTO cat_tags set ?', [{ title: element.id_cat_tag, color: element.color }]);
         var tquery = await pool.query(`select id_cat_tag from cat_tags where title = "${element.id_cat_tag}"`);
         var aux=[];
         aux.push(tquery);
         aux=aux[0];
         element.id_cat_tag=aux.map((e)=>e.id_cat_tag)[0];
      }else{
         element.id_cat_tag = category.id_cat_tag;
      }
      delete element.color;

      //var rows = await pool.query(`select * from tagged_process where idDialogInterview = ${element.idDialogInterview} and stamp = ${element.stamp}`);
      //console.log(element.sentence)
      //var rows = await pool.query(`select * from tagged_process where sentence = '${element.sentence}'`);
      //if (rows.length == 0 ||rows == undefined) {
      pool.query('insert into tagged_process set ?', [element]);
      pool.query('UPDATE DialogInterviews SET tagged = ? WHERE idDialogInterview = ?', [tagged_text, idDialogInterview]);
      return;
      //} 
   });
   req.flash('success','Texto etiquetado satisfactoriamente');
   res.sendStatus(200);
});
router.post('/deleteTag', async (req, res) => {
   var tag = req.body;
   console.log(req.body)
   var findetag = await pool.query(`select sentence, id_cat_tag, startpos from tagged_process where sentence = '${tag.sentence}' and idDialogInterview =${tag.idDialogInterview}`);
   if (findetag.length == 0 || findetag == undefined) {
      return;
   }
   await pool.query(`delete from tagged_process where sentence = '${tag.sentence}' and idDialogInterview = ${tag.idDialogInterview}`);
   res.sendStatus(200);
});
function toArray(consult) {
   var out = [];
   for (const key in consult) {
      let element = consult[key];
      let _person = "I";
      /*if (consult[key].typePerson == 1) {
         _person = "I";
      } else {
         _person = "S";
      }*/
      element.content = element.content.trim();
      out.push({ content: element.content, person: _person, line: element.stamp });
      
   }
   return out;
}

module.exports = router;
