<?php
	require_once 'db.php';

	// Gathers input data from frontend into an array
	$inData = getRequestInfo();

	// Extracts username/password from the input data
	$login = $inData["userName"];
	$password = $inData["password"];

	// Prepares to search the db for a user that matches
	$stmt = $conn->prepare("SELECT ID, FirstName, LastName, Password FROM Users WHERE Login = ?");

	// Points the ? from previous statement to the $login variable
	$stmt->bind_param("s", $login);
	$stmt->execute();
	$result = $stmt->get_result();

	// Checks if a user was found, if not return with error
	if( $row = $result->fetch_assoc()  )
	{
		// A user was found, compare the given password with the stored password
		// if they match, login successful
		if( password_verify($password, $row['Password']) )
		{
			$responseData = [
				'id'        => $row['ID'],
				'firstName' => $row['FirstName'],
				'lastName'  => $row['LastName'],
				'error'     => ''
			];
			sendResultInfoAsJson( json_encode($responseData) );
		}
		else
		{
			returnWithError("Password incorrect.");
		}
	}
	else
	{
		returnWithError("UserName incorrect.");
	}

	$stmt->close();
	$conn->close();
?>