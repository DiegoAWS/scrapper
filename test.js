
const puppeteer = require('puppeteer')

    ; (async () => {
        const browser = await puppeteer.launch()
        const page = await browser.newPage()

        await page.setViewport({ width: 1200, height: 800 })

        await page.setRequestInterception(true)

        page.on('request', (request) => {
            request.continue()
        })

        page.on('response', (response) => {
            if(response.headers()['content-type'].toString().includes('json')) {
               console.log('>>', response.url())

                response.json().then((text) => {
                    console.log(text)
                })
            }
        })

        await page.goto('https://danube-web.shop/')

        await page.screenshot({ path: 'screenshot.png' })

        await browser.close()
    })()
