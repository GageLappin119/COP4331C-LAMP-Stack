<?php
	require_once 'db.php';

	$inData = getRequestInfo();

	$userID = $inData["UserID"];
	$search = $inData["search"];

	$partialMatch = "%".$search."%";

	$stmt = $conn->prepare("SELECT ID, FirstName, LastName, Phone, Email FROM Contacts WHERE (FirstName LIKE ? OR LastName LIKE ?) AND UserID = ?");

	$stmt->bind_param("ssi", $partialMatch, $partialMatch, $userID);

	$stmt->execute();
	
	$result = $stmt->get_result();
	$searchResults = [];

	while($row = $result->fetch_assoc()){
		$searchResults[] = $row;
	}

	$responseData = ['results' => $searchResults, 'error' => ''];

	sendResultInfoAsJson(json_encode($responseData));
	
	$stmt->close();
	$conn->close();
?>
