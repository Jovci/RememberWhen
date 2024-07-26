class FontawesomeMarker extends mapboxgl.Marker {
    constructor({ icon, color, iconColor, coordinates, description, media }) {
        const el = document.createElement('div');
        el.className = 'marker';
        el.style.backgroundColor = color;
        el.style.width = '30px';
        el.style.height = '30px';
        el.style.borderRadius = '50%';
        el.style.display = 'flex';
        el.style.justifyContent = 'center';
        el.style.alignItems = 'center';
        el.innerHTML = `<i class="${icon}" style="color: ${iconColor};"></i>`;
        super(el)
            .setLngLat(coordinates)
            .setPopup(this.createPopup(description, media))
            .addTo(map);

        el.addEventListener('click', () => {
            if (selectedMarker) {
                selectedMarker.getElement().style.border = 'none';
            }
            selectedMarker = this;
            el.style.border = '2px solid red';
        });
    }

    createPopup(description, media) {
        const popupContent = document.createElement('div');
        popupContent.style.maxWidth = '200px';

        const descElem = document.createElement('p');
        descElem.innerText = description;
        popupContent.appendChild(descElem);

        if (media && media.length > 0) {
            const grid = document.createElement('div');
            grid.style.display = 'grid';
            grid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(50px, 1fr))';
            grid.style.gap = '5px';
            media.forEach((item, index) => {
                const mediaContainer = document.createElement('div');
                mediaContainer.style.position = 'relative';

                let mediaElem;
                if (item.type.startsWith('image/')) {
                    mediaElem = document.createElement('img');
                    mediaElem.src = item.src;
                } else if (item.type.startsWith('video/')) {
                    mediaElem = document.createElement('video');
                    mediaElem.src = item.src;
                    mediaElem.controls = true;
                }

                mediaElem.style.width = '100%';
                mediaElem.style.height = 'auto';
                mediaElem.style.borderRadius = '5px';
                mediaElem.style.cursor = 'pointer';
                mediaElem.addEventListener('click', () => {
                    showModal(item);
                });

                const removeBtn = document.createElement('span');
                removeBtn.innerHTML = '&times;';
                removeBtn.style.position = 'absolute';
                removeBtn.style.top = '5px';
                removeBtn.style.right = '5px';
                removeBtn.style.backgroundColor = 'rgba(0,0,0,0.7)';
                removeBtn.style.color = 'white';
                removeBtn.style.borderRadius = '50%';
                removeBtn.style.padding = '2px 5px';
                removeBtn.style.cursor = 'pointer';
                removeBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.removeMedia(index);
                });

                mediaContainer.appendChild(mediaElem);
                mediaContainer.appendChild(removeBtn);
                grid.appendChild(mediaContainer);
            });
            popupContent.appendChild(grid);
        }

        return new mapboxgl.Popup({ offset: 25 }).setDOMContent(popupContent);
    }

    updatePopup(media) {
        const popupContent = this.getPopup().getElement().querySelector('.mapboxgl-popup-content > div');
        const grid = popupContent.querySelector('div');

        media.forEach((item, index) => {
            const mediaContainer = document.createElement('div');
            mediaContainer.style.position = 'relative';

            let mediaElem;
            if (item.type.startsWith('image/')) {
                mediaElem = document.createElement('img');
                mediaElem.src = item.src;
            } else if (item.type.startsWith('video/')) {
                mediaElem = document.createElement('video');
                mediaElem.src = item.src;
                mediaElem.controls = true;
            }

            mediaElem.style.width = '100%';
            mediaElem.style.height = 'auto';
            mediaElem.style.borderRadius = '5px';
            mediaElem.style.cursor = 'pointer';
            mediaElem.addEventListener('click', () => {
                showModal(item);
            });

            const removeBtn = document.createElement('span');
            removeBtn.innerHTML = '&times;';
            removeBtn.style.position = 'absolute';
            removeBtn.style.top = '5px';
            removeBtn.style.right = '5px';
            removeBtn.style.backgroundColor = 'rgba(0,0,0,0.7)';
            removeBtn.style.color = 'white';
            removeBtn.style.borderRadius = '50%';
            removeBtn.style.padding = '2px 5px';
            removeBtn.style.cursor = 'pointer';
            removeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.removeMedia(index);
            });

            mediaContainer.appendChild(mediaElem);
            mediaContainer.appendChild(removeBtn);
            grid.appendChild(mediaContainer);
        });
    }

    removeMedia(index) {
        const markerIndex = markersArray.findIndex(markerData => {
            const markerLngLat = this.getLngLat();
            return markerData.coordinates[0] === markerLngLat.lng && markerData.coordinates[1] === markerLngLat.lat;
        });
        if (markerIndex !== -1) {
            markersArray[markerIndex].media.splice(index, 1);
            localStorage.setItem('markers', JSON.stringify(markersArray));
            this.getPopup().remove();
            this.setPopup(this.createPopup(markersArray[markerIndex].description, markersArray[markerIndex].media)).togglePopup();
        }
    }
}

// Load saved markers from local storage
markersArray.forEach(markerData => {
    new FontawesomeMarker(markerData);
});
