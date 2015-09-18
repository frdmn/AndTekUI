<?php
  include_once('../functions.php');

  // Set defaults
  $jsonObject['success'] = false;
  $jsonObject['message'] = null;

  // Check for ?mac GET parameter
  if (!isset($_GET['mac'])) {
    $jsonObject['message'] = 'Missing ?mac=YOUR_MAC parameter';
    printJSONandDie($jsonObject);
  }

  // Check for ?queue GET parameter
  if (!isset($_GET['queue'])) {
    $jsonObject['message'] = 'Missing ?queue=queueID parameter';
    printJSONandDie($jsonObject);
  }

  // Also return input variables
  $jsonObject['method'] = "set";
  $jsonObject['input']['mac'] = $_GET['mac'];
  $jsonObject['input']['queue'] = $_GET['queue'];

  // Check status
  if (getStatus($_GET['mac'], $_GET['queue'])) {
    $jsonObject['data']['status'] = true;
  } else {
    $jsonObject['data']['status'] = false;
  }

  // Set success value
  $jsonObject['success'] = true;

  // Print out JSON
  printJSONandDie($jsonObject);
