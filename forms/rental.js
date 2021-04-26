/*jsonfilehandler.js*/

"use strict;"

// Declare some global variables
var xhr = new XMLHttpRequest();
var dataSet = [];
var found = [];

var currentRecord = {};

window.onload = initializeWebpage;
function initFunction() {
    var toDay = new Date();

    document.getElementById("dtfield").innerHTML = toDay;

}
setInterval("initializeWebpage()", 1000);
function initializeWebpage() {
	var toDay = new Date();

	document.getElementById("dtfield").innerHTML = toDay;

	if (document.createElement("template").content) {
		console.log("Your browser supports templates!");
	} else {
		console.log("Your browser does not support templates!");
	}

	//event listeners for onkeyup
	document.getElementById("lastname").addEventListener("keyup", function () { searchLastname(this.value);toggleElementClass('rentalform', 'hidden', true); }, false);


	loaddata();
}

function loaddata() {
	xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function () {
		if (xhr.readyState == 4 && xhr.status == 200) {
			dataSet = JSON.parse(xhr.responseText);
		}
	};
	xhr.open("GET", "../rentalclients.json", true);
	xhr.send();

}

// function SearchResultHeaders() {
// 	var htmlFragment = `
// 	<tr><th>Full Name</th><th>Address</th><th>City </th><th>ID Number</th><th>Company</th></tr>";
// 	`;
// 	return htmlFragment;
// }

function setElementInnerHTML(id, htmlFragment) {
	var element = document.getElementById(id);
	if (element && element.innerHTML !== undefined) {
		element.innerHTML = htmlFragment;
	}
	else {
		console.log(`Could not find element id='${id} on the web page`);
	}
	return element;
}

function toggleElementClass(id, className, force) {
	var element = document.getElementById(id);
	if (element && element.classList !== undefined) {
		element.classList.toggle(className, force);
	}
	else {
		console.log(`Could not find element id='${id} on the card`);
	}
	return element;
}

function clearCardCollection(id) {
	var element = document.getElementById(id);
	if (element) {
		element.innerHTML = "";
	}
}

function addCardToCollection(id, card) {
	var element = document.getElementById(id);
	if (element) {
		element.appendChild(card);
	}
}

function getNewCard(templateId, newCardId) {
	// see https://www.w3schools.com/tags/tag_template.asp
	var cardTemplate = document.getElementById(templateId);
	if (cardTemplate && cardTemplate.content !== undefined) {
		// Make a clone of the template
		var newCard = null;
		// Find the first child node that is and element (nodeType = 1) and clone it
		// see https://www.w3schools.com/jsref/prop_node_nodetype.asp
		for (let idx = 0; idx < cardTemplate.content.childNodes.length; idx++) {
			if (cardTemplate.content.childNodes[idx].nodeType === 1) {
				newCard = cardTemplate.content.childNodes[idx].cloneNode(true);
				if (newCard) {
					// Populate the id
					newCard.setAttribute('id', newCardId);
					break;
				}
			}
		}
	}
	else {
		console.log(`Could not find template card id='card-template'`);
	}
	return newCard;
}

function setCardElementValue(card, className, htmlFragment) {
	var element = card.getElementsByClassName(className);
	if (element && element.length > 0) {
		element[0].innerHTML = htmlFragment;
	}
	else {
		console.log(`Could not find element id='${className}' on the card`);
	}
	return element;
}


function searchLastname(lastname) {
	debugger
	ToggleClassState('results','hidden',false)
	ToggleClassState('searchvalue','hidden',false)
	setElementInnerHTML("searchvalue", `Search by Last Name ${lastname}
			
	</br><input type="button" value="Not a Client" onclick="LoadItemIntoForm(-1)">`);
	toggleElementClass('output-area', 'hidden', false);
	toggleElementClass('rentalform', 'hidden', false);
	clearCardCollection('cards');
	if (lastname && lastname.length > 0) {
		// create a card for output
		var searchname;
		var matchNumber = 0;
		lastname = lastname.toLowerCase();
		found == [];

		for (var idx = 0; idx < dataSet.length; idx++) {
			var obj = dataSet[idx];
			searchname = obj.last_name;
			var foundAt = searchname.toLowerCase().indexOf(lastname);
			if (foundAt == 0) {
				found[matchNumber] = obj
				var newCardId = `card-${matchNumber}`;
				var newCard = getNewCard('card-template', newCardId);
				if (newCard) {
					// Copy the template
					setCardElementValue(newCard, 'card-id', (matchNumber + 1))
					setCardElementValue(newCard, 'card-lastname', obj.last_name)
					setCardElementValue(newCard, 'card-firstname', obj.first_name)
					setCardElementValue(newCard, 'card-address', obj.address)
					setCardElementValue(newCard, 'card-state_prov', obj.state_prov)
					setCardElementValue(newCard, 'card-email', obj.email)
					setCardElementValue(newCard, 'card-phone', obj.phone) 
					var choose = `<span class="orderforcustomer" onclick="LoadItemIntoForm(${matchNumber})">order for this client</span>`
					setCardElementValue(newCard, 'card-choose', choose)
					// Add the new card to the collection
					addCardToCollection('cards', newCard);
				}
				else {
					console.log(`Could not create new card template`);
				}
				matchNumber++;
			}
		}
		if (matchNumber == 0) {
			setElementInnerHTML('cards', `No matches found for '${lastname}'`);
		}
	}
}
function ToggleClassState(id, toggleClass, force) {
    var inputElement = document.getElementById(id);
    if (inputElement) {
        // Toggle the Class 
        inputElement.classList.toggle(toggleClass, force);
    }
}
function LoadItemIntoForm(idx) {
	debugger
	ToggleClassState('results','hidden',true)
	ToggleClassState('rentalform','hidden',false)
	ToggleClassState("searchvalue",'hidden',true);
	
	if(found[idx]){
	currentRecord = found[idx];
	}else{
		currentRecord = {}
	}
	getFormtOn();
}

