const fs = require('fs');
const Viz = require('./Viz-ssr');
const data = require('../src/data.json');
const fetch = require('node-fetch');

const template = fs.readFileSync('src/index.html', 'utf-8');

const init = async () => {
	const response = await fetch("https://w3qa5ydb4l.execute-api.eu-west-1.amazonaws.com/prod/finnishCoronaData")
	const { confirmed, deaths } = await response.json()

	const { html, css } = Viz.render({
		geoData: data,
		infections: confirmed,
		deaths
	});
	
	const rendered = template
		.replace('<!-- viz -->', html)
		.replace('/* css */', css.code);
	
	fs.writeFileSync('index.html', rendered);
}

init().catch(e => {
	console.error(e)
	process.exit(1)
})
