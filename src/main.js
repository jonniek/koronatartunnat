import Viz from './Viz.svelte'
import data from './data.json'

const init = async () => {
	try {
		const response = await fetch("https://w3qa5ydb4l.execute-api.eu-west-1.amazonaws.com/prod/finnishCoronaData/v2")
		const { confirmed, deaths } = await response.json()

		// TODO hydrate so we don't need to clear dom
		document.body.innerHTML = ''
	
		new Viz({
			target: document.body,
			props: {
				geoData: data,
				infections: confirmed,
				deaths,
			}
		})
	} catch (e) {
		alert("Onglema tietokantayhteydessä. Sivu ei ole interaktiivinen, yritä päivittää sivu.\n\n Error: " + e.message)
	}
}

init()
