// Get the modal
var modalS = document.getElementById('mySignupModal');
var modalL = document.getElementById('myLoginModal');
var modalR = document.getElementById('myReviewModal');

// Get the button that opens the modal
var btnS = document.getElementById("mySignupBtn");
var btnL = document.getElementById("myLoginBtn");
var btnR = document.getElementById("myReviewBtn");

// Get the <span> element that closes the modal
var spanS = document.getElementById("spanS");
var spanL = document.getElementById("spanL");
var spanR = document.getElementById("spanR");

// When the user clicks the button, open the modal
btnS.onclick = function() {
    modalS.style.display = "block";
}
btnL.onclick = function() {
    modalL.style.display = "block";
}
btnR.onclick = function() {
    modalR.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
spanS.onclick = function() {
    modalS.style.display = "none";
}
spanL.onclick = function() {
	modalL.style.display = "none";
}
spanR.onclick = function() {
	modalR.style.display = "none";
}

//// When the user clicks anywhere outside of the modal, close it
//window.onclick = function(event) {
//    if (event.target == modalS) {
//        modalS.style.display = "none";
//    }
//}
//window.onclick = function(event) {
//    if (event.target == modalL) {
//		modalL.style.display = "none";
//    }
//}
//window.onclick = function(event) {
//    if (event.target == modal) {
//		modalR.style.display = "none";
//    }
//}
