<?php
	$db_host = "localhost";
	$db_user = "ContactUser";
	$db_pass = "DontBl1nk@ng3lsRn3@r";
	$db_name = "ContactManagerDB";

	$conn = new mysqli($db_host, $db_user, $db_pass, $db_name);

	if ($conn->connect_error)
	{
		returnWithError($conn->connect_error);
	}

	function getRequestInfo()
	{
        $contents = file_get_contents('php://input');
        $decoded = json_decode($contents, true);

		return $decoded; 
	}

	function sendResultInfoAsJson($obj)
	{
        header('Content-type: application/json');
        echo($obj);
	}

	function returnWithError($err)
	{
        $retVal = ['error' => $err];
        $jsonReply = json_encode($retVal);

        sendResultInfoAsJson($jsonReply);
	}
?>