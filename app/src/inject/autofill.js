/* eslint no-unused-vars: 0 */
/* global chrome */
/* Created by Noah Scholfield */

(function() {
  const pageD = document.querySelector('.pageDescription');
  if(!pageD || !pageD.innerHTML.includes('New Case')) return;

  let settings = {assignment: undefined, options: []};

  var listeners = [
    'searchBtn.addEventListener(\'click\', searchUsername)',
    'contactName.addEventListener(\'dblclick\', fillDefaults)'
  ];

  // Load saved settings
  chrome.storage.sync.get(['location', 'options'], function(items) {
    if(!items.location) {
      alert('If you want to use TSD Autofill, you have to configure it in extension settings.');
    } else {
      settings.assignment = items.location;
      settings.options = items.options;
      applySettings(listeners);
    }
  });

  // Element variables
  const contactName = document.getElementById('cas3');
  const caseOrigin = document.getElementById('cas11');
  const serviceArea = document.getElementById('00N4100000c7Bby');
  const serviceType = document.getElementById('cas5');
  const searchBtn = document.getElementById('cas3_lkwgt');
  
  // Variables used to autofill the dropdowns in fillDefaults()
  const CASE_ORIGIN = 'Walk-In';
  const SERVICE_TYPE = 'Problem';
  const SERVICE_AREA = 'End-Point Computing';

  const change = new Event('change');

  // Function that selects commonly used dropdown values
  function fillDefaults() {
    caseOrigin.value = CASE_ORIGIN;
    caseOrigin.dispatchEvent(change);
    serviceType.value = SERVICE_TYPE;
    serviceArea.value = SERVICE_AREA;
    serviceArea.dispatchEvent(change);
    setTimeout(() => {
      const deskLocation = document.getElementById('00N4100000c7KJH');
      deskLocation.value = settings.assignment;
    }, 0);
  }

  // Function that allows for one-click username searches
  function searchUsername(e) {
    e.preventDefault();
    const urlstring = '/_ui/common/data/LookupPage?lkfm=editPage&lknm=cas3&lktp=' + document.getElementById('cas3_lktp').value + '&lksrch=' + contactName.value;
    const searchWindow = window.open(urlstring);
    const theDoc = searchWindow.document;
    const theScript = document.createElement('script');
    theScript.innerHTML = 'window.onload = function() {const frame = document.getElementById(\'searchFrame\').contentDocument;const allFields = frame.getElementById(\'lkenhmdSEARCH_ALL\');const theForm = frame.getElementById(\'theForm\');allFields.checked = true;theForm.submit();const resFrame = document.getElementById(\'resultsFrame\');resFrame.onload = function() {const resDoc = resFrame.contentDocument;const rows = resDoc.querySelector(\'.list\').rows;if (rows.length === 2) {rows[1].cells[0].firstElementChild.click();window.close();}};};';
    theDoc.body.appendChild(theScript);
    searchBtn.removeEventListener('click', searchUsername);
  }
  
  // Enables functions based upon extension settings
  function applySettings(allListeners) {
    var usedListeners = allListeners.filter((item, index) => settings.options[index]);
    usedListeners.forEach((listener) => eval(listener));
  }

})();
