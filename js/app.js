const patientName = "Jessica Taylor";
const apiUrl = 'https://fedskillstest.coalitiontechnologies.workers.dev'; // API endpoint
const username = 'coalition';
const password = 'skills-test';
const auth = btoa(`${username}:${password}`); // Basic Auth encoding

// Fetch patient data from the API
fetch(apiUrl, {
  headers: {
    'Authorization': `Basic ${auth}`
  }
})
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    console.log('API response:', data); // Log the entire response to inspect the structure

    // Check the data structure and filter for Jessica Taylor's information
    const jessicaData = data.find(patient => patient.name === patientName); 

    if (jessicaData) {
      displayPatientInfo(jessicaData);

      // Extract blood pressure data from the diagnosis_history array
      const bloodPressureData = jessicaData.diagnosis_history.map(entry => ({
        year: entry.year,
        month: entry.month,
        systolic: entry.blood_pressure.systolic.value, // Access nested value
        diastolic: entry.blood_pressure.diastolic.value // Access nested value
      }));

      // Check if bloodPressureData is populated and is an array
      if (bloodPressureData && Array.isArray(bloodPressureData) && bloodPressureData.length > 0) {
        displayBloodPressureGraph(bloodPressureData);
      } else {
        console.error('No blood pressure data found for Jessica Taylor');
      }
    } else {
      console.error('Jessica Taylor not found');
    }
  })
  .catch(error => console.error('Error fetching data:', error));

// Function to display patient info
function displayPatientInfo(patient) {
  document.getElementById('patient-name').textContent = patient.name;
  document.getElementById('patient-age').textContent = `Age: ${patient.age}`;
  document.getElementById('patient-email').textContent = `Email: ${patient.email}`;
  document.getElementById('patient-phone').textContent = `Phone: ${patient.phone_number}`;
}

// Function to display blood pressure graph
function displayBloodPressureGraph(bloodPressureData) {
  const ctx = document.getElementById('bloodPressureChart').getContext('2d');

  if (!ctx) {
    console.error('Failed to get 2D context from canvas');
    return;
  }

  const chart = new Chart(ctx, {
    type: 'line', // Change to 'line' for line chart
    data: {
      labels: bloodPressureData.map(item => `${item.month} ${item.year}`), // Format labels with month and year
      datasets: [
        {
          label: 'Systolic Blood Pressure',
          data: bloodPressureData.map(item => item.systolic), // Access nested value
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 2,
          pointRadius: 5
        },
        {
          label: 'Diastolic Blood Pressure',
          data: bloodPressureData.map(item => item.diastolic), // Access nested value
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 2,
          pointRadius: 5
        }
      ]
    },
    options: {
      responsive: true,
      scales: {
        x: {
          title: {
            display: true,
            text: 'Date'
          }
        },
        y: {
          title: {
            display: true,
            text: 'Blood Pressure (mmHg)'
          },
          beginAtZero: true
        }
      },
      plugins: {
        legend: {
          display: true,
          position: 'top'
        },
        tooltip: {
          callbacks: {
            label: function(tooltipItem) {
              return `${tooltipItem.dataset.label}: ${tooltipItem.raw} mmHg`;
            }
          }
        }
      }
    }
  });
}
