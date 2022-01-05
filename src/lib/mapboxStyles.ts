import mapboxgl from "mapbox-gl";

const CONIFER = "#276338";

const waypointPinStyle: mapboxgl.AnyLayer = {
  id: "waypoint-pin-layer",
  type: "symbol",
  source: "source",
  filter: [
    "all",
    ["!=", ["get", "attr"], "route"],
    ["!=", ["coalesce", ["get", "archived"], ["get", "deleted"], false], null],
    ["==", ["geometry-type"], "Point"],
  ],
  paint: {
    "text-color": "#000",
    "text-halo-color": "#fff",
    "text-halo-width": 1,
    "icon-opacity": 1,
    "text-opacity": 1,
  },
  layout: {
    "icon-ignore-placement": true,
    "icon-allow-overlap": true,
    "icon-anchor": "bottom",
    "icon-size": 1,
    "text-field": ["get", "name"],
    "text-ignore-placement": false,
    "text-allow-overlap": false,
    "text-size": 10,
    "text-anchor": "top",
    "text-optional": true,
    "text-font": ["Regular"],
  },
};

const embeddedMapStyles: mapboxgl.AnyLayer[] = [
  {
    id: "casing",
    type: "line",
    source: "source",
    minzoom: 0,
    maxzoom: 24,
    filter: [
      "has",
      ["geometry-type"],
      [
        "literal",
        {
          LineString: true,
          MultiLineString: true,
        },
      ],
    ],
    layout: {
      visibility: "visible",
      "line-cap": "round",
    },
    paint: {
      "line-width": {
        stops: [
          [11, 2],
          [12, 6],
          [13, 6],
          [14, 8],
          [16, 8],
        ],
      },
      "line-opacity": 1,
      "line-color": "rgba(0, 0, 0, 1)",
      "line-offset": 0,
      "line-blur": 0,
    },
  },
  {
    id: "highlight",
    type: "line",
    source: "source",
    minzoom: 0,
    maxzoom: 24,
    filter: [
      "has",
      ["geometry-type"],
      [
        "literal",
        {
          LineString: true,
          MultiLineString: true,
        },
      ],
    ],
    layout: {
      visibility: "visible",
      "line-cap": "round",
      "line-join": "round",
    },
    paint: {
      "line-width": {
        stops: [
          [11, 2],
          [12, 3],
          [13, 3],
          [14, 3],
          [16, 3],
        ],
      },
      "line-opacity": 1,
      "line-color": "rgba(168, 255, 63, 1)",
    },
  },
  waypointPinStyle,
];

export default embeddedMapStyles;
