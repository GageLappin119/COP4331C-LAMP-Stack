<?php
	require_once 'db.php';
	
	$inData = getRequestInfo();

	$contactID = $inData["ContactID"];
	$emailAddress = $inData["EmailAddress"];
	$firstName = $inData["FirstName"];
	$lastName = $inData["LastName"];
	$phoneNumber = $inData["PhoneNumber];

	$stmt = $conn->prepare("UPDATE Contacts Set FirstName = ?, LastName = ?, PhoneNumber = ?, EmailAddress = ? WHERE ID = ?);
	$stmt->bind_param("ssssi", $firstName, $lastName, $phoneNumber, $emailAddress, $contactID);
	$stmt->execute();
	$stmt->close();
	$conn->close();
	returnWithError("");

?>
