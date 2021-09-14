var express = require("express");
var cors = require('cors')
var fs = require('fs');
var path = require('path')
var app = express();

app.use(cors());
app.use(express.json());



function dataAtualFormatada() {
    var data = new Date(),
        dia = data.getDate().toString(),
        diaF = (dia.length == 1) ? '0' + dia : dia,
        mes = (data.getMonth() + 1).toString(), //+1 pois no getMonth Janeiro começa com zero.
        mesF = (mes.length == 1) ? '0' + mes : mes,
        anoF = data.getFullYear();

    return diaF + "-" + mesF + "-" + anoF + '_' + data.getTime();
}


app.post("/callback", (req, res, next) => {
    try {
        const date = dataAtualFormatada();
        const filename = `log_${date}.json`;

        const log = JSON.stringify(req.body)

        fs.writeFileSync('./logs/' + filename, log)

        res.status(200).send({ ok: true, message: 'Callback recebido!' })

    } catch (e) {
        res.status(400).send({ ok: false, error: e.toString(), stack: e })
    }
});


app.get("/log", (req, res, next) => {
    try {
        const directoryPath = path.join(__dirname, 'logs');

        var results = []
        fs.readdir(directoryPath, function(err, files) {
            if (err) {
                res.status(400).send({ ok: false, error: err.toString(), stack: err })
                return console.log('Unable to scan directory: ' + err);
            }

            files.forEach(function(file) {
                results.push(`/logs/${file}`)
            });

            res.status(200).send({ ok: true, files: files })

        });

    } catch (e) {
        res.status(400).send({ ok: false, error: e.toString(), stack: e })
    }
});


app.get("/logs/:filename", (req, res, next) => {
    try {
        const directoryPath = path.join(__dirname, 'logs');

        var file = fs.readFileSync(directoryPath + '/' + req.params.filename)

        res.send(file)

    } catch (e) {
        res.status(400).send({ ok: false, error: e.toString(), stack: e })
    }
});



app.listen(3000, () => {
    console.log("Server running on port 3000");
});