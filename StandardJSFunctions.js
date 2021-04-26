// Version 1.04  - Mar 11, 2021
//
//#region Change History:
//
// Mar 06 2021 1.01
// - Moved ClearCheckboxes() method to be closer to SetCheckboxes() method
// - Added GetPreferredRegion() method to allow retrieving user preference of locale from browser
// - Updated ConvertToCurrency() method to allow optional parameters, passing in Currency unit, and preferred locale
// - Updated ConvertToLocalTime() method to allow optional parameters, passing in time format and locale
// - Added SetRadioButtons() method for use in Lab 7
// - Added SetCheckboxes() method for use in Lab 7
// - Added UpdateFormFieldValue() method for use in Lab 7
// - Added UpdateElement() method for use in Lab 7
//
// Mar 08 2011 1.02
// - Fixed bug in ConvertToCurrency() method to ensure value is numeric before .toLocaleString() call
//   In the event the caller passes in a string value, since .toLocaleString() will not format strings
//
// Mar 11 2021 1.03
// - Added //#region and //#endregion to allow collapsing
// - Deprecated ConvertToCurrency(value, currency, locale) method
//   and replaced it with OutputAsCurrency(value, currency, locale) method
//   - Existing code calls to ConvertToCurrency() will still work via helper method for backward compatability
// - Moved CSS required by ValidateInputField(), ValidateRadioButtonInputField(), ValidateCheckBoxInputFields()
//   into the ErrorValidation.css file
//
//#endregion 

///#region  Information
//          -----------
//  This is a standard set of functions that we use quite often, so we've decided
//  to create this StandardJSFunctions.js library so we can use it in all our Labs, mid-terms
//  finals, etc.
//      To use this library add this to the <head> section of your HTML markup
//          <script type='text/javascript' src="StandardJSFunctions.js"></script>
//          <link type='text/css' rel='stylesheet' href='ErrorValidation.css'>
//#endregion

//#region class AJAXCalls
// This object is used to control what is updated by the GetContentUsingAJAX method
var AJAXCalls = AJAXCalls || {};
AJAXCalls.async = true;
AJAXCalls.options = AJAXCalls.options || {};
AJAXCalls.options.displayPanel = 'display-panel';
AJAXCalls.options.webPanelId = 'html-info';
AJAXCalls.options.hiddenClass = 'hidden';
//#endregion

//#region class ERRMessages
// This object is used to control what is used for classes and ids by the Validate methods
var ERRMessages = ERRMessages || {};
ERRMessages.options = ERRMessages.options || {};
ERRMessages.options.errMessageId = 'err-message';
ERRMessages.options.fieldInputInErrClass = 'InputInError';
ERRMessages.options.problemDescClass = 'problem-description';
ERRMessages.options.hiddenClass = 'hidden';
//#endregion

//#region function RetrieveInputValue(id)
/// This allows us to use a method to retrieve input field values based upon the id
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
//#endregion

//#region function RetrieveRadioButtonValue(groupName) 
/// This method allows us to find which radio button was checked in the group of radio buttons
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
//#endregion

//#region function RetrieveCheckBoxValues(groupName) 
/// This method allows us to find which checkbox items weres checked in the group of checkbox Input fields
/// that share the same name
function RetrieveCheckBoxValues(groupName) {
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
//#endregion

//#region function RetrieveDropDownSingleValue(id)
/// This will be moved to the StandardJSFunctions.js in the future
function RetrieveDropDownSingleValue(id) {
    var value = "";
    var dropdownSingleSelect = document.getElementById(id);
    if (dropdownSingleSelect && dropdownSingleSelect.value !== undefined) {
        // We need to search for which option was selected in the dropdown
        // by looking at the value from https://www.w3schools.com/jsref/prop_select_value.asp
        value = dropdownSingleSelect.value;
    }
    else {
        console.log("Could not find drop down with id '" + id + "'");
    }
    return value;
}
//#endregion

//#region function RetrieveDropDownMultiValue(id)
/// This method allows you to get all the selected options in a dropdown <select> that has
/// the multiple attribute (meaning the user can select multiple options in the dropdown)
function RetrieveDropDownMultiValue(id) {
    debugger;
    var values = [];
    var dropdownMultiSelect = document.getElementById(id);
    if (dropdownMultiSelect && dropdownMultiSelect.value !== undefined) {
        if (dropdownMultiSelect.getAttribute('multiple') !== undefined && dropdownMultiSelect.hasChildNodes != undefined) {
            var dropdownMultiOptions = dropdownMultiSelect.childNodes;
            if (dropdownMultiOptions && dropdownMultiOptions.length > 0) {
                for (let idx = 0; idx < dropdownMultiOptions.length; idx++) {
                    // We need to search for which option was selected in the dropdown
                    // by looking at the value from https://www.w3schools.com/jsref/prop_select_value.asp
                    if (dropdownMultiOptions[idx].selected) {
                        values.push(dropdownMultiOptions[idx].value);
                    }
                }
            }
        }
        else {
            values = dropdownSingleSelect.value;
        }
    }
    else {
        console.log("Could not find drop down with id '" + id + "'");
    }
    return values;
}
//#endregion

//#region function RetrieveInputValueNumeric(id)
// Retrieve a numeric value from a input field, and convert it to a number
function RetrieveInputValueNumeric(id) {
    var value = 0;
    var elementFound = document.getElementById(id);
    if (elementFound && elementFound.value !== undefined) {
        if (elementFound.value != "") {
            try {
                value = parseFloat(elementFound.value);
            }
            catch (err) {
                var errMsg = `Error converting '${id}' value to numeric value
Error: ${err}`;
                console.log(errMsg);
            }
        }
    }
    else {
        console.log("Element '" + id + "' cannot be found");
    }
    return value;
}
//#endregion

//#region function GetValidationMessage(id)
// Get the validation error message from the web browser so we can tell the user what is wrong
function GetValidationMessage(id) {
    var msg = "";
    var elementWithError = document.getElementById(id);
    if (elementWithError && elementWithError.validationMessage !== undefined) {
        msg = elementWithError.validationMessage;
    }
    return msg;
}
//#endregion

//#region function ValidateInputField(id, errId)
// A standardized validation function that will check to see if the input field is validate
// according to the web browser, and if not report the problem in the errId tag innerHTML
function ValidateInputField(id, errId) {
    var isFieldValid = true;
    // see https://www.w3schools.com/js/js_validation_api.asp
    if (!errId) {
        errId = ERRMessages.options.errMessageId;
    }
    // Test the field based upon the id and if it fails, we set the isValidForm to false
    var testInputElement = document.getElementById(id);
    if (testInputElement && testInputElement.checkValidity() !== undefined) {
        if (testInputElement.checkValidity() == false) {
            // Tell the user what is wrong by highlighting the field with a different color background
            /// and update the error message display area to describe the actual error
            testInputElement.classList.toggle(ERRMessages.options.fieldInputInErrClass, true);
            var validationProblem = GetValidationMessage(id);
            var updateElement = document.getElementById(errId);
            if (updateElement && updateElement.innerHTML !== undefined) {
                updateElement.classList.toggle(ERRMessages.options.hiddenClass, false);
                updateElement.innerHTML = `<div>Please check the field indicated
            <p class='${ERRMessages.options.problemDescClass}'>${validationProblem}</p></div>`;
            }
            else {
                console.log(`Could not file err mesage area id='${errId}`);
            }
            isFieldValid = false;
        }
        else {
            // There is no error so we need to remove any background color that indicated the error
            // to show that the error has gone away, and we need to blank out the error message display area
            testInputElement.classList.toggle(ERRMessages.options.fieldInputInErrClass, false);
            var updateElement = document.getElementById(errId);
            if (updateElement && updateElement.innerHTML !== undefined) {
                updateElement.classList.toggle(ERRMessages.options.hiddenClass, true);
                updateElement.innerHTML = "";
            }
        }
    }
    else {
        console.log(`Element '${id}' cannot be found or doesn't support validation checking`);
    }

    return isFieldValid;
}
//#endregion

//#region function ValidateRadioButtonInputField(groupName, errId)
// A standardized validation function that will check to see if the radio button input field group is validate
// according to the web browser, and if not report the problem in the errId tag innerHTML
function ValidateRadioButtonInputField(groupName, errId) {
    var isFieldValid = true;
    // see https://www.w3schools.com/js/js_validation_api.asp
    if (!errId) {
        errId = ERRMessages.options.fieldInputInErrClass;
    }
    // Test the field based upon the id and if it fails, we set the isValidForm to false
    var testRadioButtonElements = document.getElementsByName(groupName);
    if (testRadioButtonElements && testRadioButtonElements.length > 0) {
        for (let idx = 0; idx < testRadioButtonElements.length; idx++) {
            var radioButtonInput = testRadioButtonElements[idx];
            if (radioButtonInput && radioButtonInput.checkValidity() !== undefined) {
                if (radioButtonInput.checkValidity() == false) {
                    var validationProblem = GetValidationMessage(radioButtonInput.id);
                    // We need to find the label associated with this radio button
                    // and it should be the next element in the DOM
                    var label = radioButtonInput.nextElementSibling;
                    if (label && label.innerHTML !== undefined) {
                        // Tell the user what is wrong by highlighting the field with a different color background
                        /// and update the error message display area to describe the actual error
                        label.classList.toggle(ERRMessages.options.fieldInputInErrClass, true);
                    }
                    var updateElement = document.getElementById(errId);
                    if (updateElement && updateElement.innerHTML !== undefined) {
                        updateElement.classList.toggle(ERRMessages.options.hiddenClass, false);
                        updateElement.innerHTML = `<div>Please check the radio buttons indicated
            <p class='problem-description'>${validationProblem}</p></div>`;
                    }
                    else {
                        console.log(`Could not file err mesage area id='${errId}`);
                    }
        
                    isFieldValid = false;
                }
                else {
                    // There is no error so we need to remove any background color that indicated the error
                    // to show that the error has gone away, and we need to blank out the error message display area
                    // We need to find the label associated with this radio button
                    // and it should be the next element in the DOM
                    var label = radioButtonInput.nextElementSibling;
                    if (label && label.innerHTML !== undefined) {
                        // Tell the user what is wrong by highlighting the field with a different color background
                        /// and update the error message display area to describe the actual error
                        label.classList.toggle(ERRMessages.options.fieldInputInErrClass, false);
                    }
                    var updateElement = document.getElementById(errId);
                    if (updateElement && updateElement.innerHTML !== undefined) {
                        updateElement.classList.toggle(ERRMessages.options.hiddenClass, true);
                        updateElement.innerHTML = "";
                    }
                }
            }
            else {
                console.log(`Cannot find push button elements of group '${groupName}' or it does not support checkvalidation`);
            }
        }
    }
    else {
        console.log("Could not find any radio button group with the id of '" + groupName + "'");
    }
    return isFieldValid;
}
//#endregion

//#region function ValidateCheckBoxInputFields(groupName, errId)
// A standardized validation function that will check to see if the checkbox button input field group is validate
// according to the web browser, and if not report the problem in the errId tag innerHTML
function ValidateCheckBoxInputFields(groupName, errId) {
    var isFieldValid = true;
    // see https://www.w3schools.com/js/js_validation_api.asp

    // Test the field based upon the id and if it fails, we set the isValidForm to false
    var testCheckBoxElements = document.getElementsByName(groupName);
    if (testCheckBoxElements && testCheckBoxElements.length > 0) {
        for (let idx = 0; idx < testCheckBoxElements.length; idx++) {
            var checkBoxInput = testCheckBoxElements[idx];
            if (checkBoxInput && checkBoxInput.checkValidity() !== undefined) {
                if (checkBoxInput.checkValidity() == false) {
                    var validationProblem = GetValidationMessage(checkBoxInput.id);

                    // We need to find the label associated with this radio button
                    // and it should be the next element in the DOM
                    var label = checkBoxInput.nextElementSibling;
                    if (label && label.innerHTML !== undefined) {
                        // Tell the user what is wrong by highlighting the field with a different color background
                        /// and update the error message display area to describe the actual error
                        label.classList.toggle(ERRMessages.options.fieldInputInErrClass, true);
                    }
                    var updateElement = document.getElementById(errId);
                    if (updateElement && updateElement.innerHTML !== undefined) {
                        updateElement.classList.toggle(ERRMessages.options.hiddenClass, false);
                        updateElement.innerHTML = `<div>Please check the radio buttons indicated
            <p class='problem-description'>${validationProblem}</p></div>`;
                    }
                    isFieldValid = false;
                }
                else {
                    // There is no error so we need to remove any background color that indicated the error
                    // to show that the error has gone away, and we need to blank out the error message display area
                    // We need to find the label associated with this radio button
                    // and it should be the next element in the DOM
                    var label = checkBoxInput.nextElementSibling;
                    if (label && label.innerHTML !== undefined) {
                        // Tell the user what is wrong by highlighting the field with a different color background
                        /// and update the error message display area to describe the actual error
                        label.classList.toggle(ERRMessages.options.fieldInputInErrClass, false);
                    }
                    var updateElement = document.getElementById(errId);
                    if (updateElement && updateElement.innerHTML !== undefined) {
                        updateElement.classList.toggle(ERRMessages.options.hiddenClass, true);
                        updateElement.innerHTML = "";
                    }
                }
            }
            else {
                console.log(`Checkbox field with the id of '${checkBoxInput.Id}' does not support validity checks`);
            }
        }
    }
    else {
        console.log(`Could not find any checkboxs in group with the id of '${groupName}'`);
    }

    return isFieldValid;
}
//#endregion

//#region function ToggleClassState(id, toggleClass, force)
// Toggle a class on or off
function ToggleClassState(id, toggleClass, force) {
    var inputElement = document.getElementById(id);
    if (inputElement) {
        // Toggle the Class 
        inputElement.classList.toggle(toggleClass, force);
    }
}
//#endregion

//#region function RemoveClassState(id, toggleClass) 
// Remove a class from the element on the screen
function RemoveClassState(id, toggleClass) {
    var inputElement = document.getElementById(id);
    if (inputElement) {
        // For the Class to be removed
        inputElement.classList.remove(toggleClass, true);
    }
}
//#endregion

//#region function AddClassState(id, toggleClass)
// Add a class to an element on the screen
function AddClassState(id, toggleClass) {
    var inputElement = document.getElementById(id);
    if (inputElement) {
        // Force the Class to be added
        inputElement.classList.toggle(toggleClass, true);
    }
}
//#endregion

//#region function UpdateFormFieldValue(id, newValue)
// Change the value of an input field field which supports the .value attribute 
function UpdateFormFieldValue(id, newValue) {
    var elementOnForm = document.getElementById(id);
    if (elementOnForm && elementOnForm.value !== undefined) {
        elementOnForm.value = newValue;
    }
    else {
        console.log(`Could not field id '${id}' to update value\n${newValue}`);
    }
}
//#endregion

//#region function UpdateElement(id, newValue)
// Change the innerHTML of an element which supports the .innerHTML attribute 
function UpdateElement(id, newValue) {
    var elementOnForm = document.getElementById(id);
    if (elementOnForm && elementOnForm.innerHTML !== undefined) {
        elementOnForm.innerHTML = newValue;
    }
    else {
        console.log(`Could not field id '${id}' to update innerHTML\n${newValue}`);
    }
}
//#endregion

//#region function GetPreferredRegion()
// Get the user's preferred regional language from the web browser
// based upon https://stackoverflow.com/questions/673905/best-way-to-determine-users-locale-within-browser
function GetPreferredRegion() {
    var regionalLanguage = "en-US";
    if (navigator.languages && navigator.languages.length) {
        regionalLanguage = navigator.languages[0];
    } else {
        regionalLanguage = navigator.userLanguage || navigator.language || navigator.browserLanguage || 'en';
    }
    return regionalLanguage;
}
//#endregion

//#region function ConvertToCurrency(value, currency, locale)
// The ConvertToCurrency() method has been depricated, and you should call the OutputAsCurrency function directly
// To ensure all existing code that called the ConvertToCurrency() still works, we provide this "helper" 
function ConvertToCurrency(value, currency, locale) {
    console.log("ConvertToCurrency() is deprecated, please call OutputAsCurrency() instead");
    return OutputAsCurrency(value, currency, locale);
}
//#endregion

//#region function OutputAsCurrency(value, currency, locale)
// Method to convert a numeric valid to currency based upon passing in the value
// The currency you want to use, and the locale the user wants the currency output in
// If you pass only the value, it will use CAD, and the user's web browser prefered region
// see https://www.w3schools.com/jsref/jsref_tolocalestring_number.asp
function OutputAsCurrency(value, currency, locale) {
    // debugger;
    // If the caller didn't specify the currency, use a default of Canadian dollars
    if (!currency) {
        currency = "CAD";
    }
    // If the caller didn't specify the regional locale, use the web browser default locale
    if (!locale) {
        locale = GetPreferredRegion();
    }
    // Bug fix -- if they pass a string value, convert it to a number first
    if (typeof value == "string") {
        value = parseFloat(value);
    }

    var valueAsCurrency = "";
    var conversionRules = {
        style: "currency",
        currency: currency
    }

    if (value && value.toLocaleString() !== undefined) {
        valueAsCurrency = value.toLocaleString(locale, conversionRules);
    }
    return valueAsCurrency;
}
//#endregion

//#region function ConvertToLocalTime(dateObject, style, locale)
// Convert a full date object to extract only the local time component
// See https://www.w3schools.com/jsref/jsref_tolocalestring.asp
function ConvertToLocalTime(dateObject, style, locale) {
    // debugger;
    // If the caller didn't specify the style, use the "short" time format  1:30 pm
    if (!style) {
        style = "short";
    }
    // If the caller didn't specify the regional locale, use the web browser default locale
    if (!locale) {
        locale = GetPreferredRegion();
    }
    var valueAsShortDate = "";
    var conversionRules = {
        timeStyle: style,
        ////// or if you don't want to use timeStyle, you can specify things like this
        // hour:	"2-digit",
        // minute:	"2-digit",
        // hour12: true,
    }

    if (dateObject && dateObject.toLocaleString() !== undefined) {
        valueAsShortDate = dateObject.toLocaleString(locale, conversionRules);
    }
    return valueAsShortDate;
}
//#endregion

//#region function EnableInputElement(id, enabled)
// Enable an input field on the screen, or disable it
function EnableInputElement(id, enabled) {
    var inputElement = document.getElementById(id);
    if (inputElement && inputElement.disabled !== undefined) {
        inputElement.disabled = !enabled;
    }
    else {
        console.log(`Could not find element '${id}' to set disabled to ${!enabled}`);
    }
}
//#endregion

//#region function SetRadioButtons(groupName, checkedItem)
/// This method will allow you to set the radio button to the value specified
///  the checkedItem should equal the value="xxxxxx" in your <input type='radio'> HTML markup
function SetRadioButtons(groupName, checkedItem) {
    // debugger;
    var radioButtonItems = document.getElementsByName(groupName);
    if (radioButtonItems && radioButtonItems.length > 0) {
        for (let idx = 0; idx < radioButtonItems.length; idx++) {
            var radioButtonElement = radioButtonItems[idx];
            if (radioButtonElement
                && radioButtonElement.checked !== undefined
                && radioButtonElement.value !== undefined) {
                radioButtonElement.checked = (radioButtonElement.value === checkedItem) ? true : false;
            }
        }
    }
    else {
        console.log(`Radio button group '${groupName}' does not exist`);
    }

}
//#endregion

//#region function ClearCheckboxes(groupName) 
// This allows us to clear out checkboxes that were checked
function ClearCheckboxes(groupName) {
    debugger;
    var checkboxGrouping = document.getElementsByName(groupName);
    if (checkboxGrouping && checkboxGrouping.length > 0) {
        // We need to search for which checkbox was selected
        // by looking at the checked value https://www.w3schools.com/jsref/prop_checkbox_checked.asp
        for (let idx = 0; idx < checkboxGrouping.length; idx++) {
            if (checkboxGrouping[idx]
                && checkboxGrouping[idx].value !== undefined
                && checkboxGrouping[idx].checked !== undefined) {
                if (checkboxGrouping[idx].checked) {
                    checkboxGrouping[idx].checked = false;
                }
            }
        }
    }
    else {
        console.log("Could not find checkbox group named '" + groupName + "'");
    }
}
//#endregion

//#region function SetCheckboxes(groupName, values)
// This method will set the checkboxes in a group
function SetCheckboxes(groupName, values) {
    if (typeof values !== "array") {

    }
    var checkBoxItems = document.getElementsByName(groupName);
    if (checkBoxItems && checkBoxItems.length > 0) {
        for (let idx = 0; idx < checkBoxItems.length; idx++) {
            var checkBoxElement = checkBoxItems[idx];
            if (checkBoxElement
                && checkBoxElement.checked !== undefined
                && checkBoxElement.value !== undefined) {
                for (let idx2 = 0; idx2 < values.length; idx2++) {
                    if (checkBoxElement.value === values[idx2]) {
                        checkBoxElement.checked = true;
                        break;
                    }
                }
            }
        }
    }
    else {
        console.log(`Checkbox group '${groupName}' does not exist`);
    }
}
//#endregion



//#region function GetContentUsingAJAXwithURL(event)
// This method respondes to a onmouseover event, and gets the event object that triggered the
// mouseover.  From the event, we can figure out which element triggered the vent,
// the event.currentTarget.  Now that we know t
function GetContentUsingAJAXwithURL(event) {
    // Which element on the screen triggered the event?
    var whoWasMousedOver = event.currentTarget;
    // Does that element have an id property so we can examine the element to see 
    // if it has a attribute called data_LoadFile="urlOrFilename" that tells us what file
    // to load via AJAX
    if (whoWasMousedOver && whoWasMousedOver.id !== undefined) {
        var element = document.getElementById(whoWasMousedOver.id);
        if (element && element.getAttribute('data_LoadFile') !== undefined) {
            var loadFileUrl = element.getAttribute('data_LoadFile');
            if (loadFileUrl) {
                GetContentUsingAJAX(loadFileUrl);
            }
        }
        else {
            console.log(`Could not find the target id of '${whoWasMousedOver.id}' so I could not determine which file to load using AJAX`);
        }
    }
    else {
        console.log("Could not determine the target that triggered the event");
    }
}
//#endregion

//#region function GetContentUsingAJAX(infoPageURL)
// This is the method that will make the AJAX call, and load the page specified in 
// the param to the .innerHTML of the element with the id specified by AJAXCalls.options.webPanelId
function GetContentUsingAJAX(infoPageURL) {
    debugger

    // Create the XMLHttpRequest object
    var asynchrequest = new XMLHttpRequest();

    // Define a callback function that will get called whenever the state changes on the 
    // async request.  This can be called repeatedly (whenever the status changes)
    //
    // Note:  The creation and assignment of the function does not mean that the code inside
    //        the function runs immediately.  It simply defines the function, and what code
    //		  will be executed when the callback event occurs
    //
    asynchrequest.onreadystatechange = function () {
        // This callback function gets called 4 times, with .readyState == 1 through 4
        //  When this function gets called, we need to check the .readyState and wait until
        //  it reaches state 4 which indicates the async process is completed
        //  Once we have a .readyState == 4, then we can check the .status to determine 
        //  how to process the response
        if (asynchrequest.readyState == 4) {

            // Find the element we are supposed to update
            var elementToUpdate = document.getElementById(AJAXCalls.options.webPanelId);
            if (elementToUpdate && elementToUpdate.innerHTML !== undefined) {
                // Ok, the request completed, and we have the response in the .responseText
                // or the .responseHTML property of the variable we created as an XMLHttpRequest
                switch (asynchrequest.status) {
                    case 200:
                        var htmlFragment = ParseTextAsHTML(asynchrequest.responseText, 'body',true);
                        if (htmlFragment) {
                            elementToUpdate.innerHTML = htmlFragment;
                        } else {
                            elementToUpdate.innerHTML = asynchrequest.responseText;
                        }
                        ToggleClassState(AJAXCalls.options.displayPanel, AJAXCalls.options.hiddenClass, false);
                        break;

                    // Check the common status codes of 404 and 500 next
                    case 404:
                        elementToUpdate.innerHTML = `
<span id='errmessage' class='problem-description'>
${asynchrequest.status}: Server indicated file <em>${infoPageURL}</em> does not exist. 
Please check the URL or file path is correct
</span>`;
                        ToggleClassState(AJAXCalls.options.displayPanel, AJAXCalls.options.hiddenClass, false);
                        break;

                    case 500:
                        elementToUpdate.innerHTML = `
<span id='errmessage' class='problem-description'>
${asynchrequest.status}: Server indicated a server error occurred - try again later
</span>`;
                        ToggleClassState(AJAXCalls.options.displayPanel, AJAXCalls.options.hiddenClass, false);
                        break;

                    // Handle any other status codes
                    default:
                        elementToUpdate.innerHTML = `
<span id='errmessage' class='problem-description'>
${asynchrequest.status}: Server indicated status code ${asynchrequest.status} - Not sure how to handle it
</span>`;
                        ToggleClassState(AJAXCalls.options.displayPanel, AJAXCalls.options.hiddenClass, false);
                        break;
                }
            }
            else {
                console.log(`Could not find element '${AJAXCalls.options.webPanelId}' to update it`);
            }
        }
        else {
            console.log(`Async callback to our logic but .readyState == ${asynchrequest.readyState} && .status == ${asynchrequest.status}`);
        }
    };

    // Now that we have setup our "callback" function

    // Lets tell the XMLHttpRequest object which URL we want to retrieve (the user is in infoPageURL),
    // and which method we want to request it (a GET request), and if we want to wait for the
    // request (a synchronous request would pass false as the 3rd parameter) or if we want to
    // continue to execute code so that the request operates asynchronously
    asynchrequest.open("GET", infoPageURL, AJAXCalls.async);

    // This sends the request off to the URL indicated in the .open, using the method requested
    asynchrequest.send();

    // Since we said it was allowed to run Asynchronously, we'll exist this function
    // and the "callback" will occur at a later point in time (which may be sub-seconds or several
    // minutes depending on network traffic, how busy the web server is, etc.)

}
//#endregion

//#region function ParseTextAsHTML(rawXML, id)
// Given some text that represents XML, load it as XML, then extract the elements that are
// the child nodes of a specific node the XML as a string
function ParseTextAsHTML(rawHTML, id, stripJavaScript) {
    var returnString = "";
    // see https://www.w3schools.com/xml/xml_parser.asp 
    // and see https://www.w3schools.com/xml/dom_intro.asp
    var parser = new DOMParser();
    if (parser) {
        var xmlDoc = parser.parseFromString(rawHTML, "text/html");
        if (xmlDoc && xmlDoc.body !== undefined && id !== undefined) {
            switch (id) {
                case 'body':
                    returnString = xmlDoc.body.innerHTML;
                    break;
                case 'head':
                    returnString = xmlDoc.head.innerHTML;
                    break;
                default:
                    var XMLFragment = xmlDoc.getElementsByTagName(id);
                    if (XMLFragment && XMLFragment.length > 0) {
                        returnString = XMLFragment[0].innerHTML;
                    }
                    else {
                        // XML has an error in it
                        console.log(`HTML document has an improperly closed tag such as a <br>, an <img> etc.`);
                    }
                    break;
            }
        }
    }
    else {
        console.log(`Cannot parse fragment as XML`);
        console.log(rawXML);
    }
    if (stripJavaScript) {
        const scriptTagClose = '</script>';
        // see https://www.w3schools.com/jsref/jsref_search.asp
        var startPoint = returnString.search(/<script/i);
        while (startPoint > 0) {
            // see https://www.w3schools.com/jsref/jsref_indexof.asp
            var endPoint = returnString.toLowerCase().indexOf(scriptTagClose,startPoint +2) ;
            // see https://www.w3schools.com/jsref/jsref_substring.asp
            if (endPoint > 0){
                returnString = returnString.substring(0,startPoint) + returnString.substring(endPoint +scriptTagClose.length +1);
            }
            else {
                returnString = returnString.substring(0,startPoint)
            }
            // Are there any more script tags in the HTML?
            startPoint = returnString.search(/<script>/i);
        }
    }
    return returnString;
}
//#endregion
