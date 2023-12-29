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
  { name: 'Mission Cataract - Kaiser Permanente Sacramento', ageRequirement: 'all', cataractDiagnosisRequirement: 'yes', usCitizenRequirement: 'all', insuranceType: 'noInsurance', zipCode: '95670', nextSteps: '"Provides free cataract surgery to patients without MediCal, Medicare, or third-party insurance via affiliation to Mission Cataract. Please call 916-973-7159 for more information on scheduling. Address: 10725 International Dr Rancho Cordova, CA 95670 Contact: Clint McClanahan, MD 916-973-7159 Website: https://missioncataractusa.org/"' },
  { name: 'Mission Cataract - Zeiter Eye Medical Group, Inc.', ageRequirement: 'all', cataractDiagnosisRequirement: 'yes', usCitizenRequirement: 'all', insuranceType: 'noInsurance', zipCode: '95202', nextSteps: '"Provides free cataract surgery to patients without MediCal, Medicare, or third-party insurance via affiliation to Mission Cataract. Please call 209-466-5566 for more information on scheduling. Address: 255 E. Weber Ave Stockton, CA 95202 Contact: John H. Zeiter, MD 209-466-5566 Website: https://missioncataractusa.org/"' },
  { name: 'EyeCare America - Seniors Program', ageRequirement: '>64', cataractDiagnosisRequirement: 'no', usCitizenRequirement: 'yes', insuranceType: 'noInsurance', zipCode: 'all', nextSteps: '"The Seniors Program by the American Academy of Ophthalmology connects eligible seniors 65 and older with local volunteer ophthalmologists who provide a medical eye exam often at no out-of-pocket cost, and up to one year of follow-up care for any condition diagnosed during the initial exam, for the physician services. To qualify for the Seniors Program, the patient must be: - U.S. citizen or legal resident - Age 65 or older - Not belong to an HMO or have eye care benefits through the VA - Not seen an ophthalmologist in three or more years Visit https://www.aao.org/eyecare-america/read-more and click "Patients See if you Qualify". Fill out the form on behalf of the patient to request a match to a local ophthalmologist"' },
  { name: 'Lions Eye Foundation California Nevada Region - California Pacific Medical Center', ageRequirement: 'all', cataractDiagnosisRequirement: 'yes', usCitizenRequirement: 'no', insuranceType: 'noInsurance', zipCode: '94120', nextSteps: '"Provides free cataract surgery and other services to patients without MediCal, Medicare, or third-party insurance via affiliation to Lions Eye Foundation. To qualify, patients must be: - A continuous resident for 1 year - Adjusted Gross Income within guidelines listed in the form below - Proof of income Fill out the following form on behalf of the patient to refer to be seen at CPMC: https://users.neo.registeredsite.com/9/4/7/11948749/assets/LEF_application_forms_4-2017_rev.pdf Address: P.O. Box 7999 San Francisco, CA 94120 Contact: Mark Paskvan, Program Coordinator 415-600-3950 PaskvaM@sutterhealth.org Website: http://www.lionseyeca-nv.org/-patient-referral.html"' },
  { name: 'Operation Access - SF Penninsula', ageRequirement: '>19', cataractDiagnosisRequirement: 'yes', usCitizenRequirement: 'all', insuranceType: 'noInsurance', zipCode: '94103', nextSteps: '"Provide free cataract surgery and other services to patients that meet the following criteria: - Uninsured and ineligible for Medi-Cal, Medicare, Workers Comp, and full-scope CMSP - Income below 400% of federal poverty level (FPL) guidelines Send referrals to referrals@operationaccess.org and fax: 415-733-0019. Include opthalmology/optometry note. Address: 1119 Market St, Suite 400 San Francisco, CA 94103 Contact: Yesenia Ortiz, Program Coordinator for SF Peninsula Yesenia@operationaccess.org Website: https://www.operationaccess.org/"' },
  { name: 'Northeast Medical Services - San Fransisco', ageRequirement: 'all', cataractDiagnosisRequirement: 'all', usCitizenRequirement: 'all', insuranceType: 'all', zipCode: '94133', nextSteps: '"Provides primary care, optometry and ophthalmology specialty care at reduced costs for patients that meet income criteria. NEMS also helps enroll patients into health insurance programs, if they are uninsured. Instruct patient to visit https://nems.org/resources/become-a-member/ where they can become a member free of cost and schedule an appointment. Address: Several clinics in San Fransisco, see website for more details Contact: 415-391-9686 Website: https://nems.org/services/optometry/"' },
  { name: 'Northeast Medical Services - Daly City', ageRequirement: 'all', cataractDiagnosisRequirement: 'all', usCitizenRequirement: 'all', insuranceType: 'all', zipCode: '94015', nextSteps: '"Provides primary care, optometry and ophthalmology specialty care at reduced costs for patients that meet income criteria. NEMS also helps enroll patients into health insurance programs, if they are uninsured. Instruct patient to visit https://nems.org/resources/become-a-member/ where they can become a member free of cost and schedule an appointment. Address: 211 Eastmoor Avenue Daly City, CA 94015 or 1850 Sullivan Avenue, Suite 150 Daly City, CA 94015 Contact: 650-550-3923 Website: https://nems.org/services/optometry/"' },
  { name: 'Northeast Medical Services - San Jose', ageRequirement: 'all', cataractDiagnosisRequirement: 'all', usCitizenRequirement: 'all', insuranceType: 'all', zipCode: '95131', nextSteps: '"Provides primary care, optometry and ophthalmology specialty care at reduced costs for patients that meet income criteria. NEMS also helps enroll patients into health insurance programs, if they are uninsured. Instruct patient to visit https://nems.org/resources/become-a-member/ where they can become a member free of cost and schedule an appointment. Address: 1870 Lundy Avenue San Jose, CA 95131 Contact: 408-573-9686 Website: https://nems.org/services/optometry/"' },
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
  const siteResultDiv = document.getElementById('siteResult');
  const nextStepsDiv = document.getElementById('nextSteps');

  if (matchingSites.length === 0) {
    siteResultDiv.innerHTML = 'No matching sites found.';
    nextStepsDiv.style.display = 'none';
  } else {
    let matchedSitesHTML = '<h2>Matched Sites:</h2><ul>';
    let nextStepsHTML = '<h2>Next Steps:</h2><ul>';

    matchingSites.forEach(site => {
      matchedSitesHTML += `<li>${site.name} - Distance: ${site.distance.toFixed(2)} miles</li>`;
      nextStepsHTML += `<li>Next steps for ${site.name}: ${site.nextSteps}</li>`;
    });

    matchedSitesHTML += '</ul>';
    nextStepsHTML += '</ul>';

    siteResultDiv.innerHTML = matchedSitesHTML;
    nextStepsDiv.innerHTML = nextStepsHTML;
    nextStepsDiv.style.display = 'block';
  }
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
