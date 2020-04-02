const fs = require('fs');
const fetch = require('node-fetch');

const init = async () => {
	const response = await fetch("https://w3qa5ydb4l.execute-api.eu-west-1.amazonaws.com/prod/finnishCoronaData/v2")
	const json = await response.json()
	fs.writeFileSync('build/apidata.json', JSON.stringify(json))
}

init().catch(e => {
	console.error(e)
	process.exit(1)
})