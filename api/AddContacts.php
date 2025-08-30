<?php
	ini_set('display_errors', 1);
	ini_set('display_startup_errors', 1);
	error_reporting(E_ALL);

	require_once 'db.php';

	$inData = getRequestInfo();


	if (isset($stmt)) {
		$stmt->close();
	}
	$conn->close();
?>