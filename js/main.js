const urlBase = '/api';
const extension = 'php';

let userID = 0;
let firstName = "";
let lastName = "";

contactList = [];

function signUp() {
    let firstName = document.getElementById("FirstName").value;
    let lastName = document.getElementById("LastName").value;

    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    document.getElementById("signupResult").innerHTML = "";

    if (!firstName || !lastName || !username || !password) {
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

    try {
        xhr.onreadystatechange = function() {
            if (this.readyState != 4) return; 

            if (this.status === 200 || this.status === 201) {
                try {
                    let jsonObject = JSON.parse(this.responseText);

                    if (jsonObject.error && jsonObject.error !== "") {
                            document.getElementById("signupResult").innerHTML = jsonObject.error;
                    } else {
                        document.getElementById("signupResult").innerHTML = "Sign up successful! Redirecting to login...";
                        redirectToLogin();
                    }
                    } catch (e) {
                        document.getElementById("signupResult").innerHTML = "Invalid response from server.";
                        }
                } 
                else if (this.status === 409) {
                document.getElementById("signupResult").innerHTML = "Username already exists.";
                }
                else {
                    document.getElementById("signupResult").innerHTML = "An ERROR occurred: " + this.status;
                }
            };

        
        xhr.send(jsonPayload);
    } catch (err) {
        document.getElementById("signupResult").innerHTML = err.message;
    }
}

function redirectToLogin() {
    setTimeout(function() {
        window.location.href = "login.html";
    }, 2000);
}

function checkLogin() {
    const storedUserString = localStorage.getItem("userInfo");

    if (storedUserString) {
        const user = JSON.parse(storedUserString)

        userID = user.id;
        firstName = user.firstName;
        lastName = user.lastName;

        document.getElementById("userName").innerText = `Logged in as ${firstName} ${lastName}`;
        searchContacts();
    } else {
        window.location.href = "index.html";
    }
}

function doLogin() {
    userID = 0;
    firstName = "";
    lastName = "";
    let login = document.getElementById("LoginName").value;
    let password = document.getElementById("LoginPassword").value;

    document.getElementById("LoginResult").innerHTML = "";

    if (!login || password.length == 0) {
        document.getElementById("LoginResult").innerHTML = "Please enter username and password.";
        return;
    }

    let tmp = { userName: login, password: password };
    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/Login.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                let jsonObject = JSON.parse(xhr.responseText);
                if (jsonObject.error) {
                    document.getElementById("LoginResult").innerHTML = jsonObject.error;
                    return;
                }

                saveUserInfo(jsonObject);
                window.location.href = "contacts.html";
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        document.getElementById("LoginResult").innerHTML = err.message;
    }
}

function doLogout() {
    userID = -1;
    firstName = "";
    lastName = "";

    localStorage.removeItem("userInfo");
    window.location.href = "index.html";
}

function saveUserInfo(userInfo) {
    const userString = JSON.stringify(userInfo);

    localStorage.setItem("userInfo", userString);

    console.log("Value in localStorage is now:", localStorage.getItem("userInfo"));

    userID = userInfo.id;
    firstName = userInfo.firstName;
    lastName = userInfo.lastName;

    console.log("Global userID is now set to:", userID);
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

function addContact() {
    let firstName = document.getElementById("contactFirstName").value.trim();
    let lastName = document.getElementById("contactLastName").value.trim();
    let phone = document.getElementById("contactPhone").value.trim();
    let email = document.getElementById("contactEmail").value.trim();

    // check if fields are empty
    if (!firstName || !lastName || !phone || !email) {
        document.getElementById("AddContactResult").innerHTML = "Please fill in all fields";
        return;
    }

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

    try {
        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                let jsonObject = JSON.parse(xhr.responseText);

                if (jsonObject.error) {
                    document.getElementById("AddContactResult").innerHTML = "Error: " + jsonObject.error;
                } else {
                    document.getElementById("AddContactResult").innerHTML = "Successfully added a new contact";
                    
                    resetContactForm();
                    
                    searchContacts();
                }
            } else {
                document.getElementById("AddContactResult").innerHTML = ": " + this.status;
            }
        }
        xhr.send(jsonPayload);
    } catch (err) {
        document.getElementById("AddContactResult").innerHTML = err.message;
    }
}

function deleteContact(contactId) {
    console.log("Preparing to delete. UserID:", userID, "ContactID:", contactId);

    let tmp = {
        UserID: parseInt(userID, 10),
        ID: parseInt(contactId, 10)
    };

    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/DeleteContact.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try {
        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                let jsonObject = JSON.parse(xhr.responseText);

                if (jsonObject.error) {
                    document.getElementById("searchResult").innerHTML = "API Error: " + jsonObject.error;
                } else {
                    document.getElementById("searchResult").innerHTML = "Successfully deleted a contact";
                    searchContacts();
                }
            } else {
                document.getElementById("searchResult").innerHTML = "An error occurred: " + this.status;
            }
        }
        xhr.send(jsonPayload);
    } catch (err) {
        document.getElementById("searchResult").innerHTML = err.message;
    }
}

function updateContact() {
    let contactID = document.getElementById("contactIdHidden").value.trim();
    let firstName = document.getElementById("contactFirstName").value.trim();
    let lastName = document.getElementById("contactLastName").value.trim();
    let phone = document.getElementById("contactPhone").value.trim();
    let email = document.getElementById("contactEmail").value.trim();
    
    // check if fields are empty
    if (!firstName || !lastName || !phone || !email) {
        document.getElementById("AddContactResult").innerHTML = "Please fill in all fields";
        return;
    }
    
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

    try {
        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                let jsonObject = JSON.parse(xhr.responseText);

                if (jsonObject.error) {
                    document.getElementById("searchResult").innerHTML = "Error: " + jsonObject.error;
                } else {
                    document.getElementById("searchResult").innerHTML = "Successfully edited contact";

                    resetContactForm();

                    searchContacts();
                }
            } else {
                document.getElementById("searchResult").innerHTML = "An error occurred: " + this.status;
            }
        }
        xhr.send(jsonPayload);
    } catch (err) {
        document.getElementById("searchResult").innerHTML = err.message;
    }
}

function searchContacts() {
    let searchInput = document.getElementById("search");
	let search = "";
	
	if(searchInput) {
		search = searchInput.value.trim();
	}
	else {
		search = "";
	}

	let tmp = {
		UserID: userID,
		search: search
	}

	let jsonPayload = JSON.stringify(tmp);

	let url = urlBase + '/SearchContacts.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try {
		xhr.onreadystatechange = function() {
			if (this.readyState != 4) return;
			
			let searchResult = document.getElementById("SearchContactResult");
			
			if (this.status == 200) {
				let res = JSON.parse(xhr.responseText);

				if(res.error) {
					if (searchResult) {
						searchResult.innerHTML = res.error;
					}
					displayContacts([]);
					contactList = [];
					return;	
				}
				
				if(Array.isArray(res.results)) {
					contactList = res.results;
				}
				else {
					contactList = [];
				}
                
				displayContacts(contactList);
				if (searchResult) {
					searchResult.innerHTML = "Contact list updated";
				}
			}
			else{
				if (searchResult){
					searchResult.innerHTML = "An error occurred: " + this.status;
				}
			}
		};
		
		xhr.send(jsonPayload);
	}
	catch (err) {
		let searchResult = document.getElementById("SearchContactResult");
		if (searchResult) {
            searchResult.innerHTML = err.message;
        }
	}
}

function displayContacts(contacts) {
    const contactListContainer = document.getElementById("contactsList");

    contactListContainer.innerHTML = "";

    if (!contacts || contacts.length === 0) {
        contactListContainer.innerHTML = "<p>No contacts found.</p>";
        return;
    }

    // Stores the html for the contacts list
    let allContactsHTML = "";
    // for loop to iterate over every contact and generate html for it
    // Includes edit/delete buttons into the contacts themselves
    contacts.forEach(contact => {
        allContactsHTML += `
            <div class="contact-card">
                <div class="contact-info">
                    <strong>${contact.FirstName} ${contact.LastName}</strong><br>
                    <small>Phone: ${contact.Phone}</small><br>
                    <small>Email: ${contact.Email}</small>
                </div>
                <div class="contact-actions">
                    <button class="secondary" onclick="prepareEdit(${contact.ID})">Edit</button>
                    <button class="secondary" onclick="deleteContactOnClick(${contact.ID})">Delete</button>
                </div>
            </div>
        `;
    });

    contactListContainer.innerHTML = allContactsHTML;
}

// Prepares to edit contact by populating contact info and changing headers
function prepareEdit(contactId) {
    const contactToEdit = contactList.find(contact => contact.ID === contactId);

    if (!contactToEdit) {
        console.error("Could not find contact to edit with ID:", contactId);
        return;
    }

    document.getElementById("contactFirstName").value = contactToEdit.FirstName;
    document.getElementById("contactLastName").value = contactToEdit.LastName;
    document.getElementById("contactPhone").value = contactToEdit.Phone;
    document.getElementById("contactEmail").value = contactToEdit.Email;
    
    document.getElementById("contactIdHidden").value = contactToEdit.ID;

    document.getElementById("formTitle").innerText = "Edit Contact";
    document.getElementById("addEditButton").innerText = "Save Changes";
    document.getElementById("addEditButton").setAttribute("onclick", "updateContact()");
}

// Resets contacts page to default state
// For use when deleting, editing, adding, etc.. 
// Useful to ensure that after you edit/delete a contact you aren't stuck with the old contact or limmited to editing only
function resetContactForm() {
    document.getElementById("contactFirstName").value = "";
    document.getElementById("contactLastName").value = "";
    document.getElementById("contactPhone").value = "";
    document.getElementById("contactEmail").value = "";
    document.getElementById("contactIdHidden").value = "";

    document.getElementById("formTitle").innerText = "Add New Contact";
    document.getElementById("addEditButton").innerText = "Add Contact";
    document.getElementById("addEditButton").setAttribute("onclick", "addContact()");
    document.getElementById("AddContactResult").innerHTML = "";
}

function deleteContactOnClick(contactId) {
    if(!confirm("Are you sure you want to delete this contact?")) {
        return;
    }
    deleteContact(contactId);
}
