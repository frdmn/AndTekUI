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

  // Check for ?status GET parameter
  if (!isset($_GET['status'])) {
    $jsonObject['message'] = 'Missing ?status=queueStatus parameter';
    printJSONandDie($jsonObject);
  }

  // Also return input variables
  $jsonObject['method'] = "set";
  $jsonObject['input']['mac'] = $_GET['mac'];
  $jsonObject['input']['queue'] = $_GET['queue'];
  $jsonObject['input']['status'] = $_GET['status'];

  // Check status
  if(setStatus($_GET['mac'], $_GET['queue'], $_GET['status'])) {
    $jsonObject['success'] = true;
    $jsonObject['data']['status'] = filter_var($_GET['status'], FILTER_VALIDATE_BOOLEAN); ;
  } else {
    $jsonObject['success'] = false;
  }

  // Print out JSON
  printJSONandDie($jsonObject);
