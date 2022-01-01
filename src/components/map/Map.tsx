/**
 * 
 * 
 */

import React, { useRef, useEffect, useState } from "react";
import mapboxgl, { Map, GeoJSONSource, LngLatLike, Point, PointLike } from "mapbox-gl";
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import { useAuth } from "../../context/Auth";
import { PeakInterface } from "../../interface/PeakInterface";
import { authService } from "../../service/authService";
import { peakService } from "../../service/peakService";


mapboxgl.accessToken = `${process.env.REACT_APP_MAP_TOKEN}`;

const MyMap = () => {
  const auth = useAuth();

  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map>();
  const [lng, setLng] = useState(-96);
  const [lat, setLat] = useState(37.8);
  const [zoom, setZoom] = useState(3);

  const [geocoder, setGeocoder] = useState<MapboxGeocoder>(
    new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      marker: false,
      // @ts-ignore: Unreachable code error
      mapboxgl: mapboxgl
    })
  )


  // marker for finding a new peak
  // should only exist at one point on the map
  // can be set in the following ways: 
  //  - on search result
  //  - on dbl click
  const newPeakMarker = new mapboxgl.Marker()

  // div reference for setting popup html
  const popupDiv = window.document.createElement('div')

  // marker properties 
  const markerHeight = 50;
  const markerRadius = 10;
  const linearOffset = 25;
  const popupOffsets: mapboxgl.Offset = {
    'top': [0, 0],
    'top-left': [0, 0],
    'top-right': [0, 0],
    'bottom': [0, -markerHeight],
    'bottom-left': [linearOffset, (markerHeight - markerRadius + linearOffset) * -1],
    'bottom-right': [-linearOffset, (markerHeight - markerRadius + linearOffset) * -1],
    'left': [markerRadius, (markerHeight - markerRadius) * -1],
    'right': [-markerRadius, (markerHeight - markerRadius) * -1]
  };
  const popup = new mapboxgl.Popup({ offset: popupOffsets }) // popup object

  // fake data points for testing
  const points: LngLatLike[] = [
    [30.5, 50.5],
    [32.5, 50.5],
    [34.5, 50.5],
  ]

  // get the peaks for the user - make a request to server
  // display them on the map - as markers with data in popup


  useEffect(() => {
    if (mapRef.current) return; // if map exist return
    if (!mapContainer.current) return;
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11/",
      center: [lng, lat],
      zoom: zoom,
    })
    map.setStyle('mapbox://styles/mapbox/dark-v10')

    // mapping fake data to map
    // points.map((point) => {
    //   new mapboxgl.Marker()
    //     .setLngLat(point)
    //     .addTo(map);
    // })
    loadPeaks(map);

    document.getElementById('geocoder')?.appendChild(geocoder.onAdd(map))

    geocoder.on('result', (event) => {
      const point = event.result.geometry.coordinates
      newPeakMarker.setLngLat(point).addTo(map).setPopup(popup).setDraggable(true)
      setPeak(newPeakMarker)
      setPopup(newPeakMarker, map)
      newPeakMarker.on('dragend', () => onDragEnd(newPeakMarker, map))
    })

    map.on('dblclick', (event) => {
      console.log(event.lngLat)
      const point = event.lngLat
      newPeakMarker.setLngLat(point).addTo(map).setPopup(popup).setDraggable(true)
      setPeak(newPeakMarker)
      setPopup(newPeakMarker, map)
      newPeakMarker.on('dragend', () => onDragEnd(newPeakMarker, map))
    })
  }, []);

  const onDragEnd = (marker: mapboxgl.Marker, map: mapboxgl.Map) => {
    setPopup(marker, map)
    setPeak(marker)
  }

  function setPeak(marker: mapboxgl.Marker) {
    auth.setCurrentPeak((prevState: PeakInterface | undefined) => ({
      ...prevState,
      longitude: marker.getLngLat().lng,
      latitude: marker.getLngLat().lat
    }));
  }

  function setPopup(marker: mapboxgl.Marker, map: mapboxgl.Map) {
    popupDiv.innerHTML = `<h1>Longitude: ${marker.getLngLat().lng}</h1> <h1>Latitude: ${marker.getLngLat().lat}</h1>`
    popup.setLngLat(marker.getLngLat()).setDOMContent(popupDiv).setMaxWidth("300px")
    popup.addTo(map)
  }

  async function loadPeaks(map: mapboxgl.Map) {
    const _peak_data = await peakService.getAllPeaks()
    if (_peak_data) {
      _peak_data.map((peak: PeakInterface) => {
        if (peak.longitude && peak.latitude) {
          // create marker location
          const lngLat: LngLatLike = [peak.longitude, peak.latitude]
          // create marker popup
          const popupDiv = window.document.createElement('div') // div creation for popup
          const popup = new mapboxgl.Popup({ offset: popupOffsets }) // popup object
          popupDiv.innerHTML = `<h1>Peak Name: ${peak.peak_name}</h1> <h1>Description: ${peak.peak_description}</h1>`
          popup.setLngLat(lngLat).setDOMContent(popupDiv).setMaxWidth("300px")

          new mapboxgl.Marker()
            .setLngLat(lngLat).setPopup(popup)
            .addTo(map);
        }
      })
    }
  }
  return (
    <div className="h-56 w-screen px-5">
      <div id="map" ref={mapContainer as React.LegacyRef<HTMLDivElement> | undefined} style={{ height: "75vh" }} className="map-container"></div>
      <div id="geocoder" className="geocoder"></div>
    </div>
  );
};

export default MyMap;

