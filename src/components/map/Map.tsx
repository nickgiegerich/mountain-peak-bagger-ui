import React, { useRef, useEffect, useState } from "react";
import mapboxgl, { LngLatLike } from "mapbox-gl";
// import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder'; // no longer using the geocode search API
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import { PeakInterface } from "../../interface/PeakInterface";
import { usePeak } from "../../context/Peak";
import featureCollection from "../../lib/north-america-peaks";
import fetchImg from "../../lib/fetchImage";
import { PeakObject } from "../../utils/types/peakTypes";

mapboxgl.accessToken = `${process.env.REACT_APP_MAP_TOKEN}`;

type props = {
  peakObject: PeakObject | undefined, 
  setPeakObject: React.Dispatch<React.SetStateAction<PeakObject>>;
}

const MyMap: React.FC<props> = ({peakObject, setPeakObject}) => {
  const { setCurrentPeak } = usePeak(); // context for peak object

  // CONSTANTS FOR MAP INIT
  const LNG = -96
  const LAT = 37.8
  const ZOOM = 3

  // search list for filtering sidebar searches
  let peak_search_list: mapboxgl.MapboxGeoJSONFeature[] = [];


  // sidebar toggle status
  const [sideBarOpen, setSideBarOpen] = useState<boolean>(false)

  // making reference to the filterEl input and listingEl list of peaks seen on map
  // const filterEl = (document.getElementById('feature-filter') as HTMLInputElement);
  // const listingEl = document.getElementById('feature-listing') as HTMLDivElement;

  // const[filterEl, setFilterEl] = useState<HTMLCollectionOf<Element>>(document.getElementsByTagName('feature-filter'))
  // const [listingEl, setListingEl] = useState<HTMLElement | null>(document.getElementById('feature-listing'))

  // map init variables 
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map>();
  const [mapMarkers, setMapMarkers] = useState<mapboxgl.Marker[]>()

  // used when a user double clicks the map to set a marker
  // const newPeakMarker = new mapboxgl.Marker({ color: '#48A14D' })

  // div reference for setting popup html
  const popupDiv = window.document.createElement('div')

  // marker properties 
  const markerHeight = 50;
  const markerRadius = 10;

  // Popup properties
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
  // const popup = new mapboxgl.Popup({ offset: popupOffsets }) // popup object

  const [popup, setPopup] = useState(new mapboxgl.Popup({ offset: popupOffsets }))

  function handlePeakSelectionChange(label: string, lat: number, lng: number) {
    setPeakObject({label: label, latitude: lat, longitude: lng})
  }

  useEffect(() => {
    if (mapRef.current) return; // if map exist return
    if (!mapContainer.current) return;

    // creating the map instance
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/dark-v10",
      center: [LNG, LAT],
      zoom: ZOOM
    })

    const filterEl = (document.getElementById('feature-filter') as HTMLInputElement);
    const listingEl = document.getElementById('feature-listing') as HTMLDivElement;

    // filterEl?.getElementsByTagName('feature-filter')

    // add a custom id prop to our geojson data
    // TODO: add this field to static data so we save load resources
    // TODO: may need to use this to check if the user has done certain peaks before showing them on screen
    featureCollection.features.map((feature) => {
      // @ts-ignore: Unreachable code error
      feature.properties['id'] = feature.properties?.name + '-' + String(feature.properties?.feet)
    });

    map.on('load', async () => {
      // assigning custom point image to map
      const img = await fetchImg("/images/mountain.png");
      map.addImage("mt-peak", img, { pixelRatio: 2 });

      // adding the geojson data to the map and configuring the clustering
      map.addSource('source',
        {
          type: "geojson",
          data: featureCollection,
        })

      // cluster layer
      map.addLayer({
        id: 'peaks',
        source: 'source',
        type: 'symbol',
        paint: {
          "text-color": "#FFF",
          "text-halo-color": "#000",
          "text-halo-width": 4,
          "icon-opacity": 1,
          "text-opacity": 1,
        },
        layout: {
          "icon-ignore-placement": true,
          "icon-allow-overlap": true,
          "icon-anchor": "bottom",
          "icon-size": .1,
          "text-field": ["get", "name"],
          "text-ignore-placement": false,
          "text-allow-overlap": false,
          "text-size": 14,
          "text-anchor": "top",
          "text-optional": true,
          "icon-image": "mt-peak",
        }
      })

      // When a click event occurs on a feature in
      // the unclustered-point layer, open a popup at
      // the location of the feature, with
      // description HTML from its properties.
      map.on('click', 'peaks', (e) => {
        if (e.features !== undefined && e.features[0].geometry.type === 'Point') {
          const coordinates = e.features[0].geometry.coordinates.slice()
          const name = e.features[0].properties?.name
          const feet = e.features[0].properties?.feet
          const meters = e.features[0].properties?.meters
          const stringBuilder = `${name} - elevation ${feet} ft. (${meters} m)`
          // const countries = e.features[0].properties?.countries[0]

          // Ensure that if the map is zoomed out such that
          // multiple copies of the feature are visible, the
          // popup appears over the copy being pointed to.
          while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
          }

          // new mapboxgl.Popup({ offset: popupOffsets })
          //   .setLngLat(coordinates as LngLatLike)
          //   .setHTML(
          //     `<div><h1 className="text-white" style="font-size: 20px; font-weight: 400; margin-bottom: 10px; text-transform: capitalize;">${name}</h1> <h1>${feet} ft.</h1> <h1>${meters} m</h1> </div>`
          //   )
          //   .addTo(map);

          setPeakPopup(map, e.features[0])
          map.flyTo({// @ts-ignore: Unreachable code error
            center: e.features[0].geometry.coordinates,
            zoom: 8
          })
          handlePeakSelectionChange(stringBuilder, coordinates[1], coordinates[0])
        }
      })

      map.on('movestart', () => {
        map.setFilter('peaks', ['has', 'name'])

      })

      map.on('moveend', () => {

        const features = map.queryRenderedFeatures(undefined, { layers: ['peaks'] });

        if (features) {

          const uniqueFeatures = getUniqueFeatures(features, 'name', 'feet')

          renderlistings(uniqueFeatures, map, listingEl, filterEl)

          // Clear the input container
          // if (filterEl) {
          //   filterEl.value = '';
          // }

          peak_search_list = uniqueFeatures

        }
      })

      filterEl?.addEventListener('keyup', (e: any) => {
        const value = normalize(e.target.value); // storing current value

        // Filter visible features that match the input value.
        const filtered: mapboxgl.MapboxGeoJSONFeature[] = []; // empty list for filtered features


        if (value == '') { // if there is no value set map to original 
          map.setFilter('peaks', ['has', 'name'])
        } else {
          console.log('value: ', value)
        }


        peak_search_list.map((feature) => {
          const name = normalize(feature.properties?.name);
          if (name.includes(value)) {
            filtered.push(feature);
          }
        })

        // Populate the sidebar with filtered results
        renderlistings(filtered, map, listingEl, filterEl);

        // Set the filter to populate features into the layer.
        if (filtered.length) {
          map.setFilter('peaks', [
            'match',
            ['get', 'id'],
            filtered.map((feature) => {
              return feature.properties?.id;
            }),
            true,
            false
          ]);
        }

      })
      // end of onload
    })

    // map.on('dblclick', (event) => {
    //   console.log(event.lngLat)
    //   const point = event.lngLat
    //   newPeakMarker.setLngLat(point).addTo(map).setPopup(popup).setDraggable(true)
    //   setPeak(newPeakMarker)
    //   setPopup(newPeakMarker, map)
    //   newPeakMarker.on('dragend', () => onDragEnd(newPeakMarker, map))
    // })

    mapMarkers?.map((marker) => {
      marker.addTo(map)
    })

    // document.getElementById('geocoder')?.replaceChildren(geocoder.onAdd(map))

    // geocoder.on('result', (event) => {
    //   const point = event.result.geometry.coordinates
    //   newPeakMarker.setLngLat(point).addTo(map).setPopup(popup).setDraggable(true)
    //   setPeak(newPeakMarker)
    //   setPopup(newPeakMarker, map)
    //   newPeakMarker.on('dragend', () => onDragEnd(newPeakMarker, map))
    // })

  }, []);

  // const onDragEnd = (marker: mapboxgl.Marker, map: mapboxgl.Map) => {
  //   setPopup(marker, map)
  //   setPeak(marker)
  // }

  // function setPeak(marker: mapboxgl.Marker) {
  //   setCurrentPeak((prevState: PeakInterface | undefined) => ({
  //     ...prevState,
  //     longitude: marker.getLngLat().lng,
  //     latitude: marker.getLngLat().lat
  //   }));
  // }

  // function setPopup(marker: mapboxgl.Marker, map: mapboxgl.Map) {
  //   popupDiv.innerHTML = `<h1>Longitude: ${marker.getLngLat().lng}</h1> <h1>Latitude: ${marker.getLngLat().lat}</h1>`
  //   popup.setLngLat(marker.getLngLat()).setDOMContent(popupDiv).setMaxWidth("500px")
  //   popup.addTo(map)
  // }

  // function loadPeakMarkers() {

  //   const markers: mapboxgl.Marker[] = []
  //   peakList.map((peak: PeakInterface, idx) => {
  //     if (peak.longitude && peak.latitude) {

  //       // create marker location
  //       const lngLat: LngLatLike = [peak.longitude, peak.latitude]

  //       // create marker popup
  //       const popupDiv = window.document.createElement('div') // div creation for popup
  //       const popup = new mapboxgl.Popup({ offset: popupOffsets }) // popup object
  //       popupDiv.innerHTML = `<div  id='peak-${idx}'><h1 className="text-white" style="font-size: 20px; font-weight: 400; margin-bottom: 10px; text-transform: capitalize;">${peak.peak_name}</h1> <h1>${peak.peak_description ? peak.peak_description : ''}</h1> </div>`

  //       popup.setLngLat(lngLat).setDOMContent(popupDiv).setMaxWidth("300px")

  //       const newMarker = new mapboxgl.Marker()
  //         .setLngLat(lngLat).setPopup(popup)

  //       newMarker.on('click', () => {
  //         console.log('double clicked')
  //       })
  //       // add markers to marker list
  //       markers.push(newMarker)


  //     }
  //   })
  //   return markers
  // }

  function renderlistings(features: mapboxgl.MapboxGeoJSONFeature[], map: mapboxgl.Map, listingEl: any, filterEl: any) {
    const empty = document.createElement('p'); // new p tag element
    // Clear any existing listings
    if (listingEl) {
      listingEl.innerHTML = '';
      if (features.length > 0) {
        for (const feature of features) {
          const itemButton = document.createElement('button');
          // @ts-ignore: Unreachable code error
          const coordinates = feature.geometry.coordinates.slice()
          const peakName = `${feature.properties?.name}`;
          const peakElevationFeet = `${feature.properties?.feet}`;
          const peakElevationMeters = `${feature.properties?.meters}`;
          
          const stringBuilder = `${peakName} - elevation ${peakElevationFeet} ft. (${peakElevationMeters} m)`

          // itemLink.href = '#';
          // itemLink.target = '_blank';
          itemButton.textContent = peakName;
          itemButton.addEventListener('mouseover', () => {
            // Highlight corresponding feature on the map
            // popup
            //   // @ts-ignore: Unreachable code error
            //   .setLngLat(feature.geometry.coordinates)
            //   .setText(label)
            //   .addTo(map);
            setPeakPopup(map, feature)
            
            
          });
          itemButton.addEventListener('click', () => {
            map.flyTo({// @ts-ignore: Unreachable code error
              center: feature.geometry.coordinates,
              zoom: 8
            })
            
            handlePeakSelectionChange(stringBuilder, coordinates[1], coordinates[0])
          });
          listingEl!.appendChild(itemButton);
        }

        // Show the filter input
        // @ts-ignore: Unreachable code error
        filterEl.parentNode.style.display = 'block';

      } else if (features.length === 0 && filterEl!.value !== '') {
        empty.textContent = 'No results found';
        listingEl.appendChild(empty);

      } else {
        empty.textContent = 'Drag the map to populate results';
        listingEl.appendChild(empty);

        // Hide the filter input
        // @ts-ignore: Unreachable code error
        filterEl.parentNode.style.display = 'none';

        // remove features filter
        map.setFilter('unclustered-peak', ['has', 'name']);
      }
    }
  }

  // Because features come from tiled vector data,
  // feature geometries may be split
  // or duplicated across tile boundaries.
  // As a result, features may appear
  // multiple times in query results.
  function getUniqueFeatures(features: mapboxgl.MapboxGeoJSONFeature[], nameComparatorProperty: string, elevationComparatorProperty: string) {
    const uniqueIds = new Set();
    const uniqueFeatures = [];
    for (const feature of features) {
      const name: string = feature.properties![nameComparatorProperty];
      const elevation: number = feature.properties![elevationComparatorProperty];
      const id = name + '-' + String(elevation)
      if (!uniqueIds.has(id)) {
        uniqueIds.add(id);
        uniqueFeatures.push(feature);
      }
    }
    return uniqueFeatures;
  }

  function normalize(string: string) {
    return string.trim().toLowerCase();
  }

  function setPeakPopup(map: mapboxgl.Map, feature: mapboxgl.MapboxGeoJSONFeature) {
    const label = feature.properties?.name
    if (feature.geometry.type === 'Point') {
      setPopup(popup.setLngLat(feature.geometry.coordinates as LngLatLike).setText(label).addTo(map))
    }
  }

  function toggleSideBar() {
    if (sideBarOpen) {
      (document.getElementById('sideBar') as HTMLDivElement).style.width = "0%";
      (document.getElementById('toggleButton') as HTMLDivElement).style.left = "0%";
      // (document.getElementById('map') as HTMLDivElement).style.left = "0%";
      // (document.getElementById('map') as HTMLDivElement).style.width = "100%";
      setSideBarOpen(false)
    } else {
      (document.getElementById('sideBar') as HTMLDivElement).style.width = "25%";
      (document.getElementById('toggleButton') as HTMLDivElement).style.left = "25%";
      // (document.getElementById('map') as HTMLDivElement).style.left = "25%";
      // (document.getElementById('map') as HTMLDivElement).style.width = "100%";
      setSideBarOpen(true)
    }
  }

  return (
    <div className="h-56 w-screen px-5">
      <div id="map" ref={mapContainer as React.LegacyRef<HTMLDivElement> | undefined} style={{ height: "75vh" }} className="map-container"></div>
      {/* <div id="geocoder" className="geocoder"></div> */}

      <div id="sideBar" className="map-overlay">
        <fieldset>
          <input id="feature-filter" type="text" placeholder="Filter results by name" />
        </fieldset>
        <div id="feature-listing" className="listing">
          Drag the map to populate results
        </div>
      </div>

      <div id="toggleButton" className="toggle-overlay">
        <button onClick={() => toggleSideBar()}>{sideBarOpen ? 'X' : <span> filter map &#9776;</span>}</button>
      </div>
    </div>
  );
};

export default MyMap;

