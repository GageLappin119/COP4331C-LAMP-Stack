const urlBase = '';
const extension = 'php';

let userID = 0;
let firstName = "";
let lastName = "";

contactList = [];

function signUp()
{
  	let firstName = document.getElementById("FirstName").value;
	let lastName = document.getElementById("LastName").value;

	let username = document.getElementById("username").value;
	let password = document.getElementById("password").value;
	
	document.getElementById("signupResult").innerHTML = "";

	if(!firstName || !lastName || !username || !password) {
		document.getElementById("signupResult").innerHTML = "Please fill in all fields.";
		return;
	}

	let tmp = {
		firstName: firstName,
		lastName: lastName,	
		userName: username,
		password: password
	};
	
	let jsonPayload = JSON.stringify(tmp);

	let url = urlBase + '/SignUp.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	
	try{
		xhr.onreadystatechange = function(){
			if(this.readyState == 4){
				if(this.status == 200){
					let jsonObject = JSON.parse(xhr.responseText);

					if (jsonObject.error){
						document.getElementById("signupResult").innerHtml = jsonObject.error;
					}
					else
					{
						document.getElementById("signupResult").innerHTML = "Sign up successful! Redirecting to login...";
						redirectToLogin();
					}
				}				
				else{
					document.getElementById("signupResult").innerHTML = "An error occurred: " + this.status;
				}
			}
		};
		
		xhr.send(jsonPayload);
	}
	catch(err){
		document.getElementById("signupResult").innerHTML = err.message;
	}
}

function redirectToLogin()
{
	setTimeout(function(){
		window.location.href = "index.html";
	}, 2000);
}

function checkLogin(){
	const storedUserString = localStorage.getItem("userInfo");

	if (storedUserString)
	{
		const user = JSON.parse(storedUserString)

		userID = user.id;
		firstName = user.firstName;
		lastName = user.lastName;

		document.getElementById("userName").innerText = `Logged in as ${firstName} ${lastName}`;
		searchContacts();
	}
	else
	{
		window.location.href = "index.html";
	}
}

function doLogin()
{
  	userID = 0;
	firstName = "";
	lastName = "";
	let login = document.getElementById("LoginName").value;
	let password = document.getElementById("LoginPassword").value;

	document.getElementById("LoginResult").innerHTML = "";

	if(!login || password.length == 0){
		document.getElementById("LoginResult").innerHTML = "Please enter username and password.";
		return;
	}
	
	let tmp = {userName:login, password:password};
	let jsonPayload = JSON.stringify(tmp);

	let url = urlBase +'/Login.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset = UTF-8");
	try{
		xhr.onreadystatechange = function() {
			if(this.readyState == 4 && this.status == 200){
				let jsonObject = JSON.parse(xhr.responseText);
				if(jsonObject.error){
					document.getElementById("LoginResult").innerHTML = jsonObject.error;
					return;
				}
      
				saveUserInfo(jsonObject);
				window.location.href = "contacts.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err){
		document.getElementById("LoginResult").innerHTML = err.message;
	}
}

function doLogout()
{
	userID = -1;
	firstName = "";
	lastName = "";

	localStorage.removeItem("userInfo");
	window.location.href = "index.html";
}

function saveUserInfo(userInfo){
	const userString = JSON.stringify(userInfo);

	localStorage.setItem("userInfo", userString);

	userID = userInfo.id;
    firstName = userInfo.firstName;
    lastName = userInfo.lastName;
}

// function saveCookie()
// {
// 	let minutes = 20;
// 	let date = new Date();
// 	date.setTime(date.getTime() + (minutes * 60 * 1000));
// 	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userID=" + id +";expires=" + date.toGMTString();
// }

// function readCookie()
// {
// 	userID = -1;
// 	let data = document.cookie;
// 	let splits = data.split(",");
// 	for(var i = 0; i < splits.length; i++)
// 	{
// 		let thisOne = splits[i].trim();
// 		let tokens = thisOne.split("=");
// 		if( tokens[0] == "firstName")
// 		{
// 			firstName = tokens[1];
// 		}
// 		else if( tokens[0] == "lastName")
// 		{
// 			lastName = tokens[1];
// 		}
// 		else if( tokens[0] == "userID")
// 		{
// 			userID = parseInt(tokens[1].trim());
// 		}
// 	}

// 	if(userID < 0)
// 	{
// 		window.location.href = "index.html";
// 	}
// 	else
// 	{
// 		document.getElementById("username").innerHTML = "Logged in as " + firstName + " " + lastName;
// 	}
// }

// function doLogout()
// {
//   	userID = 0;
// 	firstName = "";
// 	lastName = "";
// 	document.cookie = "firstName = ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
// 	window.location.href = "index.html";
// }

function addContact()
{
  	let firstName = document.getElementById("contactFirstName").value.trim();
	let lastName = document.getElementById("contactLastName").value.trim();
	let phone = document.getElementById("contactPhone").value.trim();
	let email = document.getElementById("contactEmail").value.trim();

	let tmp = {
		UserID: userID,
		FirstName: firstName,
		LastName: lastName,
		Phone: phone,
		Email: email
	};

	let jsonPayload = JSON.stringify(tmp);

	let url = urlBase + '/AddContacts.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try{
		xhr.onreadystatechange=function() {
			if(this.readyState == 4 && this.status == 200)
			{
				let jsonObject = JSON.parse(xhr.responseText);
				
				if (jsonObject.error){
					document.getElementById("AddContactResult").innerHTML = "An error occured: " + this.status;
				}
				else
				{
					document.getElementById("AddContactResult").innerHTML = "Successfully added a new contact";
					updateContactList();
				}
			}
			else
			{
				document.getElementById("AddContactResult").innerHTML = "An error occurred: " + this.status;
			}
		}
		xhr.send(jsonPayload);
	}
	catch(err){
		document.getElementById("AddContactResult").innerHTML = err.message;
	}
}

function deleteContact()
{
  	let ID = document.getElementById("contactID").value.trim();

	let tmp = {
		userID: userID,
		ID: ID
	};

	let jsonPayload = JSON.stringify(tmp);

	let url = urlBase + '/DeleteContact.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try{
		xhr.onreadystatechange=function() {
			if(this.readyState == 4 && this.status == 200)
			{
				let jsonObject = JSON.parse(xhr.responseText);
				
				if (jsonObject.error){
					document.getElementById("DeleteContactResult").innerHTML = "An error occured: " + this.status;
				}
				else
				{
					document.getElementById("DeleteContactResult").innerHTML = "Successfully deleted a contact";
					updateContactList();
				}
			}
			else
			{
				document.getElementById("DeleteContactResult").innerHTML = "An error occurred: " + this.status;
			}
		}
		xhr.send(jsonPayload);
	}
	catch(err){
		document.getElementById("DeleteContactResult").innerHTML = err.message;
	}
}

