function toggleDropdown(dropdownId) {
  var dropdownContent = document.getElementById(dropdownId);
  var dropdown = dropdownContent.closest('.dropdown1, .dropdown2'); // Updated to match new class names

  if (dropdown.classList.contains('active')) {
    dropdown.classList.remove('active');
  } else {
    var activeDropdown = document.querySelector('.dropdown1.active, .dropdown2.active'); // Updated to match new class names
    if (activeDropdown) {
      activeDropdown.classList.remove('active');
    }
    dropdown.classList.add('active');
  }
}

// Function to calculate distance between two sets of coordinates using Haversine formula
function calculateDistance(coord1, coord2) {
  const R = 3958.8; // Earth's radius in miles
  const lat1 = parseFloat(coord1.latitude);
  const lon1 = parseFloat(coord1.longitude);
  const lat2 = parseFloat(coord2.latitude);
  const lon2 = parseFloat(coord2.longitude);

  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; 
  return distance; // Distance in miles
}

// Function to validate ZIP code
function validateZipCode(zipCode) {
  return /^\d{5}$/.test(zipCode) && (zipCode >= '00501' && zipCode <= '99950');
}

// Function to handle form submission
document.getElementById('userInfoForm').addEventListener('submit', async function(event) {
  event.preventDefault();

  // Clear existing results before updating
  clearExistingResults();


  const age = parseInt(document.getElementById('ageInput').value);
  const cataractDiagnosis = document.querySelector('input[name="cataractDiagnosis"]:checked').value;
  const insuranceType = document.getElementById('insuranceType').value;
  const usCitizen = document.querySelector('input[name="usCitizen"]:checked').value;
  const zipCode = document.getElementById('zipCodeInput').value;

 // Retrieving user input values
  const ageError = document.getElementById('ageError');
  const zipCodeError = document.getElementById('zipCodeError');
  const siteResultDiv = document.getElementById('siteResult');
  const nextStepsDiv = document.getElementById('nextSteps');

 // Resetting error messages and result sections
  ageError.style.display = 'none';
  zipCodeError.style.display = 'none';
  siteResultDiv.innerHTML = '';
  nextStepsDiv.style.display = 'none';

  // Validate age
  if (isNaN(age) || age < 0 || age > 100 || !Number.isInteger(age)) {
    document.getElementById('ageError').style.display = 'block';
    document.getElementById('siteResult').innerHTML = ''; // Clear site results
    document.getElementById('nextSteps').style.display = 'none'; // Hide next steps
    return; // Stop further execution
  } else {
    document.getElementById('ageError').style.display = 'none';
  }

  // Validate ZIP code
  if (!validateZipCode(zipCode)) {
    document.getElementById('zipCodeError').style.display = 'block';
    document.getElementById('siteResult').innerHTML = ''; // Clear site results
    document.getElementById('nextSteps').style.display = 'none'; // Hide next steps
    return; // Stop further execution
  } else {
    document.getElementById('zipCodeError').style.display = 'none';
  }

  try {
  // Get coordinates for user's ZIP code
  const userCoordinates = await getCoordinatesForZip(zipCode);

  // Define sites array with criteria including Next Steps
  const sites = [
  { name: 'Mission Cataract - Kaiser Permanente Sacramento', ageRequirement: 'all', cataractDiagnosisRequirement: 'yes', usCitizenRequirement: 'all', insuranceType: 'noInsurance', zipCode: '95670', nextSteps: 'Kaiser Permanente Sacramento provides free cataract surgery to patients without MediCal, Medicare, or third-party insurance via affiliation to Mission Cataract. Please call 916-973-7159 for more information on scheduling. <p class= "copyAddress">Address: 10725 International Dr Rancho Cordova, CA 95670</p> <p>Contact: Clint McClanahan, MD 916-973-7159</p> <p>Website: https://missioncataractusa.org/</p>' },
  { name: 'Mission Cataract - Zeiter Eye Medical Group, Inc.', ageRequirement: 'all', cataractDiagnosisRequirement: 'yes', usCitizenRequirement: 'all', insuranceType: 'noInsurance', zipCode: '95202', nextSteps: 'Zeiter Eye Medical Group, Inc. provides free cataract surgery to patients without MediCal, Medicare, or third-party insurance via affiliation to Mission Cataract. Please call 209-466-5566 for more information on scheduling. <p class= "copyAddress">Address: 255 E. Weber Ave Stockton, CA 95202</p> <p>Contact: John H. Zeiter, MD 209-466-5566</p> <p>Website: https://missioncataractusa.org/</p>' },
  { name: 'EyeCare America - Seniors Program', ageRequirement: '>64', cataractDiagnosisRequirement: 'no', usCitizenRequirement: 'yes', insuranceType: 'noInsurance', zipCode: 'all', nextSteps: 'The Seniors Program by the American Academy of Ophthalmology connects eligible seniors 65 and older with local volunteer ophthalmologists who provide a medical eye exam often at no out-of-pocket cost, and up to one year of follow-up care for any condition diagnosed during the initial exam, for the physician services. To qualify for the Seniors Program, the patient must be: <p>- U.S. citizen or legal resident</p> <p>- Age 65 or older</p> <p>- Not belong to an HMO or have eye care benefits through the VA</p> <p>- Not seen an ophthalmologist in three or more years</p> <p>Visit https://www.aao.org/eyecare-america/read-more and click "Patients See if you Qualify". Fill out the form on behalf of the patient to request a match to a local ophthalmologist.</p>' },
  { name: 'Lions Eye Foundation California Nevada Region - California Pacific Medical Center', ageRequirement: 'all', cataractDiagnosisRequirement: 'yes', usCitizenRequirement: 'all', insuranceType: 'noInsurance', zipCode: '94120', nextSteps: 'Provides free cataract surgery and other services to patients without MediCal, Medicare, or third-party insurance via affiliation to Lions Eye Foundation. To qualify, patients must be: <p>- A continuous resident for 1 year</p> <p>- Adjusted Gross Income within guidelines listed in the form below</p> <p>- Proof of income</p> <p>Fill out the form located in the link below on behalf of the patient to refer to be seen at CPMC</p> Form: https://users.neo.registeredsite.com/9/4/7/11948749/assets/LEF_application_forms_4-2017_rev.pdf <p class= "copyAddress">Address: P.O. Box 7999 San Francisco, CA 94120</p> <p>Contact: Mark Paskvan, Program Coordinator 415-600-3950 PaskvaM@sutterhealth.org</p> <p>Website: http://www.lionseyeca-nv.org/-patient-referral.html</p>' },
  { name: 'Operation Access - SF Penninsula', ageRequirement: '>19', cataractDiagnosisRequirement: 'yes', usCitizenRequirement: 'all', insuranceType: 'noInsurance', zipCode: '94103', nextSteps: 'Provide free cataract surgery and other services to patients that meet the following criteria: <p>- Uninsured and ineligible for Medi-Cal, Medicare, Workers Comp, and full-scope CMSP</p> <p>- Income below 400% of federal poverty level (FPL) guidelines</p> Send referrals to referrals@operationaccess.org and fax: 415-733-0019. Include opthalmology/optometry note. <p class"copyAddress">Address: 1119 Market St, Suite 400 San Francisco, CA 94103</p> <p>Contact: Yesenia Ortiz, Program Coordinator for SF Peninsula Yesenia@operationaccess.org</p> <p>Website: https://www.operationaccess.org/</p>' },
  { name: 'Northeast Medical Services - San Fransisco', ageRequirement: 'all', cataractDiagnosisRequirement: 'all', usCitizenRequirement: 'all', insuranceType: 'all', zipCode: '94133', nextSteps: 'Provides primary care, optometry and ophthalmology specialty care at reduced costs for patients that meet income criteria. NEMS also helps enroll patients into health insurance programs, if they are uninsured. Instruct patient to visit https://nems.org/resources/become-a-member/ where they can become a member free of cost and schedule an appointment. <p>Address: Several clinics in San Fransisco, see website for more details</p> <p>Contact: 415-391-9686</p> <p>Website: https://nems.org/services/optometry/</p>' },
  { name: 'Northeast Medical Services - Daly City', ageRequirement: 'all', cataractDiagnosisRequirement: 'all', usCitizenRequirement: 'all', insuranceType: 'all', zipCode: '94015', nextSteps: 'Provides primary care, optometry and ophthalmology specialty care at reduced costs for patients that meet income criteria. NEMS also helps enroll patients into health insurance programs, if they are uninsured. Instruct patient to visit https://nems.org/resources/become-a-member/ where they can become a member free of cost and schedule an appointment. <p class= "copyAddress">Address: 211 Eastmoor Avenue Daly City, CA 94015</p> <p class="copyAddress">Alternate Address: 1850 Sullivan Avenue, Suite 150 Daly City, CA 94015</p> <p>Contact: 650-550-3923</p> <p>Website: https://nems.org/services/optometry/</p>' },
  { name: 'Northeast Medical Services - San Jose', ageRequirement: 'all', cataractDiagnosisRequirement: 'all', usCitizenRequirement: 'all', insuranceType: 'all', zipCode: '95131', nextSteps: 'Provides primary care, optometry and ophthalmology specialty care at reduced costs for patients that meet income criteria. NEMS also helps enroll patients into health insurance programs, if they are uninsured. Instruct patient to visit https://nems.org/resources/become-a-member/ where they can become a member free of cost and schedule an appointment. <p class= "copyAddress">Address: 1870 Lundy Avenue San Jose, CA 95131</p> <p>Contact: 408-573-9686</p> <p>Website: https://nems.org/services/optometry/</p>' },
   //{ name: 'Site X', ageRequirement: 'all', cataractDiagnosisRequirement: 'yes', usCitizenRequirement: 'yes', insuranceType: 'MediCal', zipCode: 'all', nextSteps: 'Next steps for Site X: ...' },
  ];

  // Retrieving radius preference from dropdown menu
  const radiusPreference = document.getElementById('radiusPreference').value;

  // Calculate distances for matching sites
  const sitesWithDistance = await Promise.all(sites.map(async site => {
    let distance = 0;
    if (site.zipCode !== 'all') {
      const siteCoordinates = await getCoordinatesForZip(site.zipCode);
      distance = calculateDistance(userCoordinates, siteCoordinates);
    }
    return { ...site, distance };
  }));

  // Filter sites based on criteria and radius preference
  const matchingSites = sitesWithDistance.filter(site => {
    return (
      evaluateRequirement(site.ageRequirement, age) &&
      evaluateRequirement(site.cataractDiagnosisRequirement, cataractDiagnosis) &&
      evaluateRequirement(site.insuranceType, insuranceType) &&
      evaluateRequirement(site.usCitizenRequirement, usCitizen) &&
      evaluateRadiusPreference(site.distance, radiusPreference)
      // Include additional conditions for zip code, if necessary
    );
  });


  // Sort matching sites by distance
  matchingSites.sort((a, b) => a.distance - b.distance);

  // Display matching sites sorted by proximity
  displayMatchingSites(matchingSites);
  } catch (error) {
  console.error('Error:', error);
  // Handle error scenarios
  }
});

// Function to clear existing results before updating
function clearExistingResults() {
  document.getElementById('siteResult').innerHTML = ''; // Clear site results
  document.getElementById('nextSteps').style.display = 'none'; // Hide next steps
  document.querySelectorAll('.popup-container').forEach(container => {
    container.remove(); // Remove existing pop-up containers
  });
}

// Function to evaluate radius preference
function evaluateRadiusPreference(distance, radiusPreference) {
  if (radiusPreference === 'noPreference') {
    return true; // Include all distances
  } else {
    const radiusInMiles = parseFloat(radiusPreference);
    return distance <= radiusInMiles; // Filter based on selected radius
  }
}

// Function to display matching sites in order of proximity
function displayMatchingSites(matchingSites) {
  if (matchingSites.length === 0) {
    alert('No matching sites found. Try a larger radius.');
  } else {
    let popupContent = '<div class="overlay" id="overlay"></div>';
    popupContent += '<div class="popup-container" id="popupContainer">';
    popupContent += '<span class="close-button" onclick="closePopup()">-</span>'; // Replaces the existing content'
    popupContent += '<div class="popup-content">';
    popupContent += '<h2>Matching Sites:</h2>';
    popupContent += '<ol>';

    matchingSites.forEach((site, index) => {
      popupContent += `<li><p class="site-name">${site.name}</p>`;
      popupContent += `<p class="distance">Distance: ${site.distance.toFixed(2)} miles</p>`;
      popupContent += `<button onclick="toggleNextSteps(${index})">Next Steps: ${site.name}</button>`;
      popupContent += `<div class="next-steps hidden" id="nextSteps-${index}">${formatNextSteps(site.nextSteps)}</div></li>`;
      popupContent += `<div class="gray-line"></div>`; // Gray line between site name and next steps
    });

    popupContent += '</ol></div></div>';

    // Append the pop-up content to the body
    document.body.insertAdjacentHTML('beforeend', popupContent);

    // Show the pop-up by changing the display property
    document.getElementById('overlay').style.display = 'block';
    document.getElementById('popupContainer').style.display = 'block';
  }
}

function formatNextSteps(nextSteps) {
  return nextSteps.replace(
    /https?:\/\/[^\s]+/g,
    '<a href="$&" target="_blank">$&</a>'
  );
}

// Function to toggle the visibility of next steps content
function toggleNextSteps(index) {
  const nextSteps = document.getElementById(`nextSteps-${index}`);
  if (nextSteps.classList.contains('hidden')) {
    nextSteps.classList.remove('hidden');
    showCopyAddressButton(index); // Show "Copy Address" button when "Next Steps" are displayed
  } else {
    nextSteps.classList.add('hidden');
    hideCopyAddressButton(index); // Hide "Copy Address" button when "Next Steps" are hidden
  }
}

// Function to show the "Copy Address" button when "Next Steps" are displayed
function showCopyAddressButton(index) {
  const addressElement = document.querySelector(`#nextSteps-${index} .copyAddress`);
  if (addressElement) {
    const copyButton = document.createElement('button');
    copyButton.textContent = 'Copy Address';
    copyButton.classList.add('copy-address-button');
    copyButton.onclick = function () {
      const addressText = addressElement.textContent.split(': ')[1]; // Extract address part after ': '
      copyAddressToClipboard(addressText);
    };
    addressElement.parentNode.insertBefore(copyButton, addressElement.nextSibling);
  }
}

