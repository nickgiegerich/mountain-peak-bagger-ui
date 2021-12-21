/**
 * 
 * TODO:
 * create a way to store the searched result in the form inputs
 * "                        " double click events in form inputs
 * 
 * when the form is submitted create the object and get back lngLat to put a marker on map 
 * 
 * 
 * need to implement context so that I can share states from map events and forms
 * 
 * 
 * 
 */

import React, { useRef, useEffect, useState } from "react";
import mapboxgl, { Map, GeoJSONSource, LngLatLike } from "mapbox-gl";
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';

mapboxgl.accessToken = `${process.env.REACT_APP_MAP_TOKEN}`;

const MyMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map>();
  const [lng, setLng] = useState(-96);
  const [lat, setLat] = useState(37.8);
  const [zoom, setZoom] = useState(3);
  const [geocoder, setGeocoder] = useState<MapboxGeocoder>(
    new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      marker: true,
      // @ts-ignore: Unreachable code error
      mapboxgl: mapboxgl
    })
  )

  const points: LngLatLike[] = [
    [30.5, 50.5],
    [32.5, 50.5],
    [34.5, 50.5],
  ]


  useEffect(() => {
    if (mapRef.current) return; // if map exist return
    if (!mapContainer.current) return;
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [lng, lat],
      zoom: zoom,
    })
    points.map((point) => {
      new mapboxgl.Marker()
        .setLngLat(point)
        .addTo(map);
    })
    document.getElementById('geocoder')?.appendChild(geocoder.onAdd(map))
    geocoder.on('result', (event) => {
      console.log("Features: ", JSON.stringify(event.result.geometry, null, 2))
    })
  }, []);

  return (
    <div className="h-56">
      <div id="map" ref={mapContainer as React.LegacyRef<HTMLDivElement> | undefined} style={{ height: "75vh" }} className="map-container"></div>
      <div id="geocoder" className="geocoder"></div>
    </div>
  );
};

export default MyMap;
