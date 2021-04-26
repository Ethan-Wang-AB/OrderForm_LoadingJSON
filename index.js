


window.onload = initializeWebpage;


function initializeWebpage() {
	var toDay = new Date();

	document.getElementById("dtfield").innerHTML = toDay;

	
}
setInterval("initializeWebpage()", 1000);