const { scrapper } = require("./scraper")

const sendSearchRequest = async (browser, { searchTerms, searchKeyword, limit, location }) => {
console.log("sendSearchRequest")

    for (const search of searchTerms) {
        console.log({ search,searchTerms })
        const data = await scrapper(browser, search, searchKeyword, limit, location)

        console.log({ data })
    }

}

module.exports = { sendSearchRequest }