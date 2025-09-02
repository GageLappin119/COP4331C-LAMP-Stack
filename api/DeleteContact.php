<?php
	require_once 'db.php';
	
	$inData = getRequestInfo();

	$contactID = $inData["ContactID"];

	$stmt = $conn->prepare("DELETE FROM Contacts WHERE ID = ?");
	$stmt->bind_param("i", $contactID);
	$stmt->execute();
	$stmt->close();
	$conn->close();
	returnWithError("");
?>
