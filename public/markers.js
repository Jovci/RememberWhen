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
        new FontawesomeMarker({
            icon: marker.icon,
            color: marker.color,
            iconColor: marker.iconColor,
            coordinates: marker.coordinates,
            description: marker.description
        });
    });

    document.getElementById('placeMarker').addEventListener('click', () => {
        const icon = document.getElementById('icon').value;
        const iconColor = document.getElementById('iconColor').value;
        const outerColor = document.getElementById('outerColor').value;
        const description = document.getElementById('description').value;
        const mediaInput = document.getElementById('media');
        const media = [];

        if (mediaInput.files) {
            Array.from(mediaInput.files).forEach(file => {
                const reader = new FileReader();
                reader.onload = function(e) {
                    media.push({ src: e.target.result, type: file.type });

                    // When all media are loaded, save the marker
                    if (media.length === mediaInput.files.length) {
                        map.once('click', (e) => {
                            const coordinates = [e.lngLat.lng, e.lngLat.lat];
                            const markerData = {
                                icon: icon,
                                color: outerColor,
                                iconColor: iconColor,
                                coordinates: coordinates,
                                description: description,
                                media: media
                            };

                            new FontawesomeMarker(markerData);
                            markersArray.push(markerData);
                            localStorage.setItem('markers', JSON.stringify(markersArray));

                            // Clear the media upload input
                            mediaInput.value = '';
                        });
                    }
                };
                reader.readAsDataURL(file);
            });
        }
    });

    document.getElementById('deleteMarker').addEventListener('click', () => {
        if (selectedMarker) {
            const markerElement = selectedMarker.getElement();
            const markerIndex = markersArray.findIndex(markerData => {
                const markerLngLat = selectedMarker.getLngLat();
                return markerData.coordinates[0] === markerLngLat.lng && markerData.coordinates[1] === markerLngLat.lat;
            });
            if (markerIndex !== -1) {
                markersArray.splice(markerIndex, 1);
                localStorage.setItem('markers', JSON.stringify(markersArray));
            }
            selectedMarker.remove();
            selectedMarker = null;
        }
    });

    document.getElementById('addMediaToMarker').addEventListener('click', () => {
        if (selectedMarker) {
            const mediaInput = document.getElementById('media');
            const newMedia = [];
            if (mediaInput.files) {
                Array.from(mediaInput.files).forEach(file => {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        newMedia.push({ src: e.target.result, type: file.type });

                        // When all media are loaded, update the marker
                        if (newMedia.length === mediaInput.files.length) {
                            const markerIndex = markersArray.findIndex(markerData => {
                                const markerLngLat = selectedMarker.getLngLat();
                                return markerData.coordinates[0] === markerLngLat.lng && markerData.coordinates[1] === markerLngLat.lat;
                            });
                            if (markerIndex !== -1) {
                                markersArray[markerIndex].media = markersArray[markerIndex].media.concat(newMedia);
                                localStorage.setItem('markers', JSON.stringify(markersArray));
                                selectedMarker.updatePopup(newMedia);
                                
                                // Clear the media upload input
                                mediaInput.value = '';
                            }
                        }
                    };
                    reader.readAsDataURL(file);
                });
            }
        }
    });

    // Modal functionality
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const modalVideo = document.getElementById('modalVideo');
    const closeModal = document.getElementsByClassName('close')[0];

    function showModal(media) {
        if (media.type.startsWith('image/')) {
            modalImage.src = media.src;
            modalImage.style.display = 'block';
            modalVideo.style.display = 'none';
        } else if (media.type.startsWith('video/')) {
            modalVideo.src = media.src;
            modalVideo.style.display = 'block';
            modalImage.style.display = 'none';
        }
        modal.style.display = 'flex';
    }

    closeModal.onclick = function() {
        modal.style.display = 'none';
        modalImage.src = '';
        modalVideo.src = '';
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
            modalImage.src = '';
            modalVideo.src = '';
        }
    }
});
