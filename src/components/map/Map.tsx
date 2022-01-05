import React, { useRef, useEffect, useState } from "react";
import mapboxgl, { LngLatLike } from "mapbox-gl";
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import { PeakInterface } from "../../interface/PeakInterface";
import { usePeak } from "../../context/Peak";
import featureCollection from "../../lib/north-america-peaks";
import embeddedMapStyles from "../../lib/mapboxStyles";
import fetchImg from "../../lib/fetchImage";

mapboxgl.accessToken = `${process.env.REACT_APP_MAP_TOKEN}`;

interface props {
  peakList: PeakInterface[]
}

const MyMap = ({ peakList }: props) => {

  // CONSTANTS (for now)
  const LNG = -96
  const LAT = 37.8
  const ZOOM = 3

  // MAP SEARCH OVERLAY
  const [peakSearchList, setPeakSearchList] = useState<mapboxgl.MapboxGeoJSONFeature[]>([])
  const [sideBarOpen, setSideBarOpen] = useState<boolean>(false)

  let peak_search_list: mapboxgl.MapboxGeoJSONFeature[] = [];
  const filterEl = (document.getElementById('feature-filter') as HTMLInputElement);
  const listingEl = document.getElementById('feature-listing') as HTMLInputElement;

  const { setCurrentPeak } = usePeak();

  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map>();
  const [mapMarkers, setMapMarkers] = useState<mapboxgl.Marker[]>()

  // const geocoder = new MapboxGeocoder({
  //   accessToken: mapboxgl.accessToken,
  //   marker: false, types: 'poi',
  //   // @ts-ignore: Unreachable code error
  //   mapboxgl: mapboxgl
  // })

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
      style: "mapbox://styles/mapbox/dark-v10",
      center: [LNG, LAT],
      zoom: ZOOM
    })

    map.on('load', async () => {
      // assigning custom point image to map
      const img = await fetchImg("/images/mountain.png");
      map.addImage("mt-peak", img, { pixelRatio: 2 });

      // adding the geojson data to the map and configuring the clustering
      map.addSource('source',
        {
          type: "geojson",
          data: featureCollection,
          cluster: true,
          clusterMaxZoom: 14, // Max zoom to cluster points on
          clusterRadius: 30 // Radius of each cluster when clustering points (defaults to 50)
        })

      // cluster layer
      map.addLayer({
        id: 'peak-clusters',
        type: 'circle',
        source: 'source',
        filter: ['has', 'point_count'], // cluster auto adds this to our data
        paint: {
          'circle-color': '#51bbd6',
          'circle-radius': [
            'step',
            ['get', 'point_count'],
            20,
            100,
            30,
            750,
            40
          ]
        }
      })

      // layer for adding the number on the cluster point
      map.addLayer({
        id: 'peak-cluster-count',
        type: 'symbol',
        source: 'source',
        filter: ['has', 'point_count'],
        layout: {
          'text-field': '{point_count_abbreviated}',
          'text-size': 12
        }
      })

      // the unclustered peak point, shows as our custom image with text
      map.addLayer({
        id: 'unclustered-peak',
        source: 'source',
        type: 'symbol',
        filter: ['!', ['has', 'point_count']],
        paint: {
          "text-color": "#FFF",
          "text-halo-color": "#000",
          "text-halo-width": 1,
          "icon-opacity": 1,
          "text-opacity": 1,
        },
        layout: {
          "icon-ignore-placement": true,
          "icon-allow-overlap": true,
          "icon-anchor": "bottom",
          "icon-size": .2,
          "text-field": ["get", "name"],
          "text-ignore-placement": false,
          "text-allow-overlap": false,
          "text-size": 20,
          "text-anchor": "top",
          "text-optional": true,
          "icon-image": "mt-peak",

          // "text-font": ["Regular"],
        }
      })

      map.on('click', 'peak-clusters', (e) => {
        const features = map.queryRenderedFeatures(e.point, {
          layers: ['peak-clusters']
        });
        const clusterId = features[0]?.properties?.cluster_id;

        // @ts-ignore: Unreachable code error
        map.getSource('source').getClusterExpansionZoom(
          clusterId,
          // @ts-ignore: Unreachable code error
          (err, zoom) => {
            if (err) return;

            map.easeTo({
              // @ts-ignore: Unreachable code error
              center: features[0].geometry.coordinates,
              zoom: zoom
            })
          }
        )
      })

      // When a click event occurs on a feature in
      // the unclustered-point layer, open a popup at
      // the location of the feature, with
      // description HTML from its properties.
      map.on('click', 'unclustered-peak', (e) => {
        if (e.features !== undefined && e.features[0].geometry.type === 'Point') {
          const coordinates = e.features[0].geometry.coordinates.slice()
          const name = e.features[0].properties?.name
          const feet = e.features[0].properties?.feet
          const meters = e.features[0].properties?.meters
          // const countries = e.features[0].properties?.countries[0]

          // Ensure that if the map is zoomed out such that
          // multiple copies of the feature are visible, the
          // popup appears over the copy being pointed to.
          while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
          }

          new mapboxgl.Popup({ offset: popupOffsets })
            .setLngLat(coordinates as LngLatLike)
            .setHTML(
              `<div><h1 className="text-white" style="font-size: 20px; font-weight: 400; margin-bottom: 10px; text-transform: capitalize;">${name}</h1> <h1>${feet} ft.</h1> <h1>${meters} m</h1> </div>`
            )
            .addTo(map);


        }
      })

      map.on('movestart', () => {
        map.setFilter('unclustered-peak', ['has', 'name'])
      })

      map.on('moveend', () => {
        const features = map.queryRenderedFeatures(undefined, { layers: ['unclustered-peak'] });

        if (features) {

          const uniqueFeatures = getUniqueFeatures(features, 'name')

          renderlistings(uniqueFeatures, map)

          // Clear the input container
          if (filterEl) {
            filterEl.value = '';
          }

          peak_search_list = uniqueFeatures
          // setPeakSearchList(features)
        }
      })

      filterEl?.addEventListener('keyup', (e: any) => {
        console.log(peakSearchList)
        const value = normalize(e.target.value);

        // Filter visible features that match the input value.
        const filtered: mapboxgl.MapboxGeoJSONFeature[] = [];

        // for (const feature of peakSearchList) {

        //   const name = normalize(feature.properties?.name);
        //   console.log(name)
        //   if (name.includes(value)) {
        //     filtered.push(feature);
        //   }
        // }

        peak_search_list.map((feature) => {
          const name = normalize(feature.properties?.name);
          console.log(name)
          if (name.includes(value)) {
            filtered.push(feature);
          }
        })

        // Populate the sidebar with filtered results
        renderlistings(filtered, map);

        // Set the filter to populate features into the layer.
        if (filtered.length) {
          map.setFilter('unclustered-peak', [
            'match',
            ['get', 'name'],
            filtered.map((feature) => {
              return feature.properties?.name;
            }),
            true,
            false
          ]);
        }
      })

      mapMarkers?.map((marker) => {
        marker.addTo(map)
      })
    })


    // document.getElementById('geocoder')?.replaceChildren(geocoder.onAdd(map))

    // geocoder.on('result', (event) => {
    //   const point = event.result.geometry.coordinates
    //   newPeakMarker.setLngLat(point).addTo(map).setPopup(popup).setDraggable(true)
    //   setPeak(newPeakMarker)
    //   setPopup(newPeakMarker, map)
    //   newPeakMarker.on('dragend', () => onDragEnd(newPeakMarker, map))
    // })

    map.on('dblclick', (event) => {
      console.log(event.lngLat)
      const point = event.lngLat
      newPeakMarker.setLngLat(point).addTo(map).setPopup(popup).setDraggable(true)
      setPeak(newPeakMarker)
      setPopup(newPeakMarker, map)
      newPeakMarker.on('dragend', () => onDragEnd(newPeakMarker, map))
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
    popup.setLngLat(marker.getLngLat()).setDOMContent(popupDiv).setMaxWidth("500px")
    popup.addTo(map)
  }

  function loadPeakMarkers() {

    const markers: mapboxgl.Marker[] = []
    peakList.map((peak: PeakInterface, idx) => {
      if (peak.longitude && peak.latitude) {

        // create marker location
        const lngLat: LngLatLike = [peak.longitude, peak.latitude]

        // create marker popup
        const popupDiv = window.document.createElement('div') // div creation for popup
        const popup = new mapboxgl.Popup({ offset: popupOffsets }) // popup object
        popupDiv.innerHTML = `<div  id='peak-${idx}'><h1 className="text-white" style="font-size: 20px; font-weight: 400; margin-bottom: 10px; text-transform: capitalize;">${peak.peak_name}</h1> <h1>${peak.peak_description ? peak.peak_description : ''}</h1> </div>`

        popup.setLngLat(lngLat).setDOMContent(popupDiv).setMaxWidth("300px")

        const newMarker = new mapboxgl.Marker()
          .setLngLat(lngLat).setPopup(popup)

        newMarker.on('click', () => {
          console.log('double clicked')
        })
        // add markers to marker list
        markers.push(newMarker)


      }
    })
    return markers
  }

  function renderlistings(features: mapboxgl.MapboxGeoJSONFeature[], map: mapboxgl.Map) {
    const empty = document.createElement('p');
    // Clear any existing listings
    if (listingEl) {
      listingEl.innerHTML = '';
      if (features.length) {
        for (const feature of features) {

          const itemLink = document.createElement('a');
          const label = `${feature.properties?.name}`;
          itemLink.href = '#';
          itemLink.target = '_blank';
          itemLink.textContent = label;
          itemLink.addEventListener('mouseover', () => {
            // Highlight corresponding feature on the map
            popup
              // @ts-ignore: Unreachable code error
              .setLngLat(feature.geometry.coordinates)
              .setText(label)
              .addTo(map);

          });
          listingEl!.appendChild(itemLink);
        }

        // Show the filter input
        // @ts-ignore: Unreachable code error
        filterEl.parentNode.style.display = 'block';
        // @ts-ignore: Unreachable code error
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
  function getUniqueFeatures(features: mapboxgl.MapboxGeoJSONFeature[], comparatorProperty: string) {
    const uniqueIds = new Set();
    const uniqueFeatures = [];
    for (const feature of features) {
      const id = feature.properties![comparatorProperty];
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

  function toggleSideBar() {
    if (sideBarOpen) {
      (document.getElementById('sideBar') as HTMLDivElement).style.width = "0%";
      (document.getElementById('toggleButton') as HTMLDivElement).style.left = "0%";
      (document.getElementById('map') as HTMLDivElement).style.left = "0%";
      (document.getElementById('map') as HTMLDivElement).style.width = "100%";
      setSideBarOpen(false)
    } else {
      (document.getElementById('sideBar') as HTMLDivElement).style.width = "25%";
      (document.getElementById('toggleButton') as HTMLDivElement).style.left = "25%";
      (document.getElementById('map') as HTMLDivElement).style.left = "25%";
      (document.getElementById('map') as HTMLDivElement).style.width = "75%";
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
        <button onClick={() => toggleSideBar()}>{sideBarOpen ? 'X' : <span>&#9776;</span>}</button>
      </div>
    </div>
  );
};

export default MyMap;

