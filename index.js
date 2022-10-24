const puppeteer = require('puppeteer');
require('dotenv').config()

const linkedinLogin = "https://www.linkedin.com/login"
const linkedinCompaniesPage = "https://www.linkedin.com/search/results/companies"
// const pageUrl = "https://www.linkedin.com/search/results/companies/?keywords=tech%20due%20diligence&origin=GLOBAL_SEARCH_HEADER&sid=bhN";

const searchSelector = "#global-nav-typeahead > input"
const searchTerms = "tech due diligence";

const userName = "#username"
const userNameContent = "diego.escobar@ringstonetech.com"

const password = "#password"
const passwordContent = "Password$123"
const signInButtom = "#organic-div > form > div.login__form_action_container > button"

const skipButtom = "#ember455 > button"

const searchRingstone = /https\:\/\/www\.linkedin\.com\/company\/ringstone/;


const click = async (page, selector) => {

    const clickAction = typeof selector === "string" ?
        page.click(selector)
        : selector.click();


    return await Promise.all([
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

const timer = 'Full execution time';
const start = async () => {
    const isRunningLocally = process.env.IS_LOCAL === 'true';
    const browserToUse = isRunningLocally ?{}: { executablePath: '/usr/bin/chromium-browser' }

    console.time(timer);

    const browser = await puppeteer.launch({ ...browserToUse, headless: !isRunningLocally });
    const page = await browser.newPage();
    await page.setViewport({
        width: 1200,
        height: 1024,
        deviceScaleFactor: 1,
    });


    console.log("Opening Linkedin")
    await page.goto(linkedinLogin);

    await page.type(userName, userNameContent);
    await page.type(password, passwordContent);
    await click(page, signInButtom);
    console.log("Login Successful")

    const skipButton = await page.$(skipButtom)
    if (skipButton) {
        console.log("Skipping Button Found")
        await click(page, skipButtom)
    }
    console.log("Going to Companies Page")

    await page.goto(linkedinCompaniesPage);

    await page.type(searchSelector, searchTerms);
    await page.keyboard.press('Enter');



    let found = null
    let i = 0
    while (!found) {
        await autoScroll(page);

        const content = await page.content();
        found = content.match(searchRingstone);

        if (found) {
            console.log("Found")
            const url = await page.url();
            console.log(url);

            await page.screenshot({ path: 'example.png', fullPage: true });
            break
        }


        const [nextButtonElement] = await page.$x("//button[contains(., 'Next')]");

        if (!nextButtonElement) {
            console.log("Not Found next button")
            break;
        }


        console.log("Page " + i)
        i++
        await click(page, nextButtonElement);

    }


    await browser.close();
    console.timeEnd(timer);



};




start();