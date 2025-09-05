<?php
	require_once 'db.php';
	
	$inData = getRequestInfo();

	$userID = $inData["UserID"];
	$ID = $inData["ID"];

	$stmt = $conn->prepare("SELECT UserID, ID FROM Contacts WHERE UserID = ?");

	$stmt->bind_param("i", $userID);
	$stmt->execute();

	$result = $stmt->get_result();

	if($result->num_rows == 0)
	{
		returnWithError("Contact to delete doesn't exist");
		$stmt->close();
		$conn->close();
		exit();
	}

	$stmt->close();
	
	$stmt = $conn->prepare("DELETE FROM Contacts WHERE UserID = ? AND ID = ?");
	$stmt->bind_param("ii", $userID, $ID);
	$stmt->execute();

	if($stmt->affected_rows > 0)
	{
		returnWithSuccess("Contact successfully deleted");
	}
	else
	{
		returnWithError("Failed to delete contact");
	}

	$stmt->close();
	$conn->close();
?>
