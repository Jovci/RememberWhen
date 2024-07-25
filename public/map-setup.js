let selectedMarker = null;
let markersArray = JSON.parse(localStorage.getItem('markers')) || [];

mapboxgl.accessToken = 'pk.eyJ1Ijoiam92Y2kiLCJhIjoiY2x2dWVzNzU2MWphdDJ3bzZ0NDh6dmR5ZiJ9.T8BAscTbUkJhCBTnq1_iSQ';
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/jovci/clxbm0ukj024301pohxdx4u98',
    center: [-95, 40],
    zoom: 3,
    projection: 'globe',
});

// Add the control to the map.
map.addControl(
    new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl
    })
);

map.addControl(new mapboxgl.NavigationControl());
map.scrollZoom.enable();

map.on('style.load', () => {
    map.setFog({});
});

const secondsPerRevolution = 240;
const maxSpinZoom = 5;
const slowSpinZoom = 3;

let userInteracting = false;
const spinEnabled = true;

function spinGlobe() {
    const zoom = map.getZoom();
    if (spinEnabled && !userInteracting && zoom < maxSpinZoom) {
        let distancePerSecond = 360 / secondsPerRevolution;
        if (zoom > slowSpinZoom) {
            const zoomDif = (maxSpinZoom - zoom) / (maxSpinZoom - slowSpinZoom);
            distancePerSecond *= zoomDif;
        }
        const center = map.getCenter();
        center.lng -= distancePerSecond;
        map.easeTo({ center, duration: 1000, easing: (n) => n });
    }
}

map.on('mousedown', () => {
    userInteracting = true;
});
map.on('dragstart', () => {
    userInteracting = true;
});

map.on('moveend', () => {
    spinGlobe();
});

spinGlobe();
