'use strict';

function run(fn) {
	return fn();
}

function blank_object() {
	return Object.create(null);
}

function run_all(fns) {
	fns.forEach(run);
}

let current_component;

function set_current_component(component) {
	current_component = component;
}

function get_current_component() {
	if (!current_component) throw new Error(`Function called outside component initialization`);
	return current_component;
}

function onMount(fn) {
	get_current_component().$$.on_mount.push(fn);
}

const escaped = {
	'"': '&quot;',
	"'": '&#39;',
	'&': '&amp;',
	'<': '&lt;',
	'>': '&gt;'
};

function escape(html) {
	return String(html).replace(/["'&<>]/g, match => escaped[match]);
}

function each(items, fn) {
	let str = '';
	for (let i = 0; i < items.length; i += 1) {
		str += fn(items[i], i);
	}
	return str;
}

let on_destroy;

function create_ssr_component(fn) {
	function $$render(result, props, bindings, slots) {
		const parent_component = current_component;

		const $$ = {
			on_destroy,
			context: new Map(parent_component ? parent_component.$$.context : []),

			// these will be immediately discarded
			on_mount: [],
			before_render: [],
			after_render: [],
			callbacks: blank_object()
		};

		set_current_component({ $$ });

		const html = fn(result, props, bindings, slots);

		set_current_component(parent_component);
		return html;
	}

	return {
		render: (props = {}, options = {}) => {
			on_destroy = [];

			const result = { head: '', css: new Set() };
			const html = $$render(result, props, {}, options);

			run_all(on_destroy);

			return {
				html,
				css: {
					code: Array.from(result.css).map(css => css.code).join('\n'),
					map: null // TODO
				},
				head: result.head
			};
		},

		$$render
	};
}

/* src/Viz.svelte generated by Svelte v3.1.0 */

const css = {
	code: "path.svelte-17js0gq{stroke:#555}text.svelte-17js0gq{font-size:12px;text-anchor:middle}main.svelte-17js0gq{height:100vh;margin-right:auto}aside.svelte-17js0gq{margin-right:30px;margin-left:auto;padding:10px 20px;display:flex;flex-direction:column}form.svelte-17js0gq{width:300px}input[type=\"range\"].svelte-17js0gq{width:100%;direction:rtl;padding-bottom:15px}label.svelte-17js0gq{display:block;padding-top:10px}footer.svelte-17js0gq{position:absolute;bottom:0;left:0;padding:5px 15px}.error.svelte-17js0gq{color:rgb(163, 67, 55)}a.svelte-17js0gq{color:rgb(78, 150, 184);text-decoration:none}@media(max-width: 780px){aside.svelte-17js0gq{margin:0 auto}main.svelte-17js0gq{height:80vh;margin:0 auto}footer.svelte-17js0gq{position:static}}",
	map: "{\"version\":3,\"file\":\"Viz.svelte\",\"sources\":[\"Viz.svelte\"],\"sourcesContent\":[\"<script>\\n\\timport { onMount } from \\\"svelte\\\";\\n\\texport let geoData\\n\\n\\tconst apiURL = \\\"https://w3qa5ydb4l.execute-api.eu-west-1.amazonaws.com/prod/finnishCoronaData\\\"\\n\\tconst oneDayInMS = 86400000\\n\\n\\tlet loaded = false\\n\\tlet error\\n\\tlet infections = []\\n\\n\\tonMount(async function() {\\n\\t\\ttry {\\n\\t\\t\\tconst response = await fetch(apiURL);\\n\\t\\t\\tconst data = await response.json();\\n\\t\\t\\tinfections = data.confirmed\\n\\t\\t\\tloaded = true\\n\\t\\t} catch(e) {\\n\\t\\t\\tconsole.error(e)\\n\\t\\t\\terror = e.message\\n\\t\\t}\\n\\t})\\n\\n\\tlet showAll = false\\n\\tlet fromDayN = 14\\n\\tlet daysAgo = 0\\n\\n\\t$: activeInfections = infections.filter(({ date }) => {\\n\\t\\tconst now = Date.now()\\n\\t\\tconst infectionTime = new Date(date).getTime()\\n\\t\\tif (!showAll) {\\n\\t\\t\\tconst period = fromDayN * oneDayInMS\\n\\t\\t\\treturn infectionTime + period > now\\n\\t\\t} else {\\n\\t\\t\\tconst daysAgoMS = daysAgo * oneDayInMS\\n\\t\\t\\treturn now - daysAgoMS > infectionTime\\n\\t\\t}\\n\\t})\\n\\n\\t$: infectionsByDistrict = activeInfections.reduce((total, infection) => {\\n\\t\\tconst count = total[infection.healthCareDistrict] || 0\\n\\t\\treturn { ...total, [infection.healthCareDistrict]: count + 1 }\\n\\t}, {})\\n\\n\\tconst getColor = (count, total) => {\\n    const relativeCount = count / total * 200\\n    const rgbvalue = Math.floor(250 - relativeCount) || 250\\n    return `rgb(250, ${rgbvalue}, ${rgbvalue})`\\n  }\\n\\n\\tlet districts\\n\\n\\t$: {\\n\\t\\tdistricts = geoData.map(district => {\\n\\t\\t\\tconst infectionCount = infectionsByDistrict[district.name] || 0\\n\\t\\t\\treturn {\\n\\t\\t\\t\\t...district,\\n\\t\\t\\t\\tcolor: getColor(infectionCount, activeInfections.length),\\n\\t\\t\\t\\tcount: infectionCount || '',\\n\\t\\t\\t}\\n\\t\\t})\\n\\t}\\n</script>\\n\\n<style>\\n\\tpath {\\n\\t \\tstroke: #555;\\n\\t}\\n\\n\\ttext {\\n\\t\\tfont-size: 12px;\\n\\t\\ttext-anchor: middle;\\n\\t}\\n\\n\\tmain {\\n\\t\\theight: 100vh;\\n\\t\\tmargin-right: auto;\\n\\t}\\n\\n\\taside {\\n\\t\\tmargin-right: 30px;\\n\\t\\tmargin-left: auto;\\n\\t\\tpadding: 10px 20px;\\n\\t\\tdisplay: flex;\\n\\t\\tflex-direction: column;\\n\\t}\\n\\n\\tform {\\n\\t\\twidth: 300px;\\n\\t}\\n\\n\\tinput[type=\\\"range\\\"] {\\n\\t\\twidth: 100%;\\n\\t\\tdirection: rtl;\\n\\t\\tpadding-bottom: 15px;\\n\\t}\\n\\n\\tlabel {\\n\\t\\tdisplay: block;\\n\\t\\tpadding-top: 10px;\\n\\t}\\n\\n\\tfooter {\\n\\t\\tposition: absolute;\\n\\t\\tbottom: 0;\\n\\t\\tleft: 0;\\n\\t\\tpadding: 5px 15px;\\n\\t}\\n\\n\\t.error {\\n\\t\\tcolor: rgb(163, 67, 55);\\n\\t}\\n\\n\\ta {\\n    color: rgb(78, 150, 184);\\n\\t\\ttext-decoration: none;\\n\\t}\\n\\t@media (max-width: 780px) {\\n\\t\\taside {\\n\\t\\t\\tmargin: 0 auto;\\n\\t\\t}\\n\\t\\tmain {\\n\\t\\t\\theight: 80vh;\\n\\t\\t\\tmargin: 0 auto;\\n\\t\\t}\\n\\t\\tfooter {\\n\\t\\t\\tposition: static;\\n\\t\\t}\\n\\t}\\n</style>\\n\\n\\n<noscript>Vaati javascriptin datan hakuun <a href={apiURL}>{apiURL}</a></noscript>\\n<aside>\\n\\t{#if loaded}\\n\\t\\t<form>\\n\\t\\t\\t<h1>Tartuntoja yhteensä {activeInfections.length}</h1>\\n\\t\\t\\t<label>\\n\\t\\t\\t\\tNäytä kaikki tartunnat\\n\\t\\t\\t\\t<input type=\\\"checkbox\\\" bind:checked={showAll}>\\n\\t\\t\\t</label>\\n\\t\\t\\t{#if !showAll}\\n\\t\\t\\t\\t<label>Tartunnat viimeiseltä {fromDayN} päivältä</label>\\n\\t\\t\\t\\t<input bind:value={fromDayN} type=\\\"range\\\" min={1} max={31} step={1}>\\n\\t\\t\\t{:else}\\n\\t\\t\\t\\t<label>Tartuntatilanne {daysAgo ? `${daysAgo} päivää sitten` : 'nyt'}</label>\\n\\t\\t\\t\\t<input bind:value={daysAgo} type=\\\"range\\\" min={0} max={31} step={1}>\\n\\t\\t\\t{/if}\\n\\t\\t</form>\\n\\t{/if}\\n\\t{#if error}\\n\\t\\t<h2 class=\\\"error\\\">Yhteys tietokantaan epäonnistui</h2>\\n\\t\\t<p>{error}</p>\\n\\t\\t<a href={apiURL}>{apiURL}</a>\\n\\t{/if}\\n</aside>\\n<main>\\n\\t<svg height=\\\"95%\\\" viewBox=\\\"360 0 380 800\\\">\\n\\t\\t{#each districts as district}\\n\\t\\t\\t<path d={district.d} fill={district.color}><title>{district.name}</title></path>\\n\\t\\t\\t<text x={district.x} y={district.y}>{district.count}</text>\\n\\t\\t{/each}\\n\\t</svg>\\n</main>\\n<footer>\\n\\t<a href=\\\"https://github.com/jonniek/koronatartunnat\\\">github</a>\\n</footer>\"],\"names\":[],\"mappings\":\"AAiEC,IAAI,eAAC,CAAC,AACJ,MAAM,CAAE,IAAI,AACd,CAAC,AAED,IAAI,eAAC,CAAC,AACL,SAAS,CAAE,IAAI,CACf,WAAW,CAAE,MAAM,AACpB,CAAC,AAED,IAAI,eAAC,CAAC,AACL,MAAM,CAAE,KAAK,CACb,YAAY,CAAE,IAAI,AACnB,CAAC,AAED,KAAK,eAAC,CAAC,AACN,YAAY,CAAE,IAAI,CAClB,WAAW,CAAE,IAAI,CACjB,OAAO,CAAE,IAAI,CAAC,IAAI,CAClB,OAAO,CAAE,IAAI,CACb,cAAc,CAAE,MAAM,AACvB,CAAC,AAED,IAAI,eAAC,CAAC,AACL,KAAK,CAAE,KAAK,AACb,CAAC,AAED,KAAK,CAAC,IAAI,CAAC,OAAO,CAAC,eAAC,CAAC,AACpB,KAAK,CAAE,IAAI,CACX,SAAS,CAAE,GAAG,CACd,cAAc,CAAE,IAAI,AACrB,CAAC,AAED,KAAK,eAAC,CAAC,AACN,OAAO,CAAE,KAAK,CACd,WAAW,CAAE,IAAI,AAClB,CAAC,AAED,MAAM,eAAC,CAAC,AACP,QAAQ,CAAE,QAAQ,CAClB,MAAM,CAAE,CAAC,CACT,IAAI,CAAE,CAAC,CACP,OAAO,CAAE,GAAG,CAAC,IAAI,AAClB,CAAC,AAED,MAAM,eAAC,CAAC,AACP,KAAK,CAAE,IAAI,GAAG,CAAC,CAAC,EAAE,CAAC,CAAC,EAAE,CAAC,AACxB,CAAC,AAED,CAAC,eAAC,CAAC,AACA,KAAK,CAAE,IAAI,EAAE,CAAC,CAAC,GAAG,CAAC,CAAC,GAAG,CAAC,CAC1B,eAAe,CAAE,IAAI,AACtB,CAAC,AACD,MAAM,AAAC,YAAY,KAAK,CAAC,AAAC,CAAC,AAC1B,KAAK,eAAC,CAAC,AACN,MAAM,CAAE,CAAC,CAAC,IAAI,AACf,CAAC,AACD,IAAI,eAAC,CAAC,AACL,MAAM,CAAE,IAAI,CACZ,MAAM,CAAE,CAAC,CAAC,IAAI,AACf,CAAC,AACD,MAAM,eAAC,CAAC,AACP,QAAQ,CAAE,MAAM,AACjB,CAAC,AACF,CAAC\"}"
};

const apiURL = "https://w3qa5ydb4l.execute-api.eu-west-1.amazonaws.com/prod/finnishCoronaData";

const oneDayInMS = 86400000;

const Viz = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	let { geoData } = $$props;

	let loaded = false;
	let error;
	let infections = [];

	onMount(async function() {
		try {
			const response = await fetch(apiURL);
			const data = await response.json();
			infections = data.confirmed;
			loaded = true;
		} catch(e) {
			console.error(e);
			error = e.message;
		}
	});

	let showAll = false;
	let fromDayN = 14;

	const getColor = (count, total) => {
    const relativeCount = count / total * 200;
    const rgbvalue = Math.floor(250 - relativeCount) || 250;
    return `rgb(250, ${rgbvalue}, ${rgbvalue})`
  };

	let districts;

	if ($$props.geoData === void 0 && $$bindings.geoData && geoData !== void 0) $$bindings.geoData(geoData);

	$$result.css.add(css);

	let activeInfections = infections.filter(({ date }) => {
				const now = Date.now();
				const infectionTime = new Date(date).getTime();
				{
					const period = fromDayN * oneDayInMS;
					return infectionTime + period > now
				}
			});
	let infectionsByDistrict = activeInfections.reduce((total, infection) => {
				const count = total[infection.healthCareDistrict] || 0;
				return { ...total, [infection.healthCareDistrict]: count + 1 }
			}, {});
	{
				districts = geoData.map(district => {
					const infectionCount = infectionsByDistrict[district.name] || 0;
					return {
						...district,
						color: getColor(infectionCount, activeInfections.length),
						count: infectionCount || '',
					}
				});
			}

	return `<noscript>Vaati javascriptin datan hakuun <a${(v => v == null ? "" : ` href="${escape(apiURL)}"`)(apiURL)} class="svelte-17js0gq">${escape(apiURL)}</a></noscript>
	<aside class="svelte-17js0gq">
		${ loaded ? `<form class="svelte-17js0gq">
				<h1>Tartuntoja yhteensä ${escape(activeInfections.length)}</h1>
				<label class="svelte-17js0gq">
					Näytä kaikki tartunnat
					<input type="checkbox" ${(v => v ? ("checked" + (v === true ? "" : "=" + JSON.stringify(v))) : "")(showAll)}>
				</label>
				${ `<label class="svelte-17js0gq">Tartunnat viimeiseltä ${escape(fromDayN)} päivältä</label>
					<input type="range"${(v => v == null ? "" : ` min="${escape(1)}"`)(1)}${(v => v == null ? "" : ` max="${escape(31)}"`)(31)}${(v => v == null ? "" : ` step="${escape(1)}"`)(1)} class="svelte-17js0gq" ${(v => v ? ("value" + (v === true ? "" : "=" + JSON.stringify(v))) : "")(fromDayN)}>` }
			</form>` : `` }
		${ error ? `<h2 class="error svelte-17js0gq">Yhteys tietokantaan epäonnistui</h2>
			<p>${escape(error)}</p>
			<a${(v => v == null ? "" : ` href="${escape(apiURL)}"`)(apiURL)} class="svelte-17js0gq">${escape(apiURL)}</a>` : `` }
	</aside>
	<main class="svelte-17js0gq">
		<svg height="95%" viewBox="360 0 380 800">
			${each(districts, (district) => `<path${(v => v == null ? "" : ` d="${escape(district.d)}"`)(district.d)}${(v => v == null ? "" : ` fill="${escape(district.color)}"`)(district.color)} class="svelte-17js0gq"><title>${escape(district.name)}</title></path>
				<text${(v => v == null ? "" : ` x="${escape(district.x)}"`)(district.x)}${(v => v == null ? "" : ` y="${escape(district.y)}"`)(district.y)} class="svelte-17js0gq">${escape(district.count)}</text>`)}
		</svg>
	</main>
	<footer class="svelte-17js0gq">
		<a href="https://github.com/jonniek/koronatartunnat" class="svelte-17js0gq">github</a>
	</footer>`;
});

module.exports = Viz;
