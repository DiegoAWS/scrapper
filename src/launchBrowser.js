const puppeteer = require('puppeteer');

const launchBrowser = async () => {
    const browser = await puppeteer.launch({
        headless: false,
        userDataDir: './.localData',
    });
    const page = await browser.newPage();

    await page.goto("http://localhost:3001");

    console.log("Waiting for 5 seconds")
    const pages = await browser.pages()
    pages.forEach(item => {
        const url = item.url()
        if (url !== "http://localhost:3001/") {
            item.close()
        }
    })
    return { browser, page };
}


module.exports = { launchBrowser } 