var UI = require('ui');
var ajax = require('ajax');
var Vector2 = require('vector2');

// Show splash screen while waiting for data
var loadingWindow = new UI.Window({
  backgroundColor:'black'
});

// Text element to inform user
var text = new UI.Text({
  position: new Vector2(0, 10),
  size: new Vector2(144, 40),
  text:'ERAU Computers: Downloading data...',
  font:'GOTHIC_14_BOLD',
  color:'white',
  textOverflow:'wrap',
  textAlign:'center'
});

// Add to splashWindow and show
loadingWindow.add(text);




var mainMenu = new UI.Menu({
  backgroundColor: 'white',
  textColor: 'black',
  highlightBackgroundColor: 'blue',
  highlightTextColor: 'white',
  sections: [{
    title: 'College of Arts and Sciences',
    items: [{
      title: 'Room 104 Lab',
    },{
      title: 'Room 105 Lab'
    },{
      title: 'Room 106 Lab'
    }]
  },{
    title: 'College of Aviation',
    items: [{
      title: 'Room 141 Lab',
    },{
      title: 'Room 356 Lab'
    }]
  },{
    title: 'College of Business',
    items: [{
      title: 'Room 123 Lab',
    }]
  },{
    title: 'Lehman Building',
    items: [{
      title: 'Room 371 Lab',
    }]
  },{
    title: 'Other',
    items: [{
      title: 'Hunt Library',
    },{
      title: 'Ignite Lab'
    },{
      title: 'The HUB'
    }]
  }]
});

mainMenu.on('select', function(e) {
  console.log('Currently selected item is #' + e.itemIndex + ' of section #' + e.sectionIndex);
  console.log('The item is titled "' + e.item.title + '"');
  
  loadingWindow.show();
  
  if(e.sectionIndex === 0){ //COAS
    if(e.itemIndex === 0){ 
      getLabStats('Room 104 Lab', 1016);
    }else if(e.itemIndex === 1){ 
      getLabStats('Room 105 Lab', 1017);
    }else if(e.itemIndex === 2){ 
      getLabStats('Room 106 Lab', 1018);
    }
  }else if(e.sectionIndex === 1){ //COA
     if(e.itemIndex === 0){ 
      getLabStats('Room 141 Lab', 1015);
    }else if(e.itemIndex === 1){ 
      getLabStats('Room 356 Lab', 1023);
    }
  }else if(e.sectionIndex === 2){ //COB
    if(e.itemIndex === 0){ 
      getLabStats('Room 123 Lab', 1019);
    }
  }else if(e.sectionIndex === 3){ //LB
    if(e.itemIndex === 0){ 
      getLabStats('Room 371 Lab', 1012);
    }
  }else if(e.sectionIndex === 4){ //OTHER
    if(e.itemIndex === 0){ 
      getLabStats('Library', 1020);
    }else if(e.itemIndex === 1){ 
      getLabStats('Ignite Lab (Mod 22)', 1021);
    }else if(e.itemIndex === 2){ 
      getLabStats('The HUB (Mod 23)', 1022);
    }
  }
});

mainMenu.show();



function getLabStats(title, labID){
    var menu = new UI.Menu({
      backgroundColor: 'white',
      textColor: 'black',
      highlightBackgroundColor: 'blue',
      highlightTextColor: 'white',
      sections: [{
        title: title,
        items: [{
          title: 'Loading...',
        }]
      },{
        title: 'All Computers'}]
    });
  
    var URL = "https://webforms.erau.edu/public/mobile/erauapp/labs/labStats.cfc?method=labstatsApiProxy&apiPath=/api/public/GetMap/" + labID;
    
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
        loadingWindow.hide();
        
      },
      function(error) {
        // Failure!
        console.log('Failed to access resource: ' + error);
      }
    );
}
    