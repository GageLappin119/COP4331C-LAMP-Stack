<?php
	require_once 'db.php';
	
	$inData = getRequestInfo();

	$userID = (int) $inData["UserID"];
	$ID = (int) $inData["ID"];

	error_log("DeleteContact Final Check: UserID is " . $userID . " (type: " . gettype($userID) . "), ID is " . $ID . " (type: " . gettype($ID) . ")");

	$stmt = $conn->prepare("SELECT ID FROM Contacts WHERE ID = ? AND UserID = ?");
	$stmt->bind_param("ii", $ID, $userID); 
	$stmt->execute();
	$result = $stmt->get_result();

	if($result->num_rows == 0)
	{
		returnWithError("Contact to delete does not exist");
		$stmt->close();
		$conn->close();
		exit();
	}
	$stmt->close();

	$stmt = $conn->prepare("DELETE FROM Contacts WHERE ID = ? AND UserID = ?");
	$stmt->bind_param("ii", $ID, $userID); 
	$stmt->execute();

	if($stmt->affected_rows > 0)
	{
		returnWithError(""); 
	}
	else
	{
		returnWithError("Failed to delete contact.");
	}

	$stmt->close();
	$conn->close();
?>

