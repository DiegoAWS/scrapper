const express = require('express')
const cors = require('cors');
const fs = require('fs');
const { launchBrowser } = require('./src/launchBrowser');
const app = express()

let browser = null
let page = null

app.use(cors())
app.use(express.json());
app.use(express.static('frontend/build'));

const stateFilePath = "search.json"
const writeFile = (data) => {
    const text = JSON.stringify(data);
    fs.writeFileSync(stateFilePath, text);
}
const readFile = () => {
    if (!fs.existsSync(stateFilePath)) return {};

    try {
        const text = fs.readFileSync(stateFilePath);
        return JSON.parse(text);
    } catch (error) {
        return {}
    }
}

app.post('/api', function (req, res) {
    const data = req.body
    writeFile(data)

    res.json(req.body)
})

app.get('/state', function (req, res) {
    const data = readFile()
    res.json(data)
})


app.get('/close', function (req, res) {
  process.exit(0)
})

app.listen(3001, function () {
    console.log('Web server listening on port 3001')

    launchBrowser().then(({ browser: thisBrowser, page: thisPage }) => {
        console.log('Browser launched')
        writeFile({})
        browser = thisBrowser
        page = thisPage
    })
})
