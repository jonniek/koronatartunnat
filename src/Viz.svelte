<script>
	import { onMount } from "svelte"
	export let geoData
	export let infections = []

	const oneDayInMS = 86400000

	let showRecent = false

	let fromDaysAgo = 14
	
	// use +1 offset to fix ssr issue with default 0 value
	let untilDaysAgoWithOffset = 1
	$: untilDaysAgo = untilDaysAgoWithOffset - 1

	$: activeInfections = infections.filter(({ date }) => {
		const infectionDate = new Date(date)

		// 1 daysAgo is today at 00:00:00
		const getDateDaysAgo = daysAgo => {
			const date = new Date(new Date().setDate(new Date().getDate() - daysAgo + 1))
			date.setHours(0)
			date.setMinutes(0)
			date.setSeconds(0)
			date.setMilliseconds(0)
			return date
		}

		if (showRecent) {
			// infections after N days ago
			return infectionDate > getDateDaysAgo(fromDaysAgo)
		} else {
			// infections before N days ago
			return getDateDaysAgo(untilDaysAgo) > infectionDate
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
		min-width: 400px;
		margin-right: 30px;
		margin-left: auto;
		padding: 10px 20px;
		display: flex;
		flex-direction: column;
	}

	form {
		width: 100%;
		margin: auto;
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
		right: 0;
		padding: 5px 15px;
	}

	a {
    color: rgb(78, 150, 184);
		text-decoration: none;
		margin-right: 20px;
	}
	@media (max-width: 700px) {
		header {
			min-width: 100vw;
			margin: 0 auto;
			z-index: 1;
			background: white;
		}
		main {
			z-index: 0;
			margin: 0 auto;
			position: relative;
			height: 90vh;
			top: -27vh;
			margin-bottom: -27vh;
		}
		h1 {
			font-size: 23px;
			margin-bottom: 0;
		}
		footer {
			position: static;
		}
	}
</style>


<header>
	<form>
		<h1>Tartuntoja {activeInfections.length}</h1>
		<label>
			Näytä vain uudet tartunnat
			<input type="checkbox" bind:checked={showRecent}>
		</label>
		{#if showRecent}
			<label>Tartunnat viimeiseltä {fromDaysAgo} päivältä</label>
			<input bind:value={fromDaysAgo} type="range" min={1} max={31} step={1}>
		{:else}
			<label>Tartuntatilanne {untilDaysAgo ? `${untilDaysAgo} päivää sitten` : 'nyt'}</label>
			<input bind:value={untilDaysAgoWithOffset} type="range" min={1} max={32} step={1}>
		{/if}
	</form>
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
	<a target="_blank" rel="noopener" href="https://github.com/jonniek/koronatartunnat">github</a>
	<a target="_blank" rel="noopener" href="https://github.com/HS-Datadesk/koronavirus-avoindata">Datalähde — Helsingin Sanomat</a>
</footer>
