const fs = require('fs');
const Viz = require('./Viz-ssr');
const data = require('../src/data.json');

const template = fs.readFileSync('src/index.html', 'utf-8');

const { html, css } = Viz.render({
	geoData: data
});

const rendered = template
	.replace('<!-- viz -->', html)
	.replace('/* css */', css.code);

fs.writeFileSync('index.html', rendered);