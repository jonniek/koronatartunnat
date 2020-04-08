const fs = require('fs');
const axios = require('axios');

const init = async () => {
	const json = await axios("https://w3qa5ydb4l.execute-api.eu-west-1.amazonaws.com/prod/finnishCoronaData/v2")
	fs.writeFileSync('build/apidata.json', JSON.stringify(json))
}

init().catch(e => {
	console.error("PREBUILD script failed " + e.message)
	process.exit(1)
})