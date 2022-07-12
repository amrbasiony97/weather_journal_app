/* Global Variables */

// Personal API Key for OpenWeatherMap API
const apiKey = 'd1726760ae0f42858b3f67ed22313806';
const countryInput = document.getElementById('country');
let resultCount = 0;
const autoCompList = document.getElementById('autoComplete');
let searchList = [];
const countryError = document.getElementById('error-msg');
let countryCode;
let url = '';
const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

// Create a new date instance dynamically with JS
let d = new Date();

let newDate = d.getDate()+' '+ monthNames[d.getMonth()]+' '+ d.getFullYear();


/* Helpful functions */

// Search algorithm to fetch available countries
const findCountry = (str, substr) => {
  for (let i=0; i<substr.length; i++) {
    // Prevent character case sensitivity for easy search
    if (str[i].toLowerCase() !== substr[i].toLowerCase()) {return false}
  }
  return true;
}

// get country code, zip code and feelings data from client side
const getData = async () => {
  try {
    const countryName = countryInput.value;
    const zip = document.getElementById('zip').value;
    const feelings = document.getElementById('feelings').value;
    
    let index = countryNames.name.indexOf(countryName);
    if (index === -1) {
      countryError.style.display = 'block';
      return;
    } else {
      countryCode = countryNames.code[index];
    }
    // Create a url to fetch data from api
    url = `https://api.openweathermap.org/data/2.5/weather?zip=${zip},${countryCode}&appid=${apiKey}&units=metric`;
    
    const res = await fetch(url);
    const data = await res.json();
    if (data.cod != 200) {
      countryError.style.display = 'block';
      throw `${res.message}`;
      return;
    } else {
      const temp = await data.main.temp
      const name = await data.name
      const description = await data.weather[0].description
      const icon = await data.weather[0].icon
      await fetch('/addData',{
        method: 'POST',
        credentials: 'same-origin',
        headers: {'Content-Type': 'application/json'},
        body:JSON.stringify({newDate, temp, feelings, name, description, icon})
      })
      const getResult = await fetch('/getResult').then(res => res.json());
      console.log(getResult);
      document.getElementById('temp').innerHTML = Math.round(getResult.temp) + ' <sup class="degrees">&#8451</sup>';
      document.getElementById('content').innerHTML = getResult.feelings;
      document.getElementById('date').innerHTML = getResult.date;
      document.getElementById('icon').setAttribute('src', `https://openweathermap.org/img/wn/${getResult.icon}@4x.png`);
      document.getElementById('icon').style.display = 'block';
      document.getElementById('description').innerHTML = getResult.description;
      document.getElementById('city').innerHTML = getResult.name;
    }
  } catch(error) {
    console.log(`Error: ${error}`);
  }
}


/* Events */

// Event to handle country search engine
countryInput.addEventListener('keyup', () => {
  // remove error msg if exist
  countryError.style.display = 'none';
  
  // Show search list when you start typing
  autoCompList.style.display = 'block';
  
  autoCompList.innerHTML = '';
  let search = countryInput.value;
  if (search === '') {
    autoCompList.innerHTML = '';
  }
  resultCount = 0;
  
  // 'countryNames' is an object defined in countryNames.js
  for (let i=0; i<countryNames.name.length; i++) {
    // Don't show more than 5 results
    if (resultCount === 5)
    break;
    // Show the search result if it matches the search keyword
    if (findCountry(countryNames.name[i], search)) {
      autoCompList.insertAdjacentHTML('beforeend', `<li>${countryNames.name[i]}</li>`);
      resultCount++;
    }
  }
  // Select all search results and add event to each of them
  searchList = document.querySelectorAll('li');
  for (let i=0; i<searchList.length; i++) {
    searchList[i].addEventListener('click', () => {
      countryInput.value = searchList[i].innerHTML;
      autoCompList.style.display = 'none';
    })
  }
})

zip.addEventListener('keyup', () => {
  countryError.style.display = 'none';
})

// Hide search list by clicking anywhere in the page except the search list items which will update the value of country input field
document.addEventListener('click', () => {
  autoCompList.style.display = 'none';
});

// Generate data button
document.getElementById('generate').addEventListener('click', getData);