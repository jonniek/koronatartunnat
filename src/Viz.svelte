<script>
	import { onMount } from "svelte";
	export let geoData

	const apiURL = "https://w3qa5ydb4l.execute-api.eu-west-1.amazonaws.com/prod/finnishCoronaData"
	const oneDayInMS = 86400000

	let loaded = false
	let error
	let infections = []

	onMount(async function() {
		try {
			const response = await fetch(apiURL);
			const data = await response.json();
			infections = data.confirmed
			loaded = true
		} catch(e) {
			console.error(e)
			error = e.message
		}
	})

	let showAll = false
	let fromDayN = 14
	let daysAgo = 0

	$: activeInfections = infections.filter(({ date }) => {
		const now = Date.now()
		const infectionTime = new Date(date).getTime()
		if (!showAll) {
			const period = fromDayN * oneDayInMS
			return infectionTime + period > now
		} else {
			const daysAgoMS = daysAgo * oneDayInMS
			return now - daysAgoMS > infectionTime
		}
	})

	$: infectionsByDistrict = activeInfections.reduce((total, infection) => {
		const count = total[infection.healthCareDistrict] || 0
		return { ...total, [infection.healthCareDistrict]: count + 1 }
	}, {})

	const getColor = (count, total) => {
    const relativeCount = count / total * 200
    const rgbvalue = Math.floor(250 - relativeCount) || 250
    return `rgb(250, ${rgbvalue}, ${rgbvalue})`
  }

	let districts

	$: {
		districts = geoData.map(district => {
			const infectionCount = infectionsByDistrict[district.name] || 0
			return {
				...district,
				color: getColor(infectionCount, activeInfections.length),
				count: infectionCount || '',
			}
		})
	}
</script>

<style>
	path {
	 	stroke: #555;
	}

	text {
		font-size: 12px;
		text-anchor: middle;
	}

	main {
		height: 100vh;
		margin-right: auto;
	}

	header {
		margin-right: 30px;
		margin-left: auto;
		padding: 10px 20px;
		display: flex;
		flex-direction: column;
	}

	form {
		width: 300px;
		max-width: 95vh;
	}

	input[type="range"] {
		width: 100%;
		direction: rtl;
		padding-bottom: 15px;
	}

	label {
		display: block;
		padding-top: 10px;
	}

	footer {
		position: absolute;
		bottom: 0;
		left: 0;
		padding: 5px 15px;
	}

	.error {
		color: rgb(163, 67, 55);
	}

	a {
    color: rgb(78, 150, 184);
		text-decoration: none;
	}
	@media (max-width: 700px) {
		header {
			margin: 0 auto;
			z-index: 1;
			background: white;
		}
		main {
			z-index: 0;
			margin: 0 auto;
			position: relative;
			top: -25vh;
		}
		footer {
			position: static;
		}
	}
</style>


<noscript>Vaati javascriptin datan hakuun <a href={apiURL}>{apiURL}</a></noscript>
<header>
	{#if loaded}
		<form>
			<h1>Tartuntoja yhteensä {activeInfections.length}</h1>
			<label>
				Näytä kaikki tartunnat
				<input type="checkbox" bind:checked={showAll}>
			</label>
			{#if !showAll}
				<label>Tartunnat viimeiseltä {fromDayN} päivältä</label>
				<input bind:value={fromDayN} type="range" min={1} max={31} step={1}>
			{:else}
				<label>Tartuntatilanne {daysAgo ? `${daysAgo} päivää sitten` : 'nyt'}</label>
				<input bind:value={daysAgo} type="range" min={0} max={31} step={1}>
			{/if}
		</form>
	{/if}
	{#if error}
		<h2 class="error">Yhteys tietokantaan epäonnistui</h2>
		<p>{error}</p>
		<a href={apiURL}>{apiURL}</a>
	{/if}
</header>
<main>
	<svg height="95%" viewBox="360 0 380 800">
		{#each districts as district}
			<path d={district.d} fill={district.color}><title>{district.name}</title></path>
			<text x={district.x} y={district.y}>{district.count}</text>
		{/each}
	</svg>
</main>
<footer>
	<a href="https://github.com/jonniek/koronatartunnat">github</a>
</footer>