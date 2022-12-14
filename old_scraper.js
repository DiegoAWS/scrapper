const puppeteer = require('puppeteer');
require('dotenv').config()
// import terminalImage from ('terminal-image')

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


const minimal_args = [
    '--autoplay-policy=user-gesture-required',
    '--disable-background-networking',
    '--disable-background-timer-throttling',
    '--disable-backgrounding-occluded-windows',
    '--disable-breakpad',
    '--disable-client-side-phishing-detection',
    '--disable-component-update',
    '--disable-default-apps',
    '--disable-dev-shm-usage',
    '--disable-domain-reliability',
    '--disable-extensions',
    '--disable-features=AudioServiceOutOfProcess',
    '--disable-hang-monitor',
    '--disable-ipc-flooding-protection',
    '--disable-notifications',
    '--disable-offer-store-unmasked-wallet-cards',
    '--disable-popup-blocking',
    '--disable-print-preview',
    '--disable-prompt-on-repost',
    '--disable-renderer-backgrounding',
    '--disable-setuid-sandbox',
    '--disable-speech-api',
    '--disable-sync',
    '--hide-scrollbars',
    '--ignore-gpu-blacklist',
    '--metrics-recording-only',
    '--mute-audio',
    '--no-default-browser-check',
    '--no-first-run',
    '--no-pings',
    '--no-sandbox',
    '--no-zygote',
    '--password-store=basic',
    '--use-gl=swiftshader',
    '--use-mock-keychain',
];

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

const keypress = async () => {
    console.log("Press any key to continue...");
    process.stdin.setRawMode(true)
    return new Promise(resolve => process.stdin.once('data', () => {
      process.stdin.setRawMode(false)
      resolve()
    }))
  }

const timer = 'Full execution time';
const start = async () => {
    
    const isRunningLocally = process.env.IS_LOCAL === 'true';
    const browserToUse = isRunningLocally ?{}: { executablePath: '/usr/bin/chromium-browser' }

    console.time(timer);

    const browser = await puppeteer.launch({
        ...browserToUse,
        headless: !isRunningLocally,
        userDataDir: './.localData', 
        // args: minimal_args
    });
    const page = await browser.newPage();
    await page.setViewport({
        width: 1200,
        height: 1024,
        deviceScaleFactor: 1,
    });


    console.log("Opening Linkedin")
    await page.goto(linkedinCompaniesPage);
    await autoScroll(page);

    const searchInput = await page.$(searchSelector);
    
    if (!searchInput) {

        console.log("Logging in")
        await page.goto(linkedinLogin);

        // const userNameInput = await page.$(userName);
        // if (!userNameInput) {
        //     console.log("Error Not a login page")
        //     return
        // }
        // await page.screenshot({ path: 'l-0.png', fullPage: true });
        // console.log("Logged in")
        // await page.type(userName, userNameContent);
        // await page.type(password, passwordContent);
        // await page.screenshot({ path: 'l-1.png', fullPage: true });
        // await click(page, signInButtom);
        // console.log("Login Successful")
        // await page.waitForTimeout(5000);
        // await page.screenshot({ path: 'l-2.png', fullPage: true });
        // const skipButton = await page.$(skipButtom)
        // if (skipButton) {
        //     console.log("Skipping Button Found")
        //     await click(page, skipButtom)
        // }
        // await page.screenshot({ path: 'l-3.png', fullPage: true });

        // 
        // await page.screenshot({ path: 'l-4.png', fullPage: true });
        console.clear()
        console.log("Please login manually")
        await keypress()
        console.log("Going to Companies Page")
        await page.goto(linkedinCompaniesPage);
        await autoScroll(page);
    }

    const afterLogin = await page.$(searchSelector);

    if(!afterLogin) {
        console.log("Error Not a search page")
        await page.screenshot({ path: 'notASearchPage.png', fullPage: true });
        console.log("Screenshot taken")
        return
    }



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
            await page.screenshot({ path: 'notFoundNextButton.png', fullPage: true });
            console.log("Not Found next button")
            return;
        }


        console.log("Page " + i)
        i++
        await click(page, nextButtonElement);

    }


    console.timeEnd(timer);

    await keypress()
    await browser.close();
    process.exit(0);


};


try {
    start();
} catch (error) {
    console.log(error)
}
