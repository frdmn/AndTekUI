// Newline below because parent script doesn't use EOF :(

var AndTekUI = new Framework7();
var $$ = Dom7;

var view1 = AndTekUI.addView('#view-1');
var view2 = AndTekUI.addView('#view-2');

// Wait until jQuery is loaded...
$(document).ready(function(){
  // Check if ""?mac=XXX" is set in URL
  if (!getQueryString('mac')) {
    $('.content-block.info').html(
      '<p>Couldn\'t find passed handset MAC address in URL querystring. Make sure you\'ve open this web app like:</p>' +
      '<code>' +
        window.location.href.split('?')[0] + '?mac=YOUR_MAC' +
      '</code>'
    );
  }

  // Parse agents from JSON
  $.getJSON('agents.json', function(agents) {
    // Get rid of "Loading ..." dummy entry
    $('#view-2 ul').html('');
    // For each agent ...
    for (var agent in agents) {
      $('#view-2 ul').append(
        '<li class="item-content">' +
        '  <div class="item-media"><i class="fa fa-user"></i></div>' +
        '  <div class="item-inner">' +
        '    <div class="item-title">' + agent + '</div>' +
        '    <div class="item-after">' +
        '      <i class="fa fa-circle ' + (agents[agent].internal ? 'green' : 'red') + '"></i>' +
        '      <i class="fa fa-circle ' + (agents[agent].external ? 'green' : 'red') + '"></i>' +
        '    </div>' +
        '  </div>' +
        '</li>'
      );
    }
  });
});

/**
 * Get the value of a querystring
 * @param  {String} field The field to get the value of
 * @param  {String} url   The URL to get the value from (optional)
 * @return {String}       The field value
 */
var getQueryString = function ( field, url ) {
    var href = url ? url : window.location.href;
    var reg = new RegExp( '[?&]' + field + '=([^&#]*)', 'i' );
    var string = reg.exec(href);
    return string ? string[1] : null;
};
