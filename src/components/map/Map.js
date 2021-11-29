import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";

mapboxgl.accessToken =
  "pk.eyJ1IjoibmdpZWdlcmljaCIsImEiOiJja3doejh0ajMxMzZqMm5wYWhjbjBjbXgyIn0.PXwhB9TGUnShXfonTAEHxA";

const Map = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-70.9);
  const [lat, setLat] = useState(42.35);
  const [zoom, setZoom] = useState(9);

  useEffect(() => {
    if (map.current) return;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [lng, lat],
      zoom: zoom,
    });
  }, []);
  return (
    <div className="h-56">
      <div ref={mapContainer} className="map-container"></div>
    </div>
  );
};

export default Map;
