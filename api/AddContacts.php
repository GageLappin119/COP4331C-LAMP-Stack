<?php
	require_once 'db.php';
	
	$inData = getRequestInfo();
	$firstName = $inData["FirstName"];
	$lastName = $inData["LastName"];
	$phoneNumber = $inData["PhoneNumber"];
	$emailAddress = $inData["EmailAddress"];
	$contactID = $inData["ContactID"];

	$stmt = $conn->prepare("INSERT into Contacts (FirstName, LastName, PhoneNumber, EmailAddress, ContactID) VALUES (?,?,?,?,?)");
	$stmt -> bind_param("ssssi" , $firstName, $lastName, $phoneNumber, $emailAddress, $contactID);
	$stmt->execute();
	$stmt->close();
	$conn->close();
	returnWithError("");

?>
