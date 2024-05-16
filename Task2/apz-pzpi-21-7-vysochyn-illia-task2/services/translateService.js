const config = require("../config");

async function translate(text, target){
    const apiKey = config.apiKey;
    let returnData;
    await fetch('https://api-free.deepl.com/v2/translate', {
        method: 'POST',
        headers: {
            'Authorization': 'DeepL-Auth-Key ' + apiKey,
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
            'text': text,
            'target_lang': target
        })
    })
        .then(response => response.json())
        .then(data => {
            returnData = data.translations[0].text})
        .catch(error => console.error('Error:', error));
    return returnData;
}
async function translateCluster(cluster, language) {
    cluster.city = await translate(cluster.city, language);
    cluster.name = await translate(cluster.name, language);
    cluster.type = await translate(cluster.type, language);
    return cluster;
}
module.exports = {translate, translateCluster};