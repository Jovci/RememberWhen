class FontawesomeMarker extends mapboxgl.Marker {
    constructor({ icon, color, iconColor, coordinates, description, media, _id }) {
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
            .setPopup(this.createPopup(description, media, _id))
            .addTo(map);

        this._id = _id;  // Store the marker ID

        el.addEventListener('click', () => {
            if (selectedMarker) {
                selectedMarker.getElement().style.border = 'none';
            }
            selectedMarker = this;
            selectedMarkerId = this._id; // Update the global selected marker ID
            el.style.border = '2px solid red';
        });
    }

    createPopup(description, media, markerId) {
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
                removeBtn.addEventListener('click', async (e) => {
                    e.stopPropagation();
                    try {
                        markerId = this._id
                        await fetch(`https://rememberwhen-backend-43d3134117c9.herokuapp.com/markers/${markerId}/media/${index}`, {
                            method: 'PATCH'
                        });
                        this.removeMedia(index);
                    } catch (error) {
                        console.error('Error deleting media from server:', error);
                    }
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

        // Clear existing media elements
        while (grid.firstChild) {
            grid.removeChild(grid.firstChild);
        }

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
            removeBtn.addEventListener('click', async (e) => {
                e.stopPropagation();
                try {
                    await fetch(`https://rememberwhen-backend-43d3134117c9.herokuapp.com/markers/${this._id}/media/${index}`, {
                        method: 'PATCH'
                    });
                    this.removeMedia(index);
                } catch (error) {
                    console.error('Error deleting media from server:', error);
                }
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
            this.getPopup().remove();
            this.setPopup(this.createPopup(markersArray[markerIndex].description, markersArray[markerIndex].media, this._id)).togglePopup();
        }
    }
}
