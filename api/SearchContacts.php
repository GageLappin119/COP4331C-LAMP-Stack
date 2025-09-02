<?php
	require_once 'db.php';

	$inData = getRequestInfo();

	$searchResults = "";
	$searchCount = 0;

	$stmt = $conn->prepare("SELECT FirstName, LastName, PhoneNumber, EmailAddress FROM Contacts WHERE(FirstName LIKE ? OR LastName LIKE ?) AND ID = ?");

	$search = "%" . $inData["search"] . "%";
	$stmt->bind_param("ssi", $search, $search, $inData["ContactID"]);
	$stmt->execute();
	
	$result = $stmt->get_result();

	while($row = $result->fetch_assoc()){
		if($searchCount > 0){
			$searchResults .= ",";
		}
		
		$searchCount++;
		
		$searchResults .= '{"FirstName" : "' . $row["FirstName"] . '", "LastName" : "' . $row["LastName"] . '", "PhoneNumber" : "' . $row["PhoneNumber"] . '", "Email" : "' . $row["EmailAddress"] . '"}';

	}

	if($searchCount == 0){
		returnWithError("No Records Found");
	}
	else{
		sendResultInfoAsJson(json_encode($searchResults));
	}
	
	$stmt->close();
	$conn->close();
}

?>
