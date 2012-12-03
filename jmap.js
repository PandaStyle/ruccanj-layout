var map = [];
var latLng = [];
var marker = [];
var geocoder = new google.maps.Geocoder();
var noaddress = "[ismeretlen cím]"

function geocodePosition(pos) {
  geocoder.geocode({
    latLng: pos
  }, function(responses) {
    if (responses && responses.length > 0) {
      updateMarkerAddress(responses[0].formatted_address);
    } else {
      updateMarkerAddress(noaddress);
    }
  });
}

function updateMarkerPosition(latLng) {
  document.getElementById('form-latLng').value = [
  	latLng.lat(),
	latLng.lng()
	].join(', ');
}

function updateMarkerAddress(str) {
  document.getElementById('form-where').value = str;
}

function setMyMapCenter(which, LL)
{
	marker[which].setPosition(LL);
    map[which].setCenter(LL);
    updateMarkerPosition(LL)
}

function initializeMap(which, draggable) {
  latLng[which] = new google.maps.LatLng(47.4984056, 19.040757799999938);
  map[which] = new google.maps.Map(document.getElementById('mapdiv'), {
    zoom: 15,
    streetViewControl: false,
    panControl: true,
    mapTypeControl: true,
    mapTypeControlOptions: {style: google.maps.MapTypeControlStyle.DROPDOWN_MENU},
    zoomControl: true,
    zoomControlOptions: {style: google.maps.ZoomControlStyle.LARGE},
    mapTypeId: google.maps.MapTypeId.ROADMAP
  });
  marker[which] = new google.maps.Marker({
    title: draggable ? 'Dobd ezt a tüskét a címhez' : 'Itt', 
    map: map[which],
    draggable: draggable
    //icon: 'assets/img/marker_sprite.png'
  });

  google.maps.event.addListener(marker[which], 'dragstart', function() {
    updateMarkerAddress("");
  });
  
  google.maps.event.addListener(marker[which], 'drag', function() {
    updateMarkerPosition(marker[which].getPosition());
    document.getElementById('formMapmsg').innerHTML = "Jól csinálod!";
  });
  google.maps.event.addListener(marker[which], 'dragend', function() {
    geocodePosition(marker[which].getPosition());
    document.getElementById('formMapmsg').innerHTML = "<b>Ügyes!</b>";
  });
}

function codeAddress(which, forced) {
	var address = document.getElementById('form-where').value;
	var latLngM = document.getElementById('form-latLng').value;
	var locationfound = latLng[which];

	if (latLngM.length > 0 && latLngM.indexOf(", ") > -1 && !forced) {
		locationfound = new google.maps.LatLng(latLngM.split(", ")[0], latLngM.split(", ")[1]);
		setMyMapCenter(which, locationfound);
	}
	else {
		if (address.length > 0) {
		    geocoder.geocode({ 'address': address}, function(results, status) {
		      if (status == google.maps.GeocoderStatus.OK) {
		      	locationfound = results[0].geometry.location;
		    	setMyMapCenter(which, locationfound);
		      } 
		      else {
		        //alert("Hiba, status: " + status);
		    	setMyMapCenter(which, locationfound);
		      }
		    });
	    }
	    else {
	    	setMyMapCenter(which, locationfound);
	    }
	}
}

function openMap(which, draggable)
{
    initializeMap(which, draggable);
    codeAddress(which, false);
};