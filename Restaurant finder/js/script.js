var map, places, infoWindow;
var markers = [];
var autocomplete;
var countryRestrict = {'country': 'in'};
var MARKER_PATH = 'https://maps.gstatic.com/intl/en_us/mapfiles/marker_green';
var hostnameRegexp = new RegExp('^https?://.+?/');

var countries = {
  'in': {
    center: {lat: 20.6, lng: 78.9},
    zoom: 5
  }
};

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: countries['in'].zoom,
    center: countries['in'].center,
    mapTypeControl: false,
    panControl: false,
    zoomControl: true,
    streetViewControl: false
  });

  infoWindow = new google.maps.InfoWindow({
    content: document.getElementById('info-content')
  });
  
  autocomplete = new google.maps.places.Autocomplete(
      (
          document.getElementById('autocomplete')), {
        types: ['(regions)'],
        componentRestrictions: countryRestrict
      });
  places = new google.maps.places.PlacesService(map);

  autocomplete.addListener('place_changed', onPlaceChanged);

  document.getElementById('country').addEventListener(
      'change', resetPlace);
}

function onPlaceChanged() {
  var place = autocomplete.getPlace();
  if (place.geometry) {
    map.panTo(place.geometry.location);
    map.setZoom(15);
    search();
  } else {
    document.getElementById('autocomplete').placeholder = 'Enter location';
  }
}

function search() {
  var search = {
    bounds: map.getBounds(),
    types: ['restaurant']
  };

  places.nearbySearch(search, function(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      clearResults();
      clearMarkers();
      for (var i = 0; i < results.length; i++) {
        var markerLetter = String.fromCharCode('A'.charCodeAt(0) + i);
        var markerIcon = MARKER_PATH + markerLetter + '.png';
        markers[i] = new google.maps.Marker({
          position: results[i].geometry.location,
          icon: markerIcon
        });
        markers[i].placeResult = results[i];
        google.maps.event.addListener(markers[i], 'click', showInfoWindow);
		google.maps.event.addListener(markers[i], 'click', showTable);
        setTimeout(dropMarker(i), i * 10);
        addResult(results[i], i);
      }
    }
  });
document.getElementById('msg').style.display = 'block';
}

function showTable(){
document.getElementById('mainTable').style.display = 'inline-block';
}

function clearMarkers() {
  for (var i = 0; i < markers.length; i++) {
    if (markers[i]) {
      markers[i].setMap(null);
    }
  }
  markers = [];
}

function resetPlace() {
  clearResults();
  clearMarkers();
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

  var tr = document.createElement('tr');
  tr.style.backgroundColor = (i % 2 === 0 ? '#00bfff' : '#ffffff');
  tr.onclick = function() {
    google.maps.event.trigger(markers[i], 'click');
  };

  var iconTd = document.createElement('td');
  var nameTd = document.createElement('td');
  var icon = document.createElement('img');
  icon.src = markerIcon;
  icon.setAttribute('class', 'placeIcon');
  icon.setAttribute('className', 'placeIcon');
  var name = document.createTextNode(result.name);
  iconTd.appendChild(icon);
  nameTd.appendChild(name);
  tr.appendChild(iconTd);
  tr.appendChild(nameTd);
  results.appendChild(tr);
}


function clearResults() {
  var results = document.getElementById('results');
  while (results.childNodes[0]) {
    results.removeChild(results.childNodes[0]);
  }
}

function showInfoWindow() {
  var marker = this;
  places.getDetails({placeId: marker.placeResult.place_id},
      function(place, status) {
        if (status !== google.maps.places.PlacesServiceStatus.OK) {
          return;
        }
        infoWindow.open(map, marker);
        buildIWContent(place);
      });
}

function buildIWContent(place) {
  document.getElementById('iw-icon').innerHTML = '<img class="hotelIcon" ' +
      'src="' + place.icon + '"/>';
  document.getElementById('iw-url').innerHTML = '<b><a href="' + place.url +
      '">' + place.name + '</a></b>';
  document.getElementById('name').innerHTML = '<b><a href="' + place.url +
      '">' + place.name + '</a></b>';
  document.getElementById('iw-address').textContent = place.vicinity;
  document.getElementById('address').textContent = place.vicinity;

  if (place.formatted_phone_number) {
    document.getElementById('iw-phone-row').style.display = '';
	document.getElementById('rPhone').style.display = '';
    document.getElementById('iw-phone').textContent =
        place.formatted_phone_number;
	document.getElementById('phone').textContent =
        place.formatted_phone_number;
  } else {
    document.getElementById('iw-phone-row').style.display = 'none';
	document.getElementById('rPhone').style.display = 'none';
  }

  if (place.rating) {
    var ratingHtml = '';
    for (var i = 0; i < 5; i++) {
      if (place.rating < (i + 0.5)) {
        ratingHtml += '&#10025;';
      } else {
        ratingHtml += '&#10026;';
      }
    document.getElementById('iw-rating-row').style.display = '';
	document.getElementById('rRating').style.display = '';
    document.getElementById('iw-rating').innerHTML = ratingHtml;
	document.getElementById('rating').innerHTML = ratingHtml;
    }
  } else {
    document.getElementById('iw-rating-row').style.display = 'none';
	document.getElementById('rRating').style.display = 'none';
  }

  if (place.website) {
    var fullUrl = place.website;
    var website = hostnameRegexp.exec(place.website);
    if (website === null) {
      website = 'http://' + place.website + '/';
      fullUrl = website;
    }
    document.getElementById('iw-website-row').style.display = '';
	document.getElementById('rWebsite').style.display = '';
    document.getElementById('iw-website').textContent = website;
	document.getElementById('website').textContent = website;
  } else {
    document.getElementById('iw-website-row').style.display = 'none';
	document.getElementById('rWebsite').style.display = 'none';
  }
}