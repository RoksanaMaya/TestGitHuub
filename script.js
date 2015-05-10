var map, places, infoWindow;
var markers = [];
var autocomplete;
var usernameRestrict = { 'username': 'harry' };
var iconColor="";
var markerPath="http://maps.google.com/mapfiles/ms/icons/";
var hostnameRegexp = new RegExp('^https?://.+?/');
var userData = {
   'harry': {
    center: new google.maps.LatLng(23.709921,90.407143),
    zoom: 15,
	  },
  'tom': {
    center: new google.maps.LatLng(23.752805,90.375433),
    zoom: 15,
	radius: 500,
  },
  'jane': {
    center: new google.maps.LatLng(23.755790,90.387363),
    zoom: 15,
	radius:400,
	  },
  'dave': {
    center: new google.maps.LatLng(23.765138, 90.362601),
    zoom: 15,
	radius:450,
	  },
  'sarah': {
    center: new google.maps.LatLng( 23.792452, 90.416696),
    zoom: 15,
	radius:600,
	  },
  'john': {
    center: new google.maps.LatLng(23.863064, 90.400126),
    zoom: 15,
	radius:640,
	  }
};

function initialize() {
  var myOptions = {
    zoom: userData['harry'].zoom,
    center: userData['harry'].center,
  };
    map = new google.maps.Map(document.getElementById('map-canvas'), myOptions);
    infoWindow = new google.maps.InfoWindow({
        content: document.getElementById('info-content')
        });
    autocomplete = new google.maps.places.Autocomplete(
      /** @type {HTMLInputElement} */(document.getElementById('interest')),
      {
        componentRestrictions: usernameRestrict
      });
    places = new google.maps.places.PlacesService(map);
    google.maps.event.addDomListener(document.getElementById('interest'), 'change',
      setAutocompleteUsername);
}


// Set the username restriction based on user interest.
function setAutocompleteUsername() {
    var username = document.getElementById('username').value;
    autocomplete.setComponentRestrictions({ 'username': username });
    map.setCenter(userData[username].center);
    map.setZoom(userData[username].zoom);
	var interest = document.getElementById('interest').value;
   
   if (interest == 'bank'){
       searchBank();
	}
	if (interest == 'school'){
       searchSchool();
	}
    if (interest == 'hospital'){
       searchHospital();
	}
	if (interest == 'restaurant'){
       searchRestaurant();
	}
	if (interest == 'all'){
       searchAll();
	}
  
   clearResults();
   clearMarkers();
}
// [END seting username and interest]
// Search for bank in the selected username
function searchBank() {
  var search = {
    bounds: map.getBounds(),
    types: ['bank']
  };
    places.nearbySearch(search, function(results, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
        clearResults();
        clearMarkers();
        for (var i = 0; i < results.length; i++) {
		    iconColor="blue";
		    icon = markerPath + iconColor + ".png";
            markers[i] = new google.maps.Marker({
                position: results[i].geometry.location,
                animation: google.maps.Animation.DROP,
                icon: new google.maps.MarkerImage(icon)
            });
            markers[i].placeResult = results[i];
            google.maps.event.addListener(markers[i], 'click', showInfoWindow);
            setTimeout(dropMarker(i), i * 100);
        }
    }
  });
}

// Search for school in the selected username
function searchSchool() {
  var search = {
    bounds: map.getBounds(),
    types: ['school']
  };
    places.nearbySearch(search, function(results, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
        clearResults();
        clearMarkers();
        for (var i = 0; i < results.length; i++) {
		    iconColor="green";
		    icon = markerPath + iconColor + ".png";
            markers[i] = new google.maps.Marker({
                position: results[i].geometry.location,
                animation: google.maps.Animation.DROP,
                icon: new google.maps.MarkerImage(icon)
            });
            markers[i].placeResult = results[i];
            google.maps.event.addListener(markers[i], 'click', showInfoWindow);
            setTimeout(dropMarker(i), i * 100);
          }
    }
  });
}

// Search for Hospitals in the selected username
function searchHospital() {
  var search = {
    bounds: map.getBounds(),
    types: ['hospital']
  };
    places.nearbySearch(search, function(results, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
           clearResults();
           clearMarkers();
           for (var i = 0; i < results.length; i++) {
                iconColor="red";
		        icon = markerPath + iconColor + ".png";
                markers[i] = new google.maps.Marker({
                    position: results[i].geometry.location,
                    animation: google.maps.Animation.DROP,
                    icon: new google.maps.MarkerImage(icon)
                });
           markers[i].placeResult = results[i];
           google.maps.event.addListener(markers[i], 'click', showInfoWindow);
           setTimeout(dropMarker(i), i * 100);
 
           }
        }
  });
}

// Search for Restaurant in the selected username

function searchRestaurant() {
var search = {
    bounds: map.getBounds(),
    types: ['restaurant']
  };
    places.nearbySearch(search, function(results, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            clearResults();
            clearMarkers();
            for (var i = 0; i < results.length; i++) {
                iconColor="yellow";
		        icon = markerPath + iconColor + ".png";
                markers[i] = new google.maps.Marker({
                    position: results[i].geometry.location,
                    animation: google.maps.Animation.DROP,
                    icon: new google.maps.MarkerImage(icon)
                });
                markers[i].placeResult = results[i];
                google.maps.event.addListener(markers[i], 'click', showInfoWindow);
                setTimeout(dropMarker(i), i * 100);
            }
        }
  });
}


function clearMarkers() {
  for (var i = 0; i < markers.length; i++) {
    if (markers[i]) {
      markers[i].setMap(null);
    }
  }
  markers = [];
}

function dropMarker(i) {
  return function() {
    markers[i].setMap(map);
  };
}

function addResult(result, i) {
  var results = document.getElementById('results');
  var markerLetter = String.fromCharCode('A'.charCodeAt(0) + i);
  var markerIcon = MARKER_PATH + markerLetter + '.png';
  markerIcon.onclick = function() {
    google.maps.event.trigger(markers[i], 'click');
  };
 
}
function clearResults() {
  var results = document.getElementById('results');
  while (results.childNodes[0]) {
    results.removeChild(results.childNodes[0]);
  }
}

// Get the place details. Show the information in an info window,
function showInfoWindow() {
  var marker = this;
  places.getDetails({placeId: marker.placeResult.place_id},
      function(place, status) {
        if (status != google.maps.places.PlacesServiceStatus.OK) {
          return;
        }
        infoWindow.open(map, marker);
        buildIWContent(place);
      });
}

// Load the place information into the HTML elements used by the info window.
function buildIWContent(place) {
  document.getElementById('iw-icon').innerHTML = '<img class="hotelIcon" ' +
      'src="' + place.icon + '"/>';
  document.getElementById('iw-url').innerHTML = '<b><a href="' + place.url +
      '">' + place.name + '</a></b>';
  document.getElementById('iw-address').textContent = place.vicinity;

  if (place.formatted_phone_number) {
    document.getElementById('iw-phone-row').style.display = '';
    document.getElementById('iw-phone').textContent =
        place.formatted_phone_number;
  } else {
    document.getElementById('iw-phone-row').style.display = 'none';
  }

  // The regexp isolates the first part of the URL (domain plus subdomain)
  // to give a short URL for displaying in the info window.
  if (place.website) {
    var fullUrl = place.website;
    var website = hostnameRegexp.exec(place.website);
    if (website == null) {
      website = 'http://' + place.website + '/';
      fullUrl = website;
    }
    document.getElementById('iw-website-row').style.display = '';
    document.getElementById('iw-website').textContent = website;
  } else {
    document.getElementById('iw-website-row').style.display = 'none';
  }
}

