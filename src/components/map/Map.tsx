import React, { useRef, useEffect, useState } from "react";
import mapboxgl, { Map, GeoJSONSource } from "mapbox-gl";
import { error } from "console";

mapboxgl.accessToken = `${process.env.REACT_APP_MAP_TOKEN}`;

const MyMap = () => {
  const mapContainer = useRef<string | HTMLElement>("");
  const map = useRef<Map | null>(null);
  const [lng, setLng] = useState(-96);
  const [lat, setLat] = useState(37.8);
  const [zoom, setZoom] = useState(3);
  const [startCoords, setStartCoords] = useState<number[]>([-105.1431257, 39.7206271]);
  const [endCoords, setEndCoords] = useState<number[]>([]);
  const [gettingCurrPos, setGettingCurrPos] = useState(false);

  useEffect(() => {
    if (map.current) return; // if map exist return
    map.current = new mapboxgl.Map({ // otherwise we create a map object
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [lng, lat],
      zoom: zoom,
    });
    locatorButtonInit(); // add the getLocation button to the map
    map.current?.on("click", (e: mapboxgl.MapMouseEvent & mapboxgl.EventData) => { // adding an onClick handler to the map container for adding end waypoint
      createWaypointSelection(e); // function that gets called when we click the map; sets the end point coordinates
    });
  }, []);

  const createWaypointSelection = (e: mapboxgl.MapMouseEvent & mapboxgl.EventData) => {
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
    } else {
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
    // getDirections(coords);
    setEndCoords(coords); // set the end coords when we click the map
  }
  const locatorButtonInit = () => { // creates the locator button on the map 
    map.current?.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true
        },
        trackUserLocation: true,
        showUserHeading: true
      })
    );
    // if (navigator.geolocation) {
    //   navigator.geolocation.getCurrentPosition((pos) => {
    //     setStartCoords([pos.coords.longitude, pos.coords.latitude])
    //   })
    // }
  }

  const setStartToCurrPos = () => {
    setGettingCurrPos(true);
    navigator.geolocation.getCurrentPosition(pos => {
      if (pos) {
        console.log(pos);
        setGettingCurrPos(false)
        setStartCoords([pos.coords.longitude, pos.coords.latitude]);
      }
    }, err => {
      console.log(err.message)
    }, { enableHighAccuracy: true, timeout: 5000, maximumAge: Infinity })
  }

  const getDirections = (start: any, end: any): void => {

    const activity = 'cycling'
    console.log(start, end)
    if (startCoords !== []) {
      const url = `${process.env.REACT_APP_MAP_DIR_URL}/${activity}/${start[0]},${start[1]};${end[0]},${end[1]}?geometries=geojson&access_token=${process.env.REACT_APP_MAP_TOKEN}`
      fetch(url).then(async (res) => {
        const response = await res.json();
        console.log(response);
        const data = response.routes[0];
        const route = data.geometry.coordinates
        const geojson: any = {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: route
          }
        };
        // if the route already exists on the map, we'll reset it using setData
        if (map.current?.getSource('route')) {
          (map.current?.getSource('route') as GeoJSONSource).setData(geojson);
        } else {
          map.current?.addLayer({
            id: 'route',
            type: 'line',
            source: {
              type: 'geojson',
              data: geojson
            },
            layout: {
              'line-join': 'round',
              'line-cap': 'round'
            },
            paint: {
              'line-color': '#3887be',
              'line-width': 5,
              'line-opacity': 0.75
            }
          });
        }
      })
    }
  }

  return (
    <div className="h-56">
      <div id="map" ref={mapContainer as React.LegacyRef<HTMLDivElement> | undefined} className="map-container"></div>
      <div><button className="bg-black text-white" disabled={gettingCurrPos} onClick={() => getDirections(startCoords, endCoords)}>Get Directions</button></div>
      <div><button onClick={() => setStartCoords([-104.5, 35.6])}>Set new Start Coords</button></div>
      <div><button onClick={() => setStartToCurrPos()}>Set Start Coords to My Location</button></div>
    </div>
  );
};

export default MyMap;
