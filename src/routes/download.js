const express = require('express');
const router = express.Router();
const pool = require("../databaseInterviews");
const formidable = require('formidable')
const fs = require('fs')
const { PythonShell } = require('python-shell');

router.get('/download', async (req, resp) => {
    const documents = await pool.query('SELECT * FROM  documents WHERE id_user = ?' ,[req.user.id]);
    resp.render('download/download', { documents });
});

router.post('/download', async (req, resp) => {
    var form = new formidable.IncomingForm();
    form.parse(req, async function (err, fields, files) {
        console.log(fields);
        var optData = fields.optData;
        var savetype = fields.savetype;
        var options = fields.options;
        let pyoptions = {
            mode: 'text',
            pythonOptions: ['-u'],
            scriptPath: 'src/lib',
            args: [optData, savetype, options] //hash del archivo seleccionado
        };
        console.log(optData);
        console.log(savetype);
        if (optData == undefined || savetype == undefined || options == undefined) {
            req.flash('success', 'Seleccione Archivo y tipo de archivo a descargar!');
            resp.redirect('/download/download');
        }
        else {
            const result = await new Promise((resolve, reject) => {
                PythonShell.run('download_mode_1.py', pyoptions, function (err, results) {                  
                    if (err) throw err;
                    return resolve(results);
                });
            });
            
            console.log("Downloading: " + result[0])
            //req.flash('success', "Se ha generado el archivo "+result[0]);
            //resp.end();
            //resp.redirect('/download')

            await resp.download(result[0], function (err) {
                if (err) throw err;
            })
        }


        //resp.end();
        //esp.redirect('/download/download')
    });
});



module.exports = router;