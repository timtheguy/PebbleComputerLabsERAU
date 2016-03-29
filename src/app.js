var UI = require('ui');

// Show splash screen while waiting for data
var splashWindow = new UI.Window({
  backgroundColor:'black'
});

splashWindow.show();


var ajax = require('ajax');
var Vector2 = require('vector2');


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


var menu = new UI.Menu({
  backgroundColor: 'white',
  textColor: 'black',
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

var URL = "https://webforms.erau.edu/public/mobile/erauapp/labs/labStats.cfc?method=labstatsApiProxy&apiPath=/api/public/GetMap/1020";

// Make the request
ajax(
  {
    url: URL,
    type: 'json'
  },
  function(data) {
    // Success!
    console.log("Contacted server and received response");
    var status = null;
    var availableComputers = 0;
    
    for (var i = 0; i < data.MapStations.length; i++) { 
      status = data.MapStations[i].Status; 
      if(status.localeCompare("InUse") === 0){
         status = "Currently in use";
        menu.item(1, i, { title: 'Computer ' + (i+1), subtitle: status, icon: 'images/x_icon.png' });
      }else{
        status = "Available";
        menu.item(1, i, { title: 'Computer ' + (i+1), subtitle: status, icon: 'images/check_icon.png' });
        availableComputers++;
      } 
      
      
    }
    
    menu.item(0,0, { title: availableComputers + ' computers', subtitle: 'are available now'});
    menu.show();
    splashWindow.hide();
    
  },
  function(error) {
    // Failure!
    console.log('Failed to access resource: ' + error);
  }
);
