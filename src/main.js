import Viz from './Viz.svelte';
import data from './data.json';

document.body.innerHTML = '';

new Viz({
	target: document.body,
	props: {
		geoData: data
	}
});