import React, { useRef, useEffect, useState } from "react";
import mapboxgl, { LngLatLike } from "mapbox-gl";
import { layouts, SvgContent, svgArray }from "@mapbox/maki"
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import { PeakInterface } from "../../interface/PeakInterface";
import { usePeak } from "../../context/Peak";

mapboxgl.accessToken = `${process.env.REACT_APP_MAP_TOKEN}`;

interface props {
  peakList: PeakInterface[]
}

const MyMap = ({ peakList }: props) => {

  const { setCurrentPeak, loading } = usePeak();

  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map>();
  const [geoCoderInit, setGeoCoderInit] = useState(false)
  const [localPeakList, setLocalPeakList] = useState<PeakInterface[]>()
  const [mapMarkers, setMapMarkers] = useState<mapboxgl.Marker[]>()

  const geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    marker: false,
    // @ts-ignore: Unreachable code error
    mapboxgl: mapboxgl
  })

  const [lng, setLng] = useState(-96);
  const [lat, setLat] = useState(37.8);
  const [zoom, setZoom] = useState(3);

  const newPeakMarker = new mapboxgl.Marker({ color: '#48A14D' })

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

  useEffect(() => {
    const markers = loadPeakMarkers();
    setMapMarkers(markers);
  }, [peakList])

  useEffect(() => {
    if (mapRef.current) return; // if map exist return
    if (!mapContainer.current) return;

    // creating the map instance
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11/",
      center: [lng, lat],
      zoom: zoom,
    })



    // changing the map to dark theme
    map.setStyle('mapbox://styles/mapbox/dark-v10')

    // getting the peaks of the user
    // loadPeaks(map)

    // adding the geocoder to its div element

    // if (!geoCoderInit) {
    document.getElementById('geocoder')?.replaceChildren(geocoder.onAdd(map))
    setGeoCoderInit(true)
    // }
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


    mapMarkers?.map((marker) => {
      marker.addTo(map)
    })
  }, [mapMarkers]);

  const onDragEnd = (marker: mapboxgl.Marker, map: mapboxgl.Map) => {
    setPopup(marker, map)
    setPeak(marker)
  }

  function setPeak(marker: mapboxgl.Marker) {
    setCurrentPeak((prevState: PeakInterface | undefined) => ({
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

  function loadPeakMarkers() {

    const markers: mapboxgl.Marker[] = []
    peakList.map((peak: PeakInterface) => {
      if (peak.longitude && peak.latitude) {

        // create marker location
        const lngLat: LngLatLike = [peak.longitude, peak.latitude]

        // create marker popup
        const popupDiv = window.document.createElement('div') // div creation for popup
        const popup = new mapboxgl.Popup({ offset: popupOffsets }) // popup object
        popupDiv.innerHTML = `<h1>Peak Name: ${peak.peak_name}</h1> <h1>Description: ${peak.peak_description}</h1>`
        popup.setLngLat(lngLat).setDOMContent(popupDiv).setMaxWidth("300px")

        const newMarker = new mapboxgl.Marker()
          .setLngLat(lngLat).setPopup(popup)
        markers.push(newMarker)
      }
    })
    return markers
  }

  return (
    <div className="h-56 w-screen px-5">
      <div id="map" ref={mapContainer as React.LegacyRef<HTMLDivElement> | undefined} style={{ height: "75vh" }} className="map-container"></div>
      <div id="geocoder" className="geocoder"></div>
    </div>
  );
};

export default MyMap;

