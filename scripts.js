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

/// Function to handle form submission
document.getElementById('userInfoForm').addEventListener('submit', async function(event) {
  event.preventDefault();

  const age = parseInt(document.getElementById('ageInput').value);
  const medical = document.querySelector('input[name="medical"]:checked').value;
  const usCitizen = document.querySelector('input[name="usCitizen"]:checked').value;
  const zipCode = document.getElementById('zipCodeInput').value;

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
    { name: 'Site A', ageRequirement: '>65', medicalRequirement: 'no', usCitizenRequirement: 'yes', zipCode: '94305', nextSteps: 'Next steps for Site A: ...' },
    { name: 'Site B', ageRequirement: '>65', medicalRequirement: 'no', usCitizenRequirement: 'yes', zipCode: '43054', nextSteps: 'Next steps for Site B: ...' },
    { name: 'Site C', ageRequirement: 'all', medicalRequirement: 'no', usCitizenRequirement: 'no', zipCode: '43004', nextSteps: 'Next steps for Site C: ...' },
    { name: 'Site D', ageRequirement: 'all', medicalRequirement: 'yes', usCitizenRequirement: 'yes', zipCode: '43065', nextSteps: 'Next steps for Site D: ...' },
    { name: 'Site E', ageRequirement: '<65', medicalRequirement: 'yes', usCitizenRequirement: 'yes', zipCode: '43062', nextSteps: 'Next steps for Site E: ...' },
    { name: 'Site F', ageRequirement: '<65', medicalRequirement: 'no', usCitizenRequirement: 'no', zipCode: '43065', nextSteps: 'Next steps for Site F: ...' },
    { name: 'Site G', ageRequirement: '>55', medicalRequirement: 'yes', usCitizenRequirement: 'no', zipCode: '43065', nextSteps: 'Next steps for Site G: ...' },
    { name: 'Site H', ageRequirement: '>55', medicalRequirement: 'yes', usCitizenRequirement: 'no', zipCode: '94305', nextSteps: 'Next steps for Site H: ...' },
    { name: 'Site I', ageRequirement: 'all', medicalRequirement: 'yes', usCitizenRequirement: 'no', zipCode: '43222', nextSteps: 'Next steps for Site I: ...' },
    { name: 'Site J', ageRequirement: 'all', medicalRequirement: 'no', usCitizenRequirement: 'yes', zipCode: '43207', nextSteps: 'Next steps for Site J: ...' },
    ];

    // Filter sites based on criteria
    const matchingSites = sites.filter(site => {
      return (
        evaluateRequirement(site.ageRequirement, age) &&
        evaluateRequirement(site.medicalRequirement, medical) &&
        evaluateRequirement(site.usCitizenRequirement, usCitizen)
      );
    });

    // Calculate distances for matching sites
    const matchingSitesWithDistance = [];
    for (const site of matchingSites) {
      const siteCoordinates = await getCoordinatesForZip(site.zipCode);
      const distance = calculateDistance(userCoordinates, siteCoordinates);
      matchingSitesWithDistance.push({ ...site, distance });
    }

    // Sort matching sites by distance
    matchingSitesWithDistance.sort((a, b) => a.distance - b.distance);

    // Display matching sites sorted by proximity
    displayMatchingSites(matchingSitesWithDistance);
  } catch (error) {
    console.error('Error:', error);
    // Handle error scenarios
  }
});

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
  } else {
    return value.toString() === requirement;
  }
}

 // Function to get latitude and longitude for a given ZIP code using Zippopotamus API
async function getCoordinatesForZip(zipCode) {
  try {
    const response = await fetch(`http://api.zippopotam.us/us/${zipCode}`);
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



{/* document.getElementById('userInfoForm').addEventListener('submit', function(event) {
  event.preventDefault();

  const name = document.getElementById('nameInput').value;
  const age = document.getElementById('ageInput').value;
  const weight = document.getElementById('weightInput').value;

  // Send data to the server using Fetch API
  // fetch('https://your-api-endpoint.com/storeUserData', {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({ name, age, weight }),
  // })
  // .then(response => {
  //   // Handle response from the server if needed
  //   console.log('Data sent to server:', response);
  //   // You can also update UI or perform other actions based on the response
  // })
  // .catch(error => {
  //   // Handle any errors that occur during the fetch operation
  //   console.error('Error:', error);
  // });
}); */}