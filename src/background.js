browser.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.method == "getLocalStorage") {
    sendResponse({data: localStorage[request.key]});
  }
  else if (request.method == "getSmallKeyboardCoords") {
    sendResponse({
      smallKeyboard: localStorage["smallKeyboard"],
      smallKeyboardTop: localStorage["smallKeyboardTop"],
      smallKeyboardBottom: localStorage["smallKeyboardBottom"],
      smallKeyboardRight: localStorage["smallKeyboardRight"],
      smallKeyboardLeft: localStorage["smallKeyboardLeft"]
    });
  }
  else if (request.method == "loadKeyboardSettings") {
    sendResponse({
      openedFirstTime: localStorage["openedFirstTime"],
      capsLock: localStorage["capsLock"],
      smallKeyboard: localStorage["smallKeyboard"],
      touchEvents: localStorage["touchEvents"],
      keyboardLayout1: localStorage["keyboardLayout1"],
      urlButton: localStorage["urlButton"],
      keyboardEnabled: localStorage["keyboardEnabled"]
    });
  }
  else if (request.method == "initLoadKeyboardSettings") {
    sendResponse({
      hardwareAcceleration: localStorage["hardwareAcceleration"],
      zoomLevel: localStorage["zoomLevel"],
      autoTrigger: localStorage["autoTrigger"],
      repeatLetters: localStorage["repeatLetters"],
      intelligentScroll: localStorage["intelligentScroll"],
      autoTriggerLinks: localStorage["autoTriggerLinks"],
      autoTriggerAfter: localStorage["autoTriggerAfter"],
      refreshTime: localStorage["refreshTime"]
    });
  }
  else if (request.method == "setLocalStorage") {
    localStorage[request.key] = request.value;
    sendResponse({data: "ok"});
  }
  else if (request.method == "openFromIframe") {
    browser.tabs.query({active: true, windowId: browser.windows.WINDOW_ID_CURRENT}).then(tabs => {
      const tab = tabs[0];
      browser.tabs.sendMessage(tab.id, request);
    });
  }
  else if (request.method == "clickFromIframe") {
    browser.tabs.query({active: true, windowId: browser.windows.WINDOW_ID_CURRENT}).then(tabs => {
      const tab = tabs[0];
      browser.tabs.sendMessage(tab.id, request);
    });
  }
  else if (request.method == "toogleKeyboard") {
    if (localStorage["keyboardEnabled"] != "false") {
      localStorage["keyboardEnabled"] = "false";
    } else {
      localStorage["keyboardEnabled"] = "true";
    }
    browser.tabs.query({active: true, windowId: browser.windows.WINDOW_ID_CURRENT}).then(tabs => {
      const tab = tabs[0];
      vkeyboard_loadPageIcon(tab.id);
      if (localStorage["keyboardEnabled"] == "false") {
        browser.tabs.sendMessage(tab.id, "closeKeyboard");
      } else {
        browser.tabs.sendMessage(tab.id, "openKeyboard");
      }
    });
    sendResponse({data: "ok"});
  }
  else if (request.method == "toogleKeyboardOn") {
    localStorage["keyboardEnabled"] = "true";
    browser.tabs.query({active: true, windowId: browser.windows.WINDOW_ID_CURRENT}).then(tabs => {
      const tab = tabs[0];
      vkeyboard_loadPageIcon(tab.id);
      browser.tabs.sendMessage(tab.id, "openKeyboard");
    });
    sendResponse({data: "ok"});
  }
  else if (request.method == "toogleKeyboardDemand") {
    localStorage["keyboardEnabled"] = "demand";
    browser.tabs.query({active: true, windowId: browser.windows.WINDOW_ID_CURRENT}).then(tabs => {
      const tab = tabs[0];
      vkeyboard_loadPageIcon(tab.id);
      browser.tabs.sendMessage(tab.id, "openKeyboard");
    });
    sendResponse({data: "ok"});
  }
  else if (request.method == "toogleKeyboardOff") {
    localStorage["keyboardEnabled"] = "false";
    browser.tabs.query({active: true, windowId: browser.windows.WINDOW_ID_CURRENT}).then(tabs => {
      const tab = tabs[0];
      vkeyboard_loadPageIcon(tab.id);
      browser.tabs.sendMessage(tab.id, "closeKeyboard");
    });
    sendResponse({data: "ok"});
  }
  else if (request.method == "openUrlBar") {
    browser.tabs.query({active: true, windowId: browser.windows.WINDOW_ID_CURRENT}).then(tabs => {
      const tab = tabs[0];
      browser.tabs.sendMessage(tab.id, "openUrlBar");
      sendResponse({data: "ok"});
    });
  }
  else if (request.method == "createTab") {
    chrome.tabs.create({url: request.url});
  }
  else {
    sendResponse({});
  }
});

function vkeyboard_loadPageIcon(tabId) {
  if (localStorage["keyboardEnabled"] == "demand") {
    browser.browserAction.setIcon({tabId: tabId, path: "buttons/keyboard_2.png"})
  } else if (localStorage["keyboardEnabled"] != "false") {
    browser.browserAction.setIcon({tabId: tabId, path: "buttons/keyboard_1.png"});
  } else {
    browser.browserAction.setIcon({tabId: tabId, path: "buttons/keyboard_3.png"});
  }
}

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (localStorage["toogleKeyboard"] != "false") {
    browser.browserAction.enable(tabId);
    vkeyboard_loadPageIcon(tabId);
  } else {
    localStorage["keyboardEnabled"] = "true";
    browser.browserAction.disable(tabId);
  }
});
