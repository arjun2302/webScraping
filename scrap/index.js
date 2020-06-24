const request = require('request-promise')
const cheerio = require('cheerio')
const json2csv = require('json2csv').Parser
const fs = require('fs')

const fetchData = function(papers){
    (async ()=>{
        let data = []
        for(let paper of papers){
        const response = await request({
            uri:paper,
            headers:{
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.106 Safari/537.36"
            }
        })
        const $ = cheerio.load(response)
        let title = $('div[class="viewDoc"] > h2').text().trim()
        let abstract = $('div[id="abstract"] > p').text()
        let keywords = $('div[id="keywords"] > p').text().replace(/\s+/g, " ")
        data.push({
            title,
            abstract,
            keywords
        })}
        const jscv = new json2csv()
        const csv = jscv.parse(data)
        fs.writeFileSync("./paperData.csv",csv)
    
    })()
}

let papers = ["http://citeseerx.ist.psu.edu/viewdoc/summary?doi=10.1.1.562.5746&rank=9",
              "http://citeseerx.ist.psu.edu/viewdoc/summary?doi=10.1.1.1012.9170&rank=2",
              "http://citeseerx.ist.psu.edu/viewdoc/summary?doi=10.1.1.637.5041&rank=6"];

fetchData(papers)