function updateContact()
{
	let contactID = document.getElementById("contactID").value.trim();
  	let firstName = document.getElementById("contactFirstName").value.trim();
	let lastName = document.getElementById("contactLastName").value.trim();
	let phone = document.getElementById("contactPhone").value.trim();
	let email = document.getElementById("contactEmail").value.trim();

	let tmp = {
		ID: contactID,
		UserID: userID,
		FirstName: firstName,
		LastName: lastName,
		Phone: phone,
		Email: email
	};

	let jsonPayload = JSON.stringify(tmp);

	let url = urlBase + '/EditContact.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try{
		xhr.onreadystatechange=function() {
			if(this.readyState == 4 && this.status == 200)
			{
				let jsonObject = JSON.parse(xhr.responseText);
				
				if (jsonObject.error){
					document.getElementById("EditContactResult").innerHTML = "An error occured: " + this.status;
				}
				else
				{
					document.getElementById("EditContactResult").innerHTML = "Successfully added a new contact";
					updateContactList();
				}
			}
			else
			{
				document.getElementById("EditContactResult").innerHTML = "An error occurred: " + this.status;
			}
		}
		xhr.send(jsonPayload);
	}
	catch(err){
		document.getElementById("EditContactResult").innerHTML = err.message;
	}
}

function updateContactList()
{
	// redisplays the contact list upon add, delete, update, search etc...
}

function displayContacts(contacts)
{
	// creates a html display for each contact passed through
}

function searchContacts()
{
  	let search = document.getElementById("search").value.trim();


	let tmp = {
		userID: userID,
		search: search
	};

	let jsonPayload = JSON.stringify(tmp);

	let url = urlBase + '/SearchContacts.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try{
		xhr.onreadystatechange=function() {
			if(this.readyState == 4 && this.status == 200)
			{
				let jsonObject = JSON.parse(xhr.responseText);
				
				if (jsonObject.error){
					document.getElementById("SearchContactResult").innerHTML = "An error occured: " + this.status;
				}
				else
				{
					document.getElementById("SearchContactResult").innerHTML = "Search successful";
					displayContacts(jsonObject.results);
					updateContactList();
				}
			}
			else
			{
				document.getElementById("SearchContactResult").innerHTML = "An error occurred: " + this.status;
			}
		}
		xhr.send(jsonPayload);
	}
	catch(err){
		document.getElementById("SearchContactResult").innerHTML = err.message;
	}
}
