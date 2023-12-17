

let conusCoords = [53.73, -119.87];
let mapZoomLevel = 4;



// Create the createMap function.
function createMap(earthquakes) {

  // Create the tile layer that will be the background of our map.
  let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });

  // Create a baseMaps object to hold the lightmap layer.
  let baseMaps = {
    "Street Map": street
  };

  // Create an overlayMaps object to hold the earthquake layer.
  let overlayMaps = {
    "Earthquakes": earthquakes
  };

  // Create the map object with options.
  let myMap = L.map("map", {
    center: conusCoords,
    zoom: mapZoomLevel,
    layers: [street,earthquakes]
  });

//   Create a layer control, and pass it baseMaps and overlayMaps. Add the layer control to the map.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
};


// Create the createMarkers function.
function createMarkers(response) {
  // Pull the "earthquake" property from response.data.
  response.then(response => {

  // Initialize an array to hold the earthquake circles.
  let earthquakeMarkers = [];

    console.log(`Last hour Earthquake: ${response.features.length}`);
  // Loop through the stations array.
    // For each earthquake, create a circle, and bind a popup with the eartquake's data.
    for (let i = 0; i < response.features.length; i++) {
    // Create a function to change the color as a function of the depth.
        function depthColor(depth) {
            if (depth<10) {colordepth="#a3f600"}
            else if (depth<30) {colordepth="#dcf400"}
            else if (depth<50) {colordepth="#f7db11"}
            else if (depth<70) {colordepth="#fdb72a"}
            else if (depth<90) {colordepth="#fca35d"}
            else {colordepth="#ff5f65"};

        return colordepth;     
        };

      var marker = L.circle([response.features[i].geometry.coordinates[1],response.features[i].geometry.coordinates[0]],{
        color: "",
        fillColor: depthColor(response.features[i].geometry.coordinates[2]),
        fillOpacity: 0.7,
        radius: response.features[i].properties.mag*10000
    }).bindPopup(`<h2>${response.features[i].properties.place}</h2>  <h2>Magnitude ${response.features[i].properties.mag.toLocaleString()}</h2>
        <h2>Depth ${response.features[i].geometry.coordinates[2].toLocaleString()} meters</h2>`)
       
        earthquakeMarkers.push(marker);
      };

  // Create a layer group that's made from the earthquake circle array, and pass it to the createMap function.
      let earthquake = L.layerGroup(earthquakeMarkers);
      createMap(earthquake); 
  });
   
};


// Perform an API call to the USGS API to get information on all earthquake that happened the past 7 days. Call createMarkers when it completes.
let url="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

let earthquakeInfo= d3.json(url);

createMarkers(earthquakeInfo);
