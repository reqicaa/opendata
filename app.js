var app = angular.module('plunker', []);

app.controller('MainCtrl', function($scope, $http) {
  vm = this;

  // Set the Map Options to be applied when the map is set.
  var mapOptions = {
    zoom: 4,
    scrollwheel: false,
    center: new google.maps.LatLng(40.00, -98),
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    mapTypeControl: false,
    mapTypeControlOptions: {
      mapTypeIds: [google.maps.MapTypeId.ROADMAP, google.maps.MapTypeId.TERRAIN]
    }
  }

  // Set a blank infoWindow to be used for each to state on click
  var infoWindow = new google.maps.InfoWindow({
    content: ""
  });

  // Set the map to the element ID and give it the map options to be applied
  vm.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

  // Create the state data layer and load the GeoJson Data
  var stateLayer = new google.maps.Data();
  stateLayer.loadGeoJson('states.json');

  // Set and apply styling to the stateLayer
  stateLayer.setStyle(function(feature) {
    return {
      fillColor: getColor(feature.getProperty('COLI')), // call function to get color for state based on the COLI (Cost of Living Index)
      fillOpacity: 0.8,
      strokeColor: '#b3b3b3',
      strokeWeight: 1,
      zIndex: 1
    };
  });

  // Add mouseover and mouse out styling for the GeoJSON State data
  stateLayer.addListener('mouseover', function(e) {
    stateLayer.overrideStyle(e.feature, {
      strokeColor: '#2a2a2a',
      strokeWeight: 2,
      zIndex: 2
    });
  });

  stateLayer.addListener('mouseout', function(e) {
    stateLayer.revertStyle();
  });

  // Adds an info window on click with in a state that includes the state name and COLI
  stateLayer.addListener('click', function(e) {
    console.log(e);
    infoWindow.setContent('<div style="line-height:1.00;overflow:hidden;white-space:nowrap;"> Name : <b>' +
      e.feature.getProperty('NAME') + '</b> <br> State Nr : <b>' +
      e.feature.getProperty('STATE') + '</b> <br> POPULATION : <b>' +
      e.feature.getProperty('POPULATION') + '</b> <br> IMG : <img src="image/' +
      e.feature.getProperty('NAME').toLowerCase() + '.png" width="50" height="50"></b> <br> Coli : <b>' +
      e.feature.getProperty('COLI').toFixed(4) + '</b></div>');

    var anchor = new google.maps.MVCObject();
    anchor.set("position", e.latLng);
    infoWindow.open(vm.map, anchor);
  });


  // Final step here sets the stateLayer GeoJSON data onto the map
  stateLayer.setMap(vm.map);


  // returns a color based on the value given when the function is called
  function getColor(coli) {
    var colors = [
      '#d1ccad',
      '#c2c083',
      '#cbd97c',
      '#acd033',
      '#89a844'
    ];

    return coli >= 121 ? colors[4] :
      coli > 110 ? colors[3] :
      coli > 102.5 ? colors[2] :
      coli > 100 ? colors[1] :
      colors[0];
  }

});