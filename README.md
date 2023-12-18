# leaflet-challenge
## Module 15

## Introduction.
In this project, we use an API to retrieve from the [USGS website](https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php) the data for earthquakes measured in the past 7 days. The GeoJSON file is updated every minute.<br>
Each earthquake measured is overlaid on a map based on its latitude and longitude. The radius of the circle is a function of its magnitude, and its color changes with the depth of the epicenter, as indicated by the legend.<br>
When clicking on a circle, a pop-up window gives extra information, such as a description of the location, the magnitude of the earthquake, the depth of its epicenter, and the UTC date and time of the detection.<br>
The visualization of the results can be seen [here](https://xoffvsg.github.io/leaflet-challenge/).<br><br>
## Part 1
The same javascript file [static/js/logic.js]() meets the requirements of __Part 1__ and __Part 2__. The default settings will correspond to Part 2. The view corresponding to Part 1 is obtained by selecting _Street Map_ on the base layer and deselecting _Tectonic boundaries_ in the control box. <br>
The styling of the legend box in the bottom right corner is obtained by adding instructions in the [/static/CSS/style.css]() file.

## Part 2
In Part 2, we have added the visualization of the tectonic plate boundaries. The information was obtained from a [github repository](https://github.com/fraxen/tectonicplates/blob/master/GeoJSON/PB2002_boundaries.json), but the URL could not be read directly by the javascript file because of a Cross-Origin Resource Sharing (CORS) error message. Since this information is static, we saved the information as a json file [PB2002_boundaries.json]() in the same folder as the index.html file, and read the data points from it.