// Function to hide the "Copy Address" button when "Next Steps" are hidden
function hideCopyAddressButton(index) {
  const copyButton = document.querySelector(`#nextSteps-${index} .copy-address-button`);
  if (copyButton) {
    copyButton.remove();
  }
}

// Function to copy the address to the clipboard
function copyAddressToClipboard(address) {
  const tempTextArea = document.createElement('textarea');
  tempTextArea.value = address;

  document.body.appendChild(tempTextArea);
  tempTextArea.select();
  document.execCommand('copy');
  document.body.removeChild(tempTextArea);

  alert('Address copied to clipboard!');
}

// Function to close the pop-up
function closePopup() {
  document.getElementById('overlay').style.display = 'none';
  document.getElementById('popupContainer').style.display = 'none';
}

// Helper function to evaluate requirements
function evaluateRequirement(requirement, value) {
  if (requirement === 'all') {
    return true;
  } else if (requirement === '>65') {
    return value > 65;
  } else if (requirement === '<65') {
    return value < 65;
  } else if (requirement[0] === '>') {
    const ageLimit = parseInt(requirement.slice(1));
    return value > ageLimit;
  } else if (requirement[0] === '<') {
    const ageLimit = parseInt(requirement.slice(1));
    return value < ageLimit;
  } else {
    return value.toString() === requirement;
  }
}

// Function to get latitude and longitude for a given ZIP code using Zippopotamus API
async function getCoordinatesForZip(zipCode) {
  try {
    const response = await fetch(`https://api.zippopotam.us/us/${zipCode}`);
    const data = await response.json();

    if (response.ok) {
      const { latitude, longitude } = data.places[0];
      return { latitude, longitude };
    } else {
      console.error('Error:', data);
      return null;
    }
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

// Switch between Home and About sections when clicking navigation links
document.querySelectorAll('.navbar li a').forEach(link => {
  link.addEventListener('click', function(event) {
    event.preventDefault();
    const targetId = this.getAttribute('href').slice(1);

    // Hide all sections and display the clicked section
    document.querySelectorAll('.content').forEach(section => {
      section.style.display = 'none';
    });
    document.getElementById(targetId).style.display = 'block';
  });
});
