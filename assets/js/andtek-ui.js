// Initialize your app
var myApp = new Framework7();

// Export selectors engine
var $$ = Dom7;

// Add view
var mainView = myApp.addView('.view-main', {
    // Because we use fixed-through navbar we can enable dynamic navbar
    dynamicNavbar: true
});

// Wait until jQuery is loaded...
$(document).ready(function(){
  // Parse agents from JSON
  $.getJSON('agents.json', function(agents) {
    // Get rid of "Loading ..." dummy entry
    $('ul').html(''); 
    // For each agent ...
    for (agent in agents) {
      $('ul').append(
        '<li class="item-content">' +
        '  <div class="item-media"><i class="fa fa-circle ' + (agents[agent]['internal'] ? 'green' : 'red') + '"></i></div>' +
        '  <div class="item-inner">' +
        '    <div class="item-title">' + agent + '</div>' +
        '    <div class="item-after"><i class="fa fa-circle ' + (agents[agent]['external'] ? 'green' : 'red') + '"></i></div>' +
        '  </div>' +
        '</li>'
      );
    }
  });
});
