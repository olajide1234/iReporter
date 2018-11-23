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

//  Submission of forms
function interventionSubmission () {
  document.getElementsByClassName('container_form container_form_red-flag container_form_red-flag--interventionform')[0].innerHTML = 'Your intervention record is successfully submitted, you will now be automatically redirected to your profile page.';
  setTimeout(function () {
    window.location.href = 'profile.html'
  }, 5000);
}

function redFlagSubmission () {
  document.getElementsByClassName('container_form container_form_red-flag container_form_red-flag--redflagform')[0].innerHTML = 'Your red-flag record is successfully submitted, you will now be automatically redirected to your profile page.';
  setTimeout(function () {
    window.location.href = 'profile.html'
  }, 5000);
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

function initAutocomplete () {
  var input = document.getElementsByClassName('container_formfield--location')[0];
  var autocomplete = new google.maps.places.Autocomplete(input);
}
