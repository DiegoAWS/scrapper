const puppeteer = require('puppeteer');


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


const start = async () => {

    const browser = await puppeteer.launch({ headless: true });
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



    console.log("End Script")











    // let month = 0;
    // for (i = 1; i <= 6; i++) {

    //     await page.goto(pageUrl);

    //     // 4 TRP
    //     await page.click(getSelectorList(1));



    //     const currentOffice = await page.$(getSelectorList(i));
    //     const officeName = (await currentOffice.evaluate(currentOffice => currentOffice.innerText)).replace(/\s/g, ' ').trim();

    //     console.log(`\n\nOffice: ${officeName}\n`);

    //     await currentOffice.click();

    //     await Promise.all([
    //         page.waitForNavigation(),
    //         page.click(nextButton()),
    //     ]);

    //     let nextMonth = true;
    //     while (nextMonth) {
    //         nextMonth = await page.$(getNextMonth)

    //         const currentMonth = await page.$("#monthSelector");
    //         const monthName = await currentMonth.evaluate((el) => el.innerText)

    //         console.log(`Checking month: ${monthName}`)


    //         const dayAvailable = await page.$(getDaysAvailable)
    //         if (dayAvailable) {
    //             // found a day

    //             const dayNumber = await dayAvailable.evaluate((el) => el.innerText)

    //             await page.screenshot({ path: resultImage });

    //             daysFound.push(`Found a day: ${dayNumber} in ${monthName} at ${officeName}`);

    //             return; // comment this line to check all offices
    //         }
    //         if (nextMonth) {
    //             await Promise.all([
    //                 page.waitForNavigation(),
    //                 nextMonth.click(),
    //             ]);

    //             month++
    //             continue

    //         }
    //         else {
    //             break;
    //         }


    //     }

    // }



    // console.log(`\n\n\n${daysFound.join('\n\n')}`);

    // await browser.close();
};




start();