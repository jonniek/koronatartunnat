Svelte app with server side rendered svg visualization of coronavirus
infections in Finland.

### build process

The npm build script runs 4 commands.

1. **prebuild:** Fetches the infection data and writes it to a file
2. **client build:** Builds the js bundle
3. **server build:** Builds the Viz-ssr.js svelte component
4. **build:** Builds the server rendered index.html based on step 1 data and step 3 component

The svg projection was done with d3 but extracted to vanilla svg
to avoid runtime dependencies. It was further hacked together in inkscape
to union larger areas together for death statistics map.

Data is from https://github.com/HS-Datadesk/koronavirus-avoindata
