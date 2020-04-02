

export const displayMap = locations => {
    mapboxgl.accessToken = 'pk.eyJ1IjoiZXN0ZWVtYXlvIiwiYSI6ImNrODduYmFmNjAzamIzaG4zdTg5Y3dyYTUifQ.dH996f5T_aFvLWDoPGW--w';
    var map = new mapboxgl.Map({
        container: 'map',
        // style: 'mapbox://styles/esteemayo/ck87z8kaq1nes1ilxknj42zmq',
        style: 'mapbox://styles/esteemayo/ck881n5cz0uhn1jta1qo6d378',
        scrollZoom: false
        // center: [-118.113491, 34.111745],
        // zoom: 4,
        // interactive: false
    });

    const bounds = new mapboxgl.LngLatBounds();

    locations.forEach(loc => {
        // Create marker
        const el = document.createElement('div');
        el.className = 'marker';

        // Add marker
        new mapboxgl.Marker({
            element: el,
            anchor: 'bottom' // bottom or center
        })
            .setLngLat(loc.coordinates)
            .addTo(map);

        // Add popup
        new mapboxgl.Popup({
            offset: 30
        })
            .setLngLat(loc.coordinates)
            .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
            .addTo(map)

        // Extend the map bounds to include the current location
        bounds.extend(loc.coordinates);
    });

    map.fitBounds(bounds, {
        padding: {
            top: 200,
            bottom: 150,
            left: 100,
            right: 100
        }
    });
};