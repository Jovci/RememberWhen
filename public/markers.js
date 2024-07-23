document.addEventListener('DOMContentLoaded', (event) => {
    const markers = [
        {
            coordinates: [-117.8443, 33.6405], // UCI coordinates
            icon: 'fa-solid fa-robot', // Example icon from the provided array
            iconColor: 'blue',
            color: '#FFD700', // White background to contrast with the icon color
            description: "University of California, Irvine (UCI)"
        },
        {
            coordinates: [-117.8850, 33.8831], // CSUF coordinates
            icon: 'fa-solid fa-graduation-cap', // Example icon from the provided array
            iconColor: 'orange',
            color: '#0000FF', // White background to contrast with the icon color
            description: "California State University, Fullerton (CSUF)"
        }
    ];

    markers.forEach(marker => {
        const popup = new mapboxgl.Popup({ offset: 25 }).setText(marker.description);

        new FontawesomeMarker({
            icon: marker.icon,
            color: marker.color,
            iconColor: marker.iconColor,
            coordinates: marker.coordinates,
            description: marker.description
        });
    });
});
