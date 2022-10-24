const chromium = require('chrome-aws-lambda');
const linkedinLogin = "https://www.linkedin.com/login"
const pageUrl = "https://www.linkedin.com/search/results/companies/?keywords=tech%20due%20diligence&origin=GLOBAL_SEARCH_HEADER&sid=bhN";


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

exports.handler = async (event, context) => {
    const browser = await chromium.puppeteer.launch({ headless: true });
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
        await click(page, skipButtom)
    }

    await page.goto(pageUrl);
    console.log("Going to Search Page")



    let found = null
    let i = 0
    while (!found) {
        await autoScroll(page);

        const content = await page.content();
        found = content.match(searchRingstone);

        if (found) {
            console.log("Found")
            const url = await page.url();


            await page.screenshot({ path: 'example.png', fullPage: true });

            return {
                statusCode: 200,
                body: JSON.stringify({
                    message: url,

                })
            }
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



    console.log("End Script")
}