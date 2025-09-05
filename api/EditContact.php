<?php
	require_once 'db.php';
	
	$inData = getRequestInfo();

	$ID = $inData["ID"];
	$userID = $inData["UserID"];
	$firstName = $inData["FirstName"];
	$lastName = $inData["LastName"];
	$phoneNumber = $inData["Phone"];
	$emailAddress = $inData["Email"];

	$stmt = $conn->prepare("SELECT UserID, ID FROM Contacts WHERE UserID = ? AND ID = ?");

	$stmt->bind_param("ii", $userID, $ID);
	$stmt->execute();

	$result = $stmt->get_result();

	if($result->num_rows == 0)
	{
		returnWithError("Contact to edit doesn't exist");
		$stmt->close();
		$conn->close();
		exit();
	}

	$stmt->close();

	$stmt = $conn->prepare("UPDATE Contacts Set FirstName = ?, LastName = ?, Phone = ?, Email = ? WHERE UserID = ? AND ID = ?");
	$stmt->bind_param("ssssii", $firstName, $lastName, $phoneNumber, $emailAddress, $userID, $ID);

	$stmt->execute();

	if($stmt->affected_rows > 0)
	{
		returnWithSuccess("Successfully edited Contact");
	}
	else
	{
		returnWithError("Failed to edit contact");
	}
	
	$stmt->close();
	$conn->close();
?>
