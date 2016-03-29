var UI = require('ui');
var ajax = require('ajax');
var Vector2 = require('vector2');

// Show splash screen while waiting for data
var splashWindow = new UI.Window({
  backgroundColor:'black'
});

// Text element to inform user
var text = new UI.Text({
  position: new Vector2(0, 10),
  size: new Vector2(144, 40),
  text:'ERAU Library Computers: Downloading data...',
  font:'GOTHIC_14_BOLD',
  color:'white',
  textOverflow:'wrap',
  textAlign:'center'
});

// Add to splashWindow and show
splashWindow.add(text);
splashWindow.show();

var menu = new UI.Menu({
  backgroundColor: 'black',
  textColor: 'white',
  highlightBackgroundColor: 'blue',
  highlightTextColor: 'white',
  sections: [{
    title: 'ERAU Library',
    items: [{
      title: 'Loading...',
    }]
  },{
    title: 'All Computers'}]
});

// Construct URL
//var URL = 'http://api.openweathermap.org/data/2.5/weather?q=' + cityName + '&appid=' + myAPIKey;
var URL = "https://webforms.erau.edu/public/mobile/erauapp/labs/labStats.cfc?method=labstatsApiProxy&apiPath=/api/public/GetMap/1020";

// Make the request
ajax(
  {
    url: URL,
    type: 'json'
  },
  function(data) {
    // Success!
    console.log("Successfully fetched weather data!");
    var status = null;
    var availableComputers = 0;
    
    console.log("Status of 0: " + status);
    
    for (var i = 0; i < data.MapStations.length; i++) { 
      status = data.MapStations[i].Status; 
      if(status.localeCompare("InUse") === 0){
         status = "Currently in use";
         
      }else{
        status = "Available";
        availableComputers++;
      } 
      
      menu.item(1, i, { title: 'Computer ' + (i+1), subtitle: status });
    }
    
    menu.item(0,0, { title: availableComputers + ' computers', subtitle: 'are available now'});
    menu.show();
    splashWindow.hide();
    
  },
  function(error) {
    // Failure!
    console.log('Failed fetching weather data: ' + error);
  }
);
