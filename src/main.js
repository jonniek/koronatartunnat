import Viz from './Viz.svelte'
import geodata from './geodata.json'
import apidata from '../build/apidata.json'

const init = async () => {
	let data = apidata

	// try update to realtime data
	try {
		const response = await fetch("https://w3qa5ydb4l.execute-api.eu-west-1.amazonaws.com/prod/finnishCoronaData/v2")
		data = await response.json()
	} catch (e) {
		console.error(e)
		alert("Onglema tietokantayhteydessä. Data ei ole välttämättä ajankohtaista, yritä päivittää sivu.")
	}

	const { confirmed, deaths } = data
	const { infectedMap, deceasedMap } = geodata

	// TODO hydrate so we don't need to clear dom
	document.body.innerHTML = ''
	
	new Viz({
		target: document.body,
		props: {
			infectedMap,
			deceasedMap,
			infections: confirmed,
			deaths,
		}
	})
}

init()
