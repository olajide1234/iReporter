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
