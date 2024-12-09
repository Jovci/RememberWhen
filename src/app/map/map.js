// pages/map.js

import React from 'react';

export default function MapPage() {
  return (
    <div style={{ position: 'fixed', top: 0, bottom: 0, left: 0, right: 0 }}>
      <iframe
        src="https://api.mapbox.com/styles/v1/jovci/clxbm0ukj024301pohxdx4u98.html?title=view&access_token=pk.eyJ1Ijoiam92Y2kiLCJhIjoiY2x2dWVzNzU2MWphdDJ3bzZ0NDh6dmR5ZiJ9.T8BAscTbUkJhCBTnq1_iSQ&zoomwheel=true&fresh=true#16.59/33.881116/-117.883757/345.6/66"
        title="RememberWhen Map"
        style={{
          border: 'none',
          width: '100%',
          height: '100%',
        }}
      ></iframe>
    </div>
  );
}
