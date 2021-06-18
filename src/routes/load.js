const express = require('express');
const router = express.Router();
const pool = require("../databaseInterviews");
const formidable = require('formidable')
const fs = require('fs')
const {PythonShell} = require('python-shell');
const mv = require('mv');
app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true})); 

router.get('/add', (req,resp)=>{
    resp.render('load/add');
});

router.post('/add', async (req,resp)=>{
    const form = new formidable.IncomingForm();
    form.parse(req, async function (err, fields, files) {
        if(files.filename.name != ""){
            filename = files.filename.name;
            var filetype = filename.split(".")[1]
            var oldpath = files.filename.path;
            var newpath = 'src/files/originalfiles/' + filename;
            mv(oldpath, newpath, function(err){
                if (err) throw err;
            });

            let options = {
                        mode: 'text',
                        scriptPath: 'src/lib/',
                        args: [newpath]
                    };

                const result = await new Promise((resolve, reject) => {
                    PythonShell.run('show_headers.py', options, function (err, results) {
                      if (err) throw err;
                      //console.log('finished');
                      return resolve(results);
                    });
                });
                console.log(result)
                var output = result[0]
                var name_file = result[1]
                var file_short = result[2]
                console.log(output,name_file)
                output = output.split(",")
                //console.log(output[1])
                resp.render('load/add', {results: output, file: name_file, file_short: file_short, file_msg: "Se ha cargado el archivo en:"});
        }

        if(fields.opts != "" && fields.fname != ""){
            let options = {
                mode: 'text',
                scriptPath: 'src/lib/',
                args: [fields.fname, fields.opts, req.user.id]
            };
            //console.log(options)
            const result = await new Promise((resolve, reject) => {
                PythonShell.run('check_files.py', options, function (err, results) {
                  if (err) throw err;
                  //console.log('finished');
                  return resolve(results);
                });
            });
            console.log(result)
            req.flash('success',result[1]);
            resp.end();
            resp.redirect('/load/add')
            //console.log(fields.opts, fields.fname)
        }
        
    });

});

module.exports = router;