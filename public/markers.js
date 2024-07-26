let selectedMarker = null;
let markersArray = [];

async function loadMarkersFromServer() {
    try {
        const response = await fetch('https://rememberwhen-backend-43d3134117c9.herokuapp.com/markers');
        const markers = await response.json();
        markers.forEach(markerData => {
            new FontawesomeMarker(markerData);
            markersArray.push(markerData); // Add to local array to maintain consistency
        });
    } catch (error) {
        console.error('Error loading markers from server:', error);
    }
}

document.addEventListener('DOMContentLoaded', loadMarkersFromServer);

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
                    map.once('click', async (e) => {
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

                        // Save to backend
                        try {
                            const response = await fetch('https://rememberwhen-backend-43d3134117c9.herokuapp.com/markers', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify(markerData)
                            });

                            if (!response.ok) {
                                throw new Error('Network response was not ok');
                            }
                        } catch (error) {
                            console.error('Error saving marker to server:', error);
                        }

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
