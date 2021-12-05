import React, { useRef, useEffect, useState } from "react";
import mapboxgl, { Map, GeoJSONSource } from "mapbox-gl";


mapboxgl.accessToken = `${process.env.REACT_APP_MAP_TOKEN}`;

const MyMap = () => {
  const mapContainer = useRef<string | HTMLElement>("");
  const map = useRef<Map | null>(null);
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
    map.current?.on("click", (e: mapboxgl.MapMouseEvent & mapboxgl.EventData) => {
      // const coords = Object.keys(e.lngLat).map((key) => e.lngLat[key])
      console.log(e.lngLat)
      const coords = [e.lngLat.lng, e.lngLat.lat]
      const end: any = {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'Point',
              coordinates: coords
            }
          }
        ]
      };
      if (map.current?.getLayer('end')) {
        (map.current.getSource('end') as GeoJSONSource).setData(end);
        console.log('here')
      } else {
        console.log('here')
        map.current?.addLayer({
          id: 'end',
          type: 'circle',
          source: {
            type: 'geojson',
            data: {
              type: 'FeatureCollection',
              features: [
                {
                  type: 'Feature',
                  properties: {},
                  geometry: {
                    type: 'Point',
                    coordinates: coords
                  }
                }
              ]
            }
          },
          paint: {
            'circle-radius': 10,
            'circle-color': '#f30'
          }
        });
      }
    })
    getDirections();
  }, []);

  const getDirections = (): void => {
    const activity = 'walking'
    const url = `${process.env.REACT_APP_MAP_DIR_URL}/${activity}/-105.143141,39.720593;-105.1675,39.6805?geometries=geojson&access_token=${process.env.REACT_APP_MAP_TOKEN}`
    fetch(url).then(async (res) => {
      const data = await res.json();
      console.log(data);
    })
  }

  return (
    <div className="h-56">
      <div id="map" ref={mapContainer as React.LegacyRef<HTMLDivElement> | undefined} className="map-container"></div>
    </div>
  );
};

export default MyMap;
