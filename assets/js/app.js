// Newline below because parent script doesn't use EOF :(

/* jshint loopfunc:true */

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
 * Simple function to log errors and show an iOS alert
 * @param  {String} message Input message
 * @return {Boolean}        true
 */
function displayErrorAlert(message){
  console.log('Error: ' + message);
  AndTekUI.alert(message);
  return true;
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

/**
 * Minimal sprintf() function
 * by http://stackoverflow.com/a/4795914
 * @return {String} Formatted string
 */
function sprintf() {
    var args = arguments,
    string = args[0],
    i = 1;
    return string.replace(/%((%)|s|d)/g, function (m) {
        // m is the matched format, e.g. %s, %d
        var val = null;
        if (m[2]) {
            val = m[2];
        } else {
            val = args[i];
            // A switch statement so that the formatter can be extended. Default is %s
            switch (m) {
                case '%d':
                    val = parseFloat(val);
                    if (isNaN(val)) {
                        val = 0;
                    }
                    break;
            }
            i++;
        }
        return val;
    });
}

/**
 * Returns the status of an agent in a specific queue
 * @param  {String}   agentMacAddress
 * @param  {Integer}  queueId
 * @param  {Function} callback
 * @return {Boolean}
 */
function getCurrentStatus(agentMacAddress, queueId, callback){
  $.get( 'api/get/?mac=' + agentMacAddress + '&queue=' + queueId, function( data ) {
    var json = $.parseJSON(data);
    callback(json.data.status);
  });
}

/**
 * Function to render the dashboard view
 * @param  {Object}   Configuration object
 */
function loadDashboardView(config){
  $('#view-1 .center.sliding').html(config.agents[deviceMac].name);

  // Get rid of "Loading ..." dummy entry
  $('#view-1 ul').html('');
  // For each agent in configuration ...
  for (var queue in config.queues) {
    if (config.agents[deviceMac] && isInArray(config.queues[queue], config.agents[deviceMac].queues)) {
      $('#view-1 ul').append(
        '<li>' +
        '  <div class="item-content">' +
        '    <div class="item-media"><i class="queueicon queueicon--active queueicon--queue' + config.queues[queue] + '"></i></div>' +
        '    <div class="item-inner">' +
        '      <div class="item-title label" data-queue="' + config.queues[queue] + '">' + capitalize(queue) + '</div>' +
        '      <div class="item-after">' +
        '        <div class="item-input">' +
        '          <label class="label-switch">' +
        '            <input type="checkbox">' +
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
    displayErrorAlert('No queues available for "' + deviceMac);
  }

  // Get current queue status in "dashboard" view
  $('#view-1 ul li').each(function(){
    var queueId = $('.item-title', this).data('queue'),
        liDom = $(this); // Store <li> DOM in variable
    // Get current queue status via PHP API
    $.getJSON( 'api/get/?mac=' + deviceMac + '&queue=' + queueId, function( json ) {
      // If "true" check checbox
      if (json.data.status) {
        $('input', liDom).prop('checked', true);
      } else {
        // Otherwise uncheck checkbox
        $('input', liDom).prop('checked', false);
      }
    });
  });
}

/**
 * Function to render the agents view
 * @param  {Object}   Configuration object
 */
function loadAgentsView(config){
  // Get rid of "Loading ..." dummy entry
  $('#view-2 ul').html('');
  // Populate "agents" view for each agent in configuration ...
  for (var agent in config.agents) {
    $('#view-2 ul').append(
      '<li class="item-content">' +
      '  <div class="item-media"><i class="queueicon queueicon--list"></i></div>' +
      '  <div class="item-inner" data-user="' + config.agents[agent].name + '" data-mac="' + agent + '">' +
      '    <div class="item-title">' + config.agents[agent].name + '</div>' +
      '    <div class="item-after queues">' +
      (isInArray(1, config.agents[agent].queues) ? '<i data-queue="1" class="queueicon queueicon--queue1 absolute--queue1"></i>' : '') +
      (isInArray(2, config.agents[agent].queues) ? '<i data-queue="2" class="queueicon queueicon--queue2 absolute--queue2"></i>' : '') +
      '    </div>' +
      '  </div>' +
      '</li>'
    );

    // Add status icon for each assigned queue
    for(var agentQueue in config.agents[agent].queues){
      (function(newAgent, newAgentQueue){
        getCurrentStatus(newAgent, newAgentQueue, function(status){
          if (status) {
            $('#view-2 ul *[data-mac="' + newAgent + '"] .queues i[data-queue="' + newAgentQueue + '"]').addClass('queueicon--active');
            console.log('Agent "' + config.agents[newAgent].name + '" IS logged in "' + newAgentQueue + '" queue');
          } else {
            $('#view-2 ul *[data-mac="' + newAgent + '"] .queues i[data-queue="' + newAgentQueue + '"]').removeClass('queueicon--active');
            console.log('Agent "' + config.agents[newAgent].name + '" is NOT logged in "' + newAgentQueue + '" queue');
          }
        });
      })(agent, config.agents[agent].queues[agentQueue]);
    }
  }
}

var AndTekUI = new Framework7({
  modalTitle: "AndTekUI"
});

var $$ = Dom7;

var view1 = AndTekUI.addView('#view-1'),
    view2 = AndTekUI.addView('#view-2');

var deviceMac;

// Wait until jQuery is loaded...
$(document).ready(function(){
  // Check debug state
  if (!getQueryString('debug')) {
    ConsoleLogViewer.logEnabled = false;
    $('#debug_console').remove();
  }

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

  // Check "api/status" endpoint for successful AndTek server connection
  $.getJSON('api/status', function(json, textStatus) {
    // If server connection is established ...
    if (json.data.status) {
      // Load current configuration file synchronously
      loadConfigFile(function(config){

        /*
         * "dashboard" view
         */

        // Check for declared deviceMac variable... if it doesn't exist, no MAC was passed => show error in dashboard (view-1)
        if (!deviceMac) {
          displayErrorAlert('No handset available');
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
          loadDashboardView(config);
        }

        // When user changes the checkboxes / request a status change for a specific queue
        $(':checkbox').change(function() {
          var currentQueue = $(this).parent().parent().parent().siblings('.item-title').data('queue'),
              currentStatus = $(this).is(":checked");
              currentDom = $(this); // Store <input>'s DOM

          // Disable checkbox
          $(currentDom).prop( "disabled", true );

          // Try to set said status via PHP API
          $.getJSON('api/set/', {mac: deviceMac, queue: currentQueue, status: currentStatus}, function(json, textStatus) {
            // Add slight delay for UX purposes
            setTimeout(function(){
              if (json.success) {
                console.log('Agent "' + config.agents[deviceMac].name + '" is ' + (json.data.status ? 'NOW' : 'NOT')  + ' logged in queue "' + currentQueue + '"');
                // Reenable checkbox
                $(currentDom).prop( "disabled", false );
              }
            }, 500);
          });
        });

        /*
         * "agents" view
         */

         // If no deviceMac, replace <ul>'s
         if (!deviceMac) {
           $('#view-2 ul').html(
             '<li>' +
             '  <div class="item-content">' +
             '    <div class="item-inner">' +
             '      <div class="item-title label">No handset address passed</div>' +
             '    </div>' +
             '  </div>' +
             '</li>'
           );
         }

         /* Pull to refresh */

         var ptrAgentsContent = $$('div[data-page=index-2] .pull-to-refresh-content');

         // Add 'refresh' listener on it
         ptrAgentsContent.on('refresh', function (e) {
          loadAgentsView(config);
          setTimeout(function () {
            // When loading done, we need to reset it
            AndTekUI.pullToRefreshDone();
          }, 1000);
        });

        /*
         * Tab bar
         */

        // On click on "dashboard" tab bar icon
        $('a[href$="#view-1"]').click(function(){
          if (deviceMac) {
            // Refresh current dashboard view
            loadDashboardView(config);
          }
        });

        // On click on "agents" tab bar icon
        $('a[href$="#view-2"]').click(function(){
          if (deviceMac) {
            // Refresh current agents view
            loadAgentsView(config);
          }
        });
      });

      /* Miscellaneous */

      // Set version
      $.get('VERSION', function(data) {
        var versionTemplate = $('.copyright p').html();
        $('.copyright p').html(sprintf(versionTemplate, data));
      });
    } else { // otherwise return error message
      var message = "Couldn't establish connection to AndTek server.";
      displayErrorAlert(message);
      // Destroy Pull to refresh menus
      AndTekUI.destroyPullToRefresh($$('div[data-page=index-2] .pull-to-refresh-content'));
    }
  });
});