function getFormtOn() {
	var ajaxCall1 = new XMLHttpRequest();

	// Setup the callback function
	ajaxCall1.onreadystatechange = function () {
		if (ajaxCall1.readyState == 4 && ajaxCall1.status == 200) {
			document.getElementById('rentalform').innerHTML = ajaxCall1.responseText;
			var elementOnWebpage2 = document.getElementById("fullname");

			//debugger
			if (elementOnWebpage2 && elementOnWebpage2.innerHTML !== undefined) {
			if(currentRecord && currentRecord.last_name!=undefined){
			elementOnWebpage2.innerHTML = `	<h2 class="label-question">Client info</h2>
			<div><labe id="infolabel">Name    : </label><input id='fullnames' type="text" disabled value="${currentRecord.last_name + " " + currentRecord.first_name}"></div>
			<div><labe id="infolabel">Address    :</label> <input id='address' type="text" disabled value="${currentRecord.address}"></div>
			<div><labe id="infolabel">Province    :</label> <input id='state_prov' type="text" disabled value="${currentRecord.state_prov}"></div>
			<div><labe id="infolabel">Email    :</label> <input id='emails' type="text" disabled value="${currentRecord.email}"></div>
			<div><labe id="infolabel">Contact    :</label><input id='phone' type="text" disabled value="${currentRecord.phone}"></div> `;
		}else{
			currentRecord={}
			elementOnWebpage2.innerHTML = `	<h2 class="label-question">Client info</h2>
			<div><labe id="infolabel">Name    : </label><input required id='fullnames' type="text"></div>
			<div><labe id="infolabel">Address    :</label> <input required id='address' type="text"></div>
			<div><labe id="infolabel">Province    :</label> <input required id='state_prov' required type="text" ></div>
			<div><labe id="infolabel">Email    :</label> <input required id='emails' type="text" ></div>
			<div><labe id="infolabel">Contact    :</label><input  required id='phone' type="text" ></div> `;
		}
				// Retrieve the item from the array
			}
		}
	};
	// Indicate the URL to the form we want to load
	ajaxCall1.open("GET", "./form.html", true);
	ajaxCall1.send();
}
function UpdateFormFieldValue(id, newValue) {
	var elementOnForm = document.getElementById(id);
	if (elementOnForm && elementOnForm.value !== undefined) {
		elementOnForm.value = newValue;
	}
}
function calctotal() {
	//get data from the form
	//  debugger



	// debugger
	var days = RetrieveInputValue('days')



	// debugger
	var daily = RetrieveRadioButtonValue('cartype')

	var value = RetrieveCheckBoxValues('options')
	var roof = 0;
	var gps = 0;
	var childseat = -1;
	for (var idx = 0; idx < value.length; idx++) {
		if (value[idx] == 5) {
			roof = 5;
		} else if (value[idx] == 10) {
			gps = 10;
		} else if (value[idx] == 0) {
			childseat = 0
		}
	}
	var total = parseFloat(days)* (parseFloat(daily) + parseFloat(roof)) + parseFloat(gps)



	console.log("The total of your order is " + total + "Topping");
	var fragAdditional = ""
	var checkboxGrouping = document.getElementsByName('options');
	if (checkboxGrouping[0]
		&& checkboxGrouping[0].value !== undefined
		&& checkboxGrouping[0].checked !== undefined) {
		if (checkboxGrouping[0].checked) {
			fragAdditional = fragAdditional + `
				<div class="rows">
			<span id="options">Roof Rack or Bicycle Rack</span> 
			<span id="choice">$5/day</span>
			</div>
			<div class="rows">
			<span id="options">sub-total charge For Roof addition</span> 
			<span id="choice" class="subtotal">$${5*days}</span>
			</div>`;
		}
	}

	if (checkboxGrouping[1]
		&& checkboxGrouping[1].value !== undefined
		&& checkboxGrouping[1].checked !== undefined) {
		if (checkboxGrouping[1].checked) {
			fragAdditional = fragAdditional + `
				<div class="rows">
				<span id="options"> GPS extra</span> 
				<span id="choice">$10</span>
				</div>`;
		}
	}
	if (checkboxGrouping[2]
		&& checkboxGrouping[2].value !== undefined
		&& checkboxGrouping[2].checked !== undefined) {
		if (checkboxGrouping[2].checked) {
			fragAdditional = fragAdditional + `
				<div class="rows">
				<span id="options">  Child Seat </span> 
				<span id="choice">Free</span>
				</div>`;
		}
	}

	var cartype = ""
	if (daily == 15) {
		cartype = "Compact ($15/day)"
	}
	else if (daily == 20) {
		cartype = "Mid-size ($20/day)"
	}
	else if (daily == 40) {
		cartype = "Van/Truck ($35/day)"
	}
	else if (daily == 35) {
		cartype = "Luxury ($40/day)"
	}
	var fragmentLine = "";
	
		var fragmentLine = fragmentLine + `
	
		<div class="rows">
		<span id="options"> Rental Choices</span> 
		<span id="choice"> ${cartype}  </span>

	
		</div>	
	
		<div class="rows">
		<span id="options"> Days of Rental</span> 
		<span id="choice"> ${days}  days  </span>
		
		</div>	
		<div class="rows">
		<span id="options">Sub-total for original charge</span> 
		<span id="choice" class="subtotal"> $${daily*days}  </span>
		</div>	
			 `+  fragAdditional;
	

     if (currentRecord && currentRecord.last_name==undefined){
		 debugger
		 currentRecord.fullname=RetrieveInputValue('fullnames');
		 var fullnames=currentRecord.fullname
		 currentRecord.address=RetrieveInputValue('address');
		 currentRecord.state_prov=RetrieveInputValue('state_prov');
		 currentRecord.email=RetrieveInputValue('emails');
		 var emails=currentRecord.email
		 currentRecord.phone=RetrieveInputValue('phone');
		
	 }else{
		 currentRecord.fullname=currentRecord.last_name + " " + currentRecord.first_name;
	 }
	
	fragmentLine = `<div id="invoice"> ${fragmentLine} <div class="rows"> <span id="options">Total Amount is	</span> <span id="choice" class="total">$ ${total} </span> 	</div> `;
	var htmlFragment = `<h1 >Invoice</h1>
		<div>Name    : ${currentRecord.fullname}</div>
		<div>Address : ${currentRecord.address}</div>
		<div>Province: ${currentRecord.state_prov}</div>
		<div>Email   : ${currentRecord.email}</div>
		<div>Contact : ${currentRecord.phone}</div>
		<h3>The Order Detail:</h3>
	
		${fragmentLine}`

	var elementOnWebpage = document.getElementById("orderdetail");
	if (elementOnWebpage && elementOnWebpage.innerHTML !== undefined) {
		// debugger
		if (total != 0) {
			elementOnWebpage.innerHTML = htmlFragment;
		}
		else elementOnWebpage.innerHTML = "You have to order something before submit. ";
	}

}
function RetrieveRadioButtonValue(groupName) {
	// debugger;
	var value = "";
	var radioButtonGrouping = document.getElementsByName(groupName);
	if (radioButtonGrouping && radioButtonGrouping.length > 0) {
		// We need to search for which radio button was selected
		// by looking at the checked value https://www.w3schools.com/jsref/prop_radio_checked.asp
		for (let idx = 0; idx < radioButtonGrouping.length; idx++) {
			if (radioButtonGrouping[idx]
				&& radioButtonGrouping[idx].value !== undefined
				&& radioButtonGrouping[idx].checked !== undefined) {
				if (radioButtonGrouping[idx].checked) {
					value = radioButtonGrouping[idx].value;
					break;  // No use looking at the next checkboxes because only one can be checked
				}
			}
		}
	}
	else {
		console.log("Could not find radio button group named '" + groupName + "'");
	}
	return value;
}

function RetrieveCheckBoxValues(groupName) {
	// debugger;
	var value = [];
	var checkboxGrouping = document.getElementsByName(groupName);
	if (checkboxGrouping && checkboxGrouping.length > 0) {
		// We need to search for which checkbox was selected
		// by looking at the checked value https://www.w3schools.com/jsref/prop_checkbox_checked.asp
		for (let idx = 0; idx < checkboxGrouping.length; idx++) {
			if (checkboxGrouping[idx]
				&& checkboxGrouping[idx].value !== undefined
				&& checkboxGrouping[idx].checked !== undefined) {
				if (checkboxGrouping[idx].checked) {
					value.push(checkboxGrouping[idx].value);
				}
			}
		}
	}
	else {
		console.log("Could not find checkbox group named '" + groupName + "'");
	}
	return value;
}
//var ajaxCall;

function RetrieveInputValue(id) {
	var value = "";
	var elementFound = document.getElementById(id);
	if (elementFound && elementFound.value !== undefined) {
		value = elementFound.value;
	}
	else {
		console.log("Element '" + id + "' cannot be found");
	}
	return value;
}