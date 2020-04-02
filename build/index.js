const fs = require('fs');
const Viz = require('./Viz-ssr');
const geodata = require('../src/geodata.json');
const data = require('./apidata.json');

const template = fs.readFileSync('src/index.html', 'utf-8');

const init = async () => {
	const { confirmed, deaths } = data
	const { infectedMap, deceasedMap } = geodata

	const { html, css } = Viz.render({
		infectedMap,
		deceasedMap,
		infections: confirmed,
		deaths
	});
	
	const rendered = template
		.replace('<!-- viz -->', html)
		.replace('/* css */', css.code)
	
	fs.writeFileSync('index.html', rendered)
}

init().catch(e => {
	console.error(e)
	process.exit(1)
})
