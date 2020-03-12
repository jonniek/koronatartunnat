Svelte app with server side rendered svg visualization of coronavirus
infections in Finland.

Server side rendered data is updated on build and regulargly through
a cronjob.

The svg projection was done with d3 but extracted to vanilla svg
to avoid runtime dependencies.

Data is from https://github.com/HS-Datadesk/koronavirus-avoindata
