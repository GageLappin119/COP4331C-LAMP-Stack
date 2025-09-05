<?php
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");

    if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
        exit(0);
    }

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

	function returnWithSuccess($messsage){
		$retVal = ['error' => '', 'message' =>$message];
		sendResultInfoAsJson(json_encode($retVal));
	}
?>
