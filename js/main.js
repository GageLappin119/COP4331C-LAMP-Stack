const urlBase = '';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";

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
			if(this.readyState != 4){
				return;
			}
			if(this.status == 409){
				document.getElementById("signupResult").innerHTML = "Username already exists.";
				return;
			}
			
			if(this.status == 201){
				let resp = {};
				try {resp = JSON.parse(xhr.responseText); } catch{}
				
				if(resp.error){
					document.getElementById("signupResult").innerHTML = resp.error || "Registration failed.";
					return;
				}

				document.getElementById("signupResult").innerHTML = "User created.";
			}
			
			else{
				document.getElementById("signupResult").innerHTML = "Signup Failed: " + this.status;
			}
					
		};
		
		xhr.send(jsonPayload);
	}
	catch(err){
		document.getElementById("signupResult").innerHTML = err.message;
	}
}

function doLogin()
{
  userId = 0;
	firstName = "";
	lastName = "";
	let login = document.getElementById("LoginName").value;
	let password = document.getElementById("LoginPassword").value;

	document.getElementById("LoginResult").innerHTML = "";
	
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
      
				userId = jsonObject.id;

				if(userId < 1) {
					document.getElementById("LoginResult").innerHTML = "User/Password combination incorrect";
					return;
				}
				
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();
			
				window.location.href = "contacts.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err){
		document.getElementById("loginResult").innerHTML = err.message;
	}
}

function saveCookie()
{
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime() + (minutes * 60 * 1000));
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + id +";expires=" + date.toGMTString();
}

function readCookie()
{
	userId = -1;
	let data = document.cookie;
	let splits = data.split(",");
	for(var i = 0; i < splits.length; i++)
	{
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		if( tokens[0] == "firstName")
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName")
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId")
		{
			userId = parseInt(tokens[1].trim());
		}
	}

	if(userId < 0)
	{
		window.location.href = "index.html";
	}
	else
	{
		document.getElementById("username").innerHTML = "Logged in as " + firstName + " " + lastName;
	}
}

function doLogout()
{
  userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName = ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

//TODO
function addContact()
{
  let firstName = document.getElementById("contactFirstName").value.trim();
	let lastName = document.getElementById("contactLastName").value.trim();
	let phone = document.getElementById("contactPhone").value.trim();
	let email = document.getElementById("contactEmail").value.trim();

	let tmp = {
		userId: userId,
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
			if(this.readyState == 4 && this.status == 200){
}

function deleteContact()
{

}

function updateContact()
{

}

function searchContact()
{

}
