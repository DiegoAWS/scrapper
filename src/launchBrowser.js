const puppeteer = require('puppeteer');

const launchBrowser = async () => {
    const browser = await puppeteer.launch({
        headless: false,
        userDataDir: './.localData',
        args:[
            "--start-fullscreen",
            "--kiosk",
            "--app"
            ],
        defaultViewport: null,
    });
    const page = await browser.newPage();

    await page.goto("http://localhost:3001");


    const pages = await browser.pages()
    let found = false
    pages.forEach(item => {
        const url = item.url()
        if (found || url !== "http://localhost:3001/") {
            item.close()
        } else{
            found=true
        }
    })
    return { browser, page };
}


module.exports = { launchBrowser } 