const express = require('express')
const cors = require('cors');
const fs = require('fs');
const { launchBrowser } = require('./src/launchBrowser');
const { sendSearchRequest } = require('./src/sendSearchRequest');
const app = express()
const { createServer } = require("http");
const { Server } = require("socket.io");
const port = 3001


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

app.post('/start', function (req, res) {
    const data = req.body
    writeFile(data)
    sendSearchRequest(browser, data)
    res.json(req.body)
})

app.get('/state', function (req, res) {
    const data = readFile()
    res.json(data)
})


app.get('/close', function (req, res) {
  process.exit(0)
})


// app.listen(port, function () {
//     console.log(`Example app listening on port ${port}!`)
 
// })

const httpServer = createServer(app);
const io = new Server(httpServer, { /* options */ });

io.on("connection", (socket) => {
  console.log("a user connected");
});

httpServer.listen(port);

launchBrowser().then(({ browser: thisBrowser, page: thisPage }) => {
    console.log('Browser launched')
    writeFile({})
    browser = thisBrowser
    page = thisPage
})