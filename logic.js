// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

//Magnitude color switch
  function magColor(mag) {
    switch (true){
      case mag > 5:
        return "#ff0000";
      case mag > 4:
        return "#ff9900";
      case mag > 3:
        return "#ffff00";
      case mag > 2:
        return "#ccff33"
      case mag > 1:
        return "#ccff66";
      default:
        return "#ccff99"
    }
  } 
//create function to make markers
function geojsonMarkerOptions(feature){

  return{
    radius: 4 * parseFloat(feature.properties.mag), //corect
    fillColor:magColor(feature.properties.mag), 
    color: "#000000",  //correct
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
  };
  }
	

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {



  // Define a function we want to run once for each feature in the features array-The info from the file
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    


    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>")
     
  }

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,

        pointToLayer: function (feature, latlng) {
          return L.circleMarker(latlng, geojsonMarkerOptions(feature)
       
          
          );
        }

    // }
  });

  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}

function createMap(earthquakes) {

  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  });


  var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [streetmap, earthquakes]
  });
  // addLegend("bottomleft", pal=colorscale, values=~mag, opacity=1, title="Magnitude") 
  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  //create legend
  var legend  = L.control({
    position: "bottomright"
  })


  //add details to legend
  legend.onAdd = function(){
    var div = L.DomUtil.create("div", "info legend");
    var grades = [0, 1, 2, 3, 4, 5];
    var lcolors = [
    "#98ee00",
    "#d4ee00",
    "#eecc00",
    "#ee9c00",
    "ea822cc",
    "ea2c2c"
  ];

  //   for (var i = 0; i < grades.length; i++) {
  //     div.innerHTML +=
  //       "<i style='background: " +  lcolors[i+1]  "'></i> " + 
  //       grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+")
  //   }
  //   return div;
  // };
  // Add the layer control to the map

  for (var i = 0; i < grades.length; i++) {
    div.innerHTML += '<i style="background: ' + lcolors[i] + ' "></i>' + grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }
    return div;
    };


legend.addTo(myMap);




  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
}
