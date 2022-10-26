var express = require('express')
var cors = require('cors');
const { launchBrowser } = require('./src/launchBrowser');
var app = express()

app.use(cors())
app.use(express.json());
app.use(express.static('frontend/build'));

app.post('/api', function (req, res) {
    console.log(req.body)
    res.json({ msg: 'ok' })
})

app.listen(3001, function () {
    console.log('Web server listening on port 3001')

    launchBrowser()
})
