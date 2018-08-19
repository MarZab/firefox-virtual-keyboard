window.addEventListener('load', function() {
	document.getElementById("toggleOn").onclick = function() {
		browser.runtime.sendMessage({method: "toogleKeyboardOn"}).then(function(response) {
      window.close();
    });
	}
	document.getElementById("settings").onclick = function() {
		window.open(chrome.extension.getURL("options.html"));
	}
	document.getElementById("toggleOff").onclick = function() {
    browser.runtime.sendMessage({method: "toogleKeyboardOff"}).then(function(response) {
      window.close();
    });
	}
	document.getElementById("toggleDemand").onclick = function() {
    browser.runtime.sendMessage({method: "toogleKeyboardDemand"}).then(function(response) {
      window.close();
    });
	}
	document.getElementById("goToUrl").onclick = function() {
    browser.runtime.sendMessage({method: "openUrlBar"}).then(function(response) {
      eval(callback)(response.data);
    });
		window.close();
	}
if (localStorage["keyboardEnabled"] == "demand") {
	document.getElementById("toggleDemand").className = "active";
} else if (localStorage["keyboardEnabled"] != "false") {
	document.getElementById("toggleOn").className = "active";
} else {
	document.getElementById("toggleOff").className = "active";
}

}, false);
