<?php
    require_once 'db.php';

    $inData = getRequestInfo();

    $firstName = $inData["firstName"];
    $lastName = $inData["lastName"];
    $userName = $inData["userName"];
    $password = $inData["password"];

    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
    $stmt = $conn->prepare("SELECT ID FROM users where userName = ?");
    $stmt->bind_param("s", $userName);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0){
        returnWithError("Username is already taken.");
        $stmt->close();
        $conn->close();
        exit();
    }

    $stmt->close();

    $stmt = $conn->prepare("INSERT INTO Users (FirstName, LastName, UserName, Password) VALUES (?, ?, ?, ?)");

    $stmt->bind_param("ssss", $firstName, $lastName, $userName, $hashedPassword);

    $stmt->execute();

    if ($stmt->affected_rows > 0) 
    {
        returnWithError(""); 
    } 
    else 
    {
        returnWithError("Registration failed.");
    }

    $stmt->close();
    $conn->close();
?>