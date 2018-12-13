//  Redirect buttons

function redirectToProfile () {
  window.location.href = 'profile.html';
}

function redirectToHome () {
  window.location.href = 'index.html';
}

function redirectToSignin () {
  window.location.href = 'sign_in.html';
}

function redirectToSignup () {
  window.location.href = 'sign_up.html';
}

function redirectToRedFlagForm () {
  window.location.href = 'red-flag_record.html';
}

function redirectToInterventionForm () {
  window.location.href = 'intervention_record.html';
}

function redirectToRecords () {
  window.location.href = 'record.html';
}

function redirectToDraftRecords () {
  window.location.href = 'draft_records.html';
}

//  Submission of forms

function redFlagSubmission () {
  document.getElementsByClassName('container_form container_form_red-flag container_form_red-flag--redflagform')[0].innerHTML = 'Your record is successfully submitted, you will now be automatically redirected to view the record.';
  setTimeout(function () {
    window.location.href = 'single_draft_record.html'
  }, 2000);
}
//maps

var map;

function initMap () {
  map = new google.maps.Map(document.getElementsByClassName('map')[0], {
    center: {
      lat: 6.553844,
      lng: 3.366475
    },
    zoom: 15
  });
}

function andelaloc () {
  var andelabuilding = { lat: 6.553844, lng: 3.366475 };
  map = new google.maps.Map(document.getElementsByClassName('map')[0], {
    center: {
      lat: 6.553844,
      lng: 3.366475
    },
    zoom: 15
  });
  var marker = new google.maps.Marker({position: andelabuilding, map: map});
}

function initAutocomplete () {
  var options = {
  componentRestrictions: {country: 'ng'}
};
  var input = document.getElementsByClassName('container_formfield--location')[0];
  var autocomplete = new google.maps.places.Autocomplete(input, options);
}


// GPS autolocation. Courtesy: https://www.w3schools.com/html/tryit.asp?filename=tryhtml5_geolocation

var x = document.getElementsByClassName('container_formfield--location')[0];

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        x.innerHTML = 'Geolocation is not supported by this browser, please type location';
    }
}

function showPosition(position) {
    x.innerHTML = 'Latitude: ' + position.coords.latitude +
    '<br>Longitude: ' + position.coords.longitude;
}
