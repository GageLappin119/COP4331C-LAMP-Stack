<?php
    require_once 'db.php';

    // Collect data from front end
    $inData = getRequestInfo();

    // Extracts user details from the array
    $firstName = $inData["firstName"];
    $lastName = $inData["lastName"];
    $userName = $inData["userName"];
    $password = $inData["password"]; // This is the user's plain-text password

    // Checks if the requested username already exists
    $stmt = $conn->prepare("SELECT ID FROM Users WHERE Login = ?");

    // Binds '$userName' to the placeholder
    $stmt->bind_param("s", $userName);

    $stmt->execute();

    $result = $stmt->get_result();

    // If a row was found that means the username already exists
    if ($result->num_rows > 0){
        returnWithError("Username is already taken.");
        $stmt->close();
        $conn->close();
        exit(); 
    }

    $stmt->close();

    // Hashes the given password 
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    // Prepares to insert the login details into the db
    $stmt = $conn->prepare("INSERT INTO Users (FirstName, LastName, Login, Password) VALUES (?, ?, ?, ?)");

    // Binds the placeholds in the prepare to the variables
    $stmt->bind_param("ssss", $firstName, $lastName, $userName, $hashedPassword);

    $stmt->execute();

    // If a row was updated that means insert was successful
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