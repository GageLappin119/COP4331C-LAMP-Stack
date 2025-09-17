<?php
	require_once 'db.php';
	
	$inData = getRequestInfo();

	$userID = $inData["UserID"];
	$ID = $inData["ID"];

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

