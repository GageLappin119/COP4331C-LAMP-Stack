<?php
	ini_set('display_errors', 1);
	ini_set('display_startup_errors', 1);
	error_reporting(E_ALL);

	require_once 'db.php';

	$inData = getRequestInfo();

	$login = $inData["userName"];
	$password = $inData["password"];

	$stmt = $conn->prepare("SELECT ID FROM Users WHERE Login = ?");
	$stmt->bind_param("s", $login);
	$stmt->execute();
	$result = $stmt->get_result();

	if ($result->num_rows == 0){
		returnWithError("Username does not exist");
		$stmt->close();
		$conn->close();
		exit();
	}

	$stmt->close();

	$stmt = $conn->prepare("SELECT ID, FirstName, LastName, Password FROM Users WHERE Login = ?");
	$stmt->bind_param("s", $login);
	$stmt->execute();
	$result = $stmt->get_result();

	if ($row = $result->fetch_assoc())
	{
		if (password_verify($password, $row["Password"])){
			$responseData = [
				"id" => $row["ID"],
				"FirstName" => $row["FirstName"],
				"LastName" => $row["LastName"]
			];

			sendResultInfoAsJson(json_encode($responseData));
		}
		else
		{
			returnWithError("Incorrect password");
			$stmt->close();
			$conn->close();
			exit();
		}
	}
	else
	{
		returnWithError("User not found");
		$stmt->close();
		$conn->close();
		exit();
	}

	$stmt->close();	
	$conn->close();
?>