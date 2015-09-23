<?php
  include_once('../functions.php');

  // Set defaults
  $jsonObject['success'] = false;

  // Also return input variables
  $jsonObject['method'] = "status";

  // Check status
  if (testServerConnection()) {
    $jsonObject['data']['status'] = true;
  } else {
    $jsonObject['data']['status'] = false;
    $jsonObject['message'] = "Couldn't establish AndTek connection";
  }

  // Set success value
  $jsonObject['success'] = true;

  // Print out JSON
  printJSONandDie($jsonObject);
