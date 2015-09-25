<?php

$config = json_decode(file_get_contents(__DIR__.'/../config.json'), true);

/**
 * Returns the current status of an agent in a specific queue
 * @param  {String} $macAddress MAC address of agent handset
 * @param  {Integer} $queueI    Queue ID
 * @return {Object}             JSON response
 */
function getStatus($macAddress, $queueId) {
  global $config;

  $apiUri = $config['server']['protocol'].'://'.$config['server']['hostname'].':'.$config['server']['port'].'/andphone/ACDService?queue='.$queueId.'&setsec=-1&page=available&dev='.$macAddress;

  $ch = curl_init();
  curl_setopt($ch, CURLOPT_URL, $apiUri);
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
  $xmlresponse = curl_exec($ch);
  curl_close($ch);

  $xml=simplexml_load_string($xmlresponse);

  if (isset($xml->MenuItem[0]->Name)) {
    if(strpos($xml->MenuItem[0]->Name, "*") !== false) {
      // State: available
      return true;
    } elseif(strpos($xml->MenuItem[1]->Name, "*") !== false) {
      // State: not available
      return false;
    }
  } else {
    // State: unsure - perhaps Nachbereitung?
    return false;
  }
}

/**
 * Set specific status of a specific handset in a specific queue
 * @param {String} $macAddress MAC address of handset to control
 * @param {Integer} $queueId Id of the specific queue
 * @param {Boolean} $queueStatus Status to set
 */
function setStatus($macAddress, $queueId, $queueStatus){
  global $config;

  // Translate boolean into reversed integer (ಠ_ಠ)
  if($queueStatus === "true"){
    $queueStatusInt = "0";
  } else {
    $queueStatusInt = "1";
  }

  // Prepare curl request
  $ch = curl_init();
  curl_setopt($ch, CURLOPT_URL, $config['server']['protocol'].'://'.$config['server']['hostname'].':'.$config['server']['port'].'/andphone/ACDService?queue='.$queueId.'&setsec=-1&state='.$queueStatusInt.'&page=available&dev='.$macAddress);
  curl_setopt($ch, CURLOPT_HEADER, 0);
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
  curl_setopt($ch, CURLOPT_TIMEOUT, 10);
  $output = curl_exec($ch);
  curl_close($ch);

  $xml = simplexml_load_string($output);

  if (isset($xml[0])) {
    if($queueStatus === "true"){
      if (preg_match('/auf V/',(string)$xml[0]->Text)){
        return true;
      } else {
        return false;
      }
    } else {
      if (preg_match('/auf Nicht v/',(string)$xml[0]->Text)){
        return true;
      } else {
        return false;
      }
    }
  } else {
    // State: unsure - perhaps Nachbereitung?
    return false;
  }
}

/**
 * Check AndTek server connection
 * @return {Boolean} True if server connection successful established
 */
function testServerConnection(){
  global $config;

  // Prepare curl request
  $ch = curl_init();
  curl_setopt($ch, CURLOPT_URL, $config['server']['protocol'].'://'.$config['server']['hostname'].':'.$config['server']['port'].'/andphone/');
  curl_setopt($ch, CURLOPT_HEADER, 0);
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
  curl_setopt($ch, CURLOPT_TIMEOUT, 3);
  $output = curl_exec($ch);
  $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
  curl_close($ch);

  if ($httpCode !== 200) {
    return false;
  } else {
    return true;
  }
}

/**
 * Print JSON and die
 * @param {Object} $json PHP object
 * @return {Null}
 */
function printJSONandDie ($json){
  // Print out JSON
  print json_encode($json);
  die();
}
?>
