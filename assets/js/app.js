// Newline below because parent script doesn't use EOF :(

/**
 * Get the value of a querystring
 * @param  {String} The field to get the value of
 * @param  {String} The URL to get the value from (optional)
 * @return {String} The field value
 */
var getQueryString = function ( field, url ) {
  var href = url ? url : window.location.href;
  var reg = new RegExp( '[?&]' + field + '=([^&#]*)', 'i' );
  var string = reg.exec(href);
  return string ? string[1] : null;
};

/**
 * Returns the first character just with a capitalized first character
 * @param  {String} The input string
 * @return {String} Capitalized string
 */
var capitalize = function (string) {
  return string && string[0].toUpperCase() + string.slice(1);
};

/**
 * Check if an element is inside a specifc array
 * @param  {String} The value to search for
 * @param  {Array}  The array to search in
 * @return {Boolean}
 */
function isInArray(value, array) {
  return array.indexOf(value) > -1;
}

/**
 * Function to load and store configuration file asynchronous
 * @param  {Function} Callback
 * @return {Object}   Configuration object
 */
function loadConfigFile(callback){
  $.getJSON('config.json', function(json, textStatus) {
    callback(json);
  });
}

var AndTekUI = new Framework7();
var $$ = Dom7;

var view1 = AndTekUI.addView('#view-1');
var view2 = AndTekUI.addView('#view-2');

var deviceMac;

// Wait until jQuery is loaded...
$(document).ready(function(){
  // Check if "?mac=XXX" is set in URL
  if (!getQueryString('mac')) {
    $('.content-block.info').html(
      '<p>Couldn\'t find passed handset MAC address in URL querystring. Make sure you\'ve open this web app like:</p>' +
      '<code>' +
        window.location.href.split('?')[0] + '?mac=YOUR_MAC' +
      '</code>'
    );
  } else {
    deviceMac = getQueryString('mac');
  }

  // Load current configuration file synchronously
  loadConfigFile(function(config){
    // Check for declared deviceMac variable... if it doesn't exist, no MAC was passed => show error in dashboard (view-1)
    if (!deviceMac) {
      $('#view-1 ul').html(
        '<li>' +
        '  <div class="item-content">' +
        '    <div class="item-inner">' +
        '      <div class="item-title label">No handset address passed</div>' +
        '    </div>' +
        '  </div>' +
        '</li>'
      );
    } else {
      // Get rid of "Loading ..." dummy entry
      $('#view-1 ul').html('');
      // For each agent in configuration ...
      for (var queue in config.queues) {
        if (config.agents[deviceMac] && isInArray(config.queues[queue], config.agents[deviceMac].queues)) {
          $('#view-1 ul').append(
            '<li>' +
            '  <div class="item-content">' +
            '    <div class="item-inner">' +
            '      <div class="item-title label">' + capitalize(queue) + '</div>' +
            '      <div class="item-after">' +
            '        <div class="item-input">' +
            '          <label class="label-switch">' +
            '            <input type="checkbox" disabled="disabled">' +
            '            <div class="checkbox"></div>' +
            '          </label>' +
            '        </div>' +
            '      </div>' +
            '    </div>' +
            '  </div>' +
            '</li>'
          );
        }
      }

      // Check if there are any queues for current MAC
      if ($('#view-1 ul li').length < 1) {
        $('#view-1 ul').html(
          '<li>' +
          '  <div class="item-content">' +
          '    <div class="item-inner">' +
          '      <div class="item-title label">No queues available for "' + deviceMac + '"</div>' +
          '    </div>' +
          '  </div>' +
          '</li>'
        );

      }
    }

    // Get rid of "Loading ..." dummy entry
    $('#view-2 ul').html('');
    // Populate "agents" view for each agent in configuration ...
    for (var agent in config.agents) {
      $('#view-2 ul').append(
        '<li class="item-content">' +
        '  <div class="item-media"><i class="fa fa-user"></i></div>' +
        '  <div class="item-inner">' +
        '    <div class="item-title">' + config.agents[agent].name + '</div>' +
        '    <div class="item-after">' +
        '      <label class="label-switch">' +
        '        <input type="checkbox" disabled="disabled">' +
        '        <div class="checkbox"></div>' +
        '      </label>' +
        '    </div>' +
        '  </div>' +
        '</li>'
      );
    }
  });
});
