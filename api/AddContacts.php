<?php
	require_once 'db.php';
	
	$inData = getRequestInfo();

	$userID = $inData["UserID"];
	$firstName = $inData["FirstName"];
	$lastName = $inData["LastName"];
	$phoneNumber = $inData["Phone"];
	$emailAddress = $inData["Email"];

	$stmt = $conn->prepare("SELECT UserID FROM Contacts WHERE UserID = ? AND FirstName = ? AND LastName= ?");
 
	$stmt->bind_param("iss", $userID, $firstName, $lastName);

	$stmt->execute();

	$result = $stmt->get_result();

	if ($result->num_rows > 0)
	{
		returnWithError("Contact already exists");
		$stmt->close();
		$conn->close();
		exit();
	}

	$stmt->close();

	$stmt = $conn->prepare("INSERT INTO Contacts (UserID, FirstName, LastName, Phone, Email) VALUES (?,?,?,?,?)");
	$stmt -> bind_param("issss" , $userID, $firstName, $lastName, $phoneNumber, $emailAddress);

	$stmt->execute();

	if($stmt->affected_rows > 0)
	{
		returnWithError("Successfully added a contact");
	}
	else
	{
		returnWithError("Failed to add a contact");
	}

	$stmt->close();
	$conn->close();
?>
