<script>
	import { onMount } from "svelte"
	export let infectedMap
	export let deceasedMap
	export let infections = []
	export let deaths = []
	export let loading = false

  const frozenStartDate = 1580137200000
	let daysSinceStart = 60

	$: frozenDate = frozenStartDate + (daysSinceStart * 24 * 60 * 60 * 1000)

	const oneDayInMS = 86400000

	let showDeaths = false

	// quick hack because inkscape screwed up the svg unions
	$: maptransform = showDeaths ? 'matrix(1.0526316,0,0,1.0526316,350,0)' : ''
	$: selectedMap = showDeaths ? deceasedMap : infectedMap
	$: districtVariable = showDeaths ? 'area' : 'healthCareDistrict'

	let showRecent = false

	let fromDaysAgo = 1
	
	// use +1 offset to fix ssr issue with default 0 value
	let untilDaysAgoWithOffset = 1
	$: untilDaysAgo = untilDaysAgoWithOffset - 1

	$: events = showDeaths ? deaths : infections

	$: activeEvents = events.filter(({ date }) => {
		const eventDate = new Date(date)

		// 1 daysAgo is today at 00:00:00
		const getDateDaysAgo = daysAgo => {
			const date = new Date(new Date(frozenDate).setDate(new Date(frozenDate).getDate() - daysAgo + 1))
			date.setHours(0)
			date.setMinutes(0)
			date.setSeconds(0)
			date.setMilliseconds(0)
			return date
		}

		if (showRecent) {
			// events after N days ago
			return eventDate > getDateDaysAgo(fromDaysAgo)
		} else {
			// events before N days ago
			return getDateDaysAgo(untilDaysAgo) > eventDate
		}
	})

	$: eventsByDistrict = activeEvents.reduce((total, infection) => {
		const district = infection[districtVariable] || 'unknown'
		const count = total[district] || 0
		return { ...total, [district]: count + 1 }
	}, {})

	const getColor = (count, total) => {
		const relativeCount = count / total * 200
		const rgbvalue = Math.floor(250 - relativeCount) || 250
		return `rgb(250, ${rgbvalue}, ${rgbvalue})`
	}

	let districts
	$: {
		districts = selectedMap.map(district => {
			const eventCount = eventsByDistrict[district.name] || 0
			return {
				...district,
				color: getColor(eventCount, activeEvents.length),
				count: eventCount || '',
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
		position: relative;
		width: 100%;
		margin: auto;
		padding-bottom: 20px;
	}

	.unknown, .loading {
		position: absolute;
		left: 0;
		bottom: 5px;
	}

	input[type="range"] {
		width: 100%;
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
		@media (prefers-color-scheme:dark) {
			header {
				color: #ece8de;
				background: #31383e;
			}
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
		<h1>{#if showDeaths}Deceased{:else}Infections{/if} {activeEvents.length}</h1>
		<label>
			Show deceased
			<input disabled={loading} type="checkbox" autocomplete="off" bind:checked={showDeaths}>
		</label>
		<br />
		<label>{daysSinceStart} days since first infection</label>
		<input disabled={loading} bind:value={daysSinceStart} type="range" min={1} max={350} step={1}>
		{#if loading}
			<div class="loading">Ladataan päivitettyjä tietoja...</div>
		{:else if eventsByDistrict.unknown}
			<div class="unknown">{eventsByDistrict.unknown} {#if showDeaths}menehtyneeltä{:else}tartunnalta{/if} puuttuu sairaanhoitopiiri</div>
		{/if}
	</form>
</header>
<main>
	<svg height="95%" viewBox="360 0 380 800">
		{#each districts as district}
			<path d={district.d} fill={district.color} transform={maptransform}><title>{district.name}</title></path>
			<text x={district.x} y={district.y}>{district.count}</text>
		{/each}
	</svg>
</main>
<footer>
	<a target="_blank" rel="noopener" href="https://github.com/jonniek/koronatartunnat">github</a>
	<a target="_blank" rel="noopener" href="https://github.com/HS-Datadesk/koronavirus-avoindata">Datasource — Helsingin Sanomat</a>
</footer>
