
// Center the map and the zoom to view CONUS + Alaska + Hawaii
let conusCoords = [53.73, -119.87];
let mapZoomLevel = 4;



// Create the createMap function.
function createMap(earthquakes, earthPlates) {

  // Create the tile layers that will be the background of our map.
  let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });

  let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });

  let googleSat = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',{
        maxZoom: 20,
        subdomains:['mt0','mt1','mt2','mt3']
  });


  // Create a baseMaps object to hold the map layers.
  let baseMaps = {
    "Street Map": street,
    "Topo": topo,
    "Satellite Map": googleSat
  };

  // Create an overlayMaps object to hold the earthquake layer and the tectonic boundaries layer.
  let overlayMaps = {
    "Earthquakes": earthquakes,
    "Tectonic boundaries": earthPlates
  };

  // Create the map object with options preselected for Part2.
  let myMap = L.map("map", {
    center: conusCoords,
    zoom: mapZoomLevel,
    layers: [googleSat, earthquakes,earthPlates]
  });


  // Add the legend. The styling is done in the style.css file
  var legend = L.control({ position: "bottomright" });

  legend.onAdd = function (map) {
    var div = L.DomUtil.create("div", "legend");
    div.innerHTML += "<h4>Depth (km)</h4>";
    div.innerHTML += '<i style="background: #a3f600"></i><span>\<10</span><br>';
    div.innerHTML += '<i style="background: #dcf400"></i><span>10-30</span><br>';
    div.innerHTML += '<i style="background: #f7db11"></i><span>30-50</span><br>';
    div.innerHTML += '<i style="background: #fdb72a"></i><span>50-70</span><br>';
    div.innerHTML += '<i style="background: #fca35d"></i><span>70-90</span><br>';
    div.innerHTML += '<i style="background: #ff5f65"></i><span>>90</span><br>';
    return div;
  };

  legend.addTo(myMap);


  //   Create a layer control, and pass it baseMaps and overlayMaps. Add the layer control to the map.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
};   // end of the createMap function



// Create the createMarkers function.
function createMarkers(response, response2) {
  // Pull the "earthquake" property from response.data.
  response.then(response => {

    // Initialize an array to hold the earthquake circles.
    let earthquakeMarkers = [];

    console.log(`Last 7-day Earthquake: ${response.features.length}`);
    // Loop through the stations array.
    // For each earthquake, create a circle, and bind a popup with the eartquake's data.
    for (let i = 0; i < response.features.length; i++) {
      // Create a function to change the color as a function of the depth.
      function depthColor(depth) {
        if (depth < 10) { colordepth = "#a3f600" }
        else if (depth < 30) { colordepth = "#dcf400" }
        else if (depth < 50) { colordepth = "#f7db11" }
        else if (depth < 70) { colordepth = "#fdb72a" }
        else if (depth < 90) { colordepth = "#fca35d" }
        else { colordepth = "#ff5f65" };

        return colordepth;
      };
      // console.log(new Date(response.features[i].properties.time).toUTCString());
      var marker = L.circle([response.features[i].geometry.coordinates[1], response.features[i].geometry.coordinates[0]], {
        color: "",
        fillColor: depthColor(response.features[i].geometry.coordinates[2]),
        fillOpacity: 0.7,
        radius: response.features[i].properties.mag * 10000
      }).bindPopup(
        `<h2>${response.features[i].properties.place}</h2>  <h2>Magnitude ${response.features[i].properties.mag.toLocaleString()}</h2>
        <h2>Depth ${response.features[i].geometry.coordinates[2].toLocaleString()} km</h2>
        <h4>Time: ${new Date(response.features[i].properties.time).toUTCString()} </h4>
        `)

      earthquakeMarkers.push(marker);
    };


    // Add tectonic polygones
    response2.then(response2 => {
      var tectonicPlates = [];

      console.log(`number of lines: ${response2.features.length}`);

      for (let i = 0; i < response2.features.length; i++) {

        // need to reverse the lon and lat 
        var lineTrace = [];
        for (let j = 0; j < response2.features[i].geometry.coordinates.length; j++) {
          lineTrace.push([response2.features[i].geometry.coordinates[j][1], response2.features[i].geometry.coordinates[j][0]])
        };

        var linePlate = L.polyline(lineTrace, { color: "orange" });
        tectonicPlates.push(linePlate);
        var earthPlates = L.layerGroup(tectonicPlates);
      };
    
      // Create a layer group that is made from the earthquake circle array, and pass it to the createMap function.
    let earthquake = L.layerGroup(earthquakeMarkers);
    createMap(earthquake, earthPlates);

    }); // end of the response2 promise

  }); // end of the response promise

}; // end of the function createMarkers


// Perform an API call to the USGS API to get information on all earthquake that happened the past 7 days. Call createMarkers when it completes.
let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// let url2="https://github.com/fraxen/tectonicplates/blob/master/GeoJSON/PB2002_boundaries.json"

let earthquakeInfo = d3.json(url);
let tectonicInfo = d3.json('PB2002_boundaries.json');   // The file has been saved as a resource to avoid a CORS error when trying to read the URL directly.

createMarkers(earthquakeInfo, tectonicInfo);
