const express = require('express');
const cors = require('cors');

const app = express();
const axios = require('axios');
const csv = require('csvtojson')
const bodyParser = require('body-parser');

let food_truck_data = []
const url = 'https://data.sfgov.org/api/views/rqzj-sfat/rows.csv';
const limit=10;


app.use(cors({ origin: '*' }));


// GET endpoint
app.get('/api/data', (req, res) => {

    const place = req.query.q;
    console.log(place);
    if (place=='all'){
        food_truck_data.forEach((element) => {
            element.icon='https://cdn3.iconfinder.com/data/icons/street-food-and-food-trucker-1/64/food-car-street-delivery-mobile-kitchen-512.png';
          });
        res.json(food_truck_data);
    }else{
        res.json(removeDuplicates(searchFoodTruck(food_truck_data, ['Address', 'LocationDescription', 'Zip Codes', 'Applicant'], place),'locationid'));
    }

});

searchFoodTruck = (json, keys, partialString) => {
    let counter = 0; // Counter variable to track the number of matches
    let matches = []; // Array to store the matching objects

    if (Array.isArray(json)) {
        for (let i = 0; i < json.length; i++) {
            const result = searchFoodTruck(json[i], keys, partialString, limit);
            if (result.length > 0) {
                matches = matches.concat(result);
                counter += result.length;
                if (counter >= limit) {
                    break; // Exit the loop when the limit is reached or exceeded
                }
            }
        }
    } else if (typeof json === 'object') {
        for (const prop in json) {
            if (json.hasOwnProperty(prop)) {
                if (
                    keys.includes(prop) &&
                    typeof json[prop] === 'string' &&
                    json[prop].includes(partialString)
                ) {
                    counter++;
                    if (counter <= limit) {
                        json.icon='https://cdn3.iconfinder.com/data/icons/street-food-and-food-trucker-1/64/food-car-street-delivery-mobile-kitchen-512.png';
                        matches.push(json);
                    } else {
                        break; // Exit the loop when the limit is exceeded
                    }
                }
                const result = searchFoodTruck(json[prop], keys, partialString, limit);
                if (result.length > 0) {
                    matches = matches.concat(result);
                    counter += result.length;
                    if (counter >= limit) {
                        break; // Exit the loop when the limit is reached or exceeded
                    }
                }
            }
        }
    }

    return matches;
}

loadFoodTruckData = () => {

    axios.get(url)
        .then(response => {
            const csvData = response.data;

            csv()
                .fromString(csvData)
                .then(jsonArray => {
                    console.log(jsonArray.length + " food trucks data are loaded");
                    food_truck_data = jsonArray;
                    // Use the jsonArray as per your requirement
                })
                .catch(error => {
                    console.error('Error converting CSV to JSON:', error);
                });
        })
        .catch(error => {
            console.error('Error retrieving CSV data:', error);
        });
}

removeDuplicates=(jsonArray, locationIdKey) =>{
    const uniqueLocations = {}; // Object to track unique locationId values
    const result = jsonArray.reduce((acc, obj) => {
      const locationId = obj[locationIdKey];
      if (!uniqueLocations[locationId]) {
        uniqueLocations[locationId] = true;
        acc.push(obj);
      }
      return acc;
    }, []);
  
    return result;
  }
  


// Start the server
const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    loadFoodTruckData();
});
