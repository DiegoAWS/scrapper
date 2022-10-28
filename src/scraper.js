const puppeteer = require('puppeteer');
require('dotenv').config()
// import terminalImage from ('terminal-image')

const linkedinLogin = "https://www.linkedin.com/login"
const linkedinlandingPage = "https://www.linkedin.com/feed/"
const linkedinCompaniesPage = "https://www.linkedin.com/search/results/companies"
// const pageUrl = "https://www.linkedin.com/search/results/companies/?keywords=tech%20due%20diligence&origin=GLOBAL_SEARCH_HEADER&sid=bhN";


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


const manualLogin = async () => {
    console.log("Login manually")
    const browser = await puppeteer.launch({
        headless: false,
        userDataDir: './.localData',
        defaultViewport: null,
    });


    const page = await browser.newPage();

    await page.goto(linkedinLogin);

    const checkUserLogin = setInterval(async () => {
        console.log(page.url())

        if (page.url() === linkedinlandingPage) {
            console.log("Logged in")
            await browser.close();
            clearInterval(checkUserLogin)
        }

    }, 2000)

}

const scrapper = async (searchTerms, targetKeywords, { searchCategory, limit }) => {

    const browser = await puppeteer.launch({
        headless: true,
        userDataDir: './.localData',
        defaultViewport: null,
    });
    const page = await browser.newPage();

    console.log("Opening Linkedin")
    await page.goto(linkedinCompaniesPage);

    let searchInput = await page.$(searchSelector);

    if (!searchInput) {
        await manualLogin();

        await page.goto(linkedinCompaniesPage);
        searchInput = await page.$(searchSelector);
    }


    if (!searchInput) {
        console.log("Error Not a search page")
        await page.screenshot({ path: 'notASearchPage.png', fullPage: true });
        console.log("Screenshot taken")
        return
    }





    await page.type(searchSelector, searchTerms);
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: 'searchPage.png'});
    await page.keyboard.press('Enter');

    let found = null
    let i = 1
    while (!found) {
        await autoScroll(page);
        const possibleLinks = await page.$$(resultLinksSelector);

        console.log(page.url());
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
            console.log(page.url());
            console.log(found)

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



scrapper(
    "Google",
    "Google Ads",
    {
        "searchTerms": [
            "Google"
        ],
        "targetKeywords": "Google",
        "searchCategory": "companies",
        "limit": 50,
        "location": ""
    }).then((position) => {
        console.log("Done App")
        console.log("Position", position)
    })

module.exports = { scrapper }