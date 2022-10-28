const puppeteer = require('puppeteer');
require('dotenv').config()
const linkedinLogin = "https://www.linkedin.com/login"
const linkedinlandingPage = "https://www.linkedin.com/feed/"
const linkedinCompaniesPage = "https://www.linkedin.com/search/results/companies"

const searchSelector = "#global-nav-typeahead > input"
const resultLinksSelector = "#main > div > div > div.ph0.pv2.artdeco-card.mb2 > ul > li > div > div > div.entity-result__content.entity-result__divider.pt3.pb3.t-12.t-black--light > div.mb1 > div.t-roman.t-sans > div > span > span > a"




const click = async (page, selector) => {

    const clickAction = typeof selector === "string" ?
        page.click(selector)
        : selector.click();


    await Promise.all([
        page.waitForNavigation(),
        clickAction
    ])

};

async function autoScroll(page) {
    await page.evaluate(async () => {
        await new Promise((resolve) => {
            var totalHeight = 0;
            var distance = 100;
            var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if (totalHeight >= scrollHeight - window.innerHeight) {
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
        });
    });
}

async function scrollToTop(page) {
    await page.evaluate(async () => {

        window.scrollBy(0, 0);


    });
}


const manualLogin = async (customBrowser) => {
    console.log("Login manually")
    const browser = customBrowser || await puppeteer.launch({
        headless: false,
        userDataDir: './.localData',
        defaultViewport: null,
    });


    const page = await browser.newPage();

    await page.goto(linkedinLogin);

    await new Promise((resolve) => {
    const checkUserLogin = setInterval(async () => {
        console.log(page.url())

        if (page.url() === linkedinlandingPage) {
            console.log("Logged in")
            page.close();
            clearInterval(checkUserLogin)
            resolve()
        }

    }, 2000)

    });
}

const launchBrowser = async () => {
    const browser = await puppeteer.launch({
        headless: false,
        userDataDir: './.localData',
        args: [
            "--start-fullscreen",
            "--kiosk",
            "--app"
        ],
    });

    const page = await browser.newPage();
    await page.setViewport({
        width: 1920,
        height: 1024,
        deviceScaleFactor: 1,
    });
    console.log("Opening Linkedin")
    await page.goto(linkedinCompaniesPage);

    return { browser, page }
}


const scrapper = async (customBrowser, searchTerms, targetKeywords, limit) => {

    let { browser, page } = await launchBrowser();

    let searchInput = await page.$(searchSelector);

    if (!searchInput) {
        await manualLogin(customBrowser);
        console.log("Manual loggin in")
        await page.screenshot({ path: 'before.png', fullPage: true });

        await browser.close();

        const data = await launchBrowser();
        browser = data.browser;
        page = data.page;

        await page.screenshot({ path: 'after.png', fullPage: true });
    }


    if (!searchInput) {
        console.log("Error Not a search page")
        await page.screenshot({ path: 'notASearchPage.png', fullPage: true });
        console.log("Screenshot taken")
        return
    }

    console.log("Searching for ", searchTerms)
    await page.type(searchSelector, searchTerms);
    // await page.screenshot({ path: 'searchPage.png', fullPage: true });
    await page.keyboard.press('Enter');
  

    let found = null
    let i = 1
    while (!found) {
        await autoScroll(page);
        const possibleLinks = await page.$$(resultLinksSelector);
        // await page.screenshot({ path: 'searchPage'+i+'.png', fullPage: true });
        for (const link of possibleLinks) {
            
            const text = await page.evaluate(el => el.innerText, link);
            console.log(text)

            if (text.toLowerCase().includes(targetKeywords.toLowerCase())) {
                found = await page.evaluate(el => el.getAttribute("href"), link);;
                break
            }
            i++;
        }


        if (found) {
            console.log("\n\n"+page.url()+"\n\n");
            console.log("\n\n"+found+"\n\n");
            return i;
        }


        const [nextButtonElement] = await page.$x("//button[contains(., 'Next')]");

        if (!nextButtonElement) {
            await page.screenshot({ path: 'notFoundNextButton.png', fullPage: true });
            console.log("Not Found next button")
            return;
        }
        console.log("\nResult Checked ", i)

        if (i >= limit) {
            break
        }
        await click(page, nextButtonElement);

    }


    // await browser.close();

    return
};



// scrapper(
//     undefined,
//     "Diego",
//     "Google",
//     100,
//     // {
//     //     "searchTerms": [
//     //         "Google"
//     //     ],
//     //     "targetKeywords": "Google",
//     //     "searchCategory": "companies",
//     //     "limit": 1000,
//     //     "location": ""
//     // }
//     ).then((position) => {
//         console.log("Done App")
//         console.log("Position", position)
//     })

module.exports = { scrapper }