const readlineSync = require('readline-sync');
var request = require('request');
const _ = require("lodash")

let postCode = readlineSync.question('Please enter your postcode:  ');

//let postCode = "NW51TL"
let getPostCode = `http://api.postcodes.io/postcodes/${postCode}`;

request(getPostCode, function (error, response, body) {
  var obj = JSON.parse(body);
  console.log(obj);

  let latitude = obj.result.latitude;
  let longitude = obj.result.longitude;
  console.log(latitude, longitude);


  let getLongLang = `https://api.tfl.gov.uk/StopPoint?stopTypes=NaptanPublicBusCoachTram&lat=${latitude}&lon=${longitude}&app_id=485e1933&app_key=650c4ade6b4c673f2f65c135f6a13636`;
  request(getLongLang, function (error, response, body) {
    var objtwo = JSON.parse(body);
    //console.log(objtwo);
    let startDestination = objtwo.stopPoints[0].naptanId;

    let busLink = `https://api.tfl.gov.uk/StopPoint/${startDestination}/Arrivals?app_id=d3f30bf1&app_key=e9363127a716edb88e917ae5b8fc1f0d`;

    request(busLink, function (error, response, body) {
      var obj = JSON.parse(body);
      console.log("The next five buses at this stop are the: ");

      let sortByBusTime = _.sortBy(obj, ["timeToStation"]);


      for (i = 0; i < 5; i++) {

        let busTime = sortByBusTime[i].timeToStation;
        let busNum = sortByBusTime[i].lineId;
        let busRoute = sortByBusTime[i].towards;
        let minutes = Math.floor(busTime / 60);



        console.log(busNum + " will arrive in " + minutes + " minutes and will be heading towards " + busRoute);
      }
    }   
    )}
  )}   
)
