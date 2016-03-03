/**
 * Main branching method based on request received from content script
 * 
 * @author     Kaushik Ray (kr.ray.kaushik@gmail.com)
 */
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.type == "getCurrentTaburl") {
      getCurrentTaburl(request, sender, sendResponse, false);
      return true;
    }
});

/**
 * Method to get current tab url and so that we can verify if the tab is correct to work on or not
 *
 * @method     getCurrentTaburl
 * @param      {<type>}    request       { description }
 * @param      {<type>}    sender        { description }
 * @param      {Function}  sendResponse  { description }
 */
function getCurrentTaburl(request, sender, sendResponse, proceedWithSessionId) {
  var resp = sendResponse;
  chrome.tabs.query({active: true, currentWindow: true }, function (tabs) {
    if (proceedWithSessionId) {
      chrome.cookies.get({url: getInstanceUrl(tabs[0].url), name: "sid"}, function(cookies){
          resp({sessionId : cookies.value});
      });
    } else {
        resp({currentTaburl : tabs[0].url});
    }
  });
}


/**
 * to get actual url based on passed complete url
 *
 * @method     getInstanceUrl
 * @param      {<type>}  url     { description }
 * @return     {string}  { description_of_the_return_value }
 */
function getInstanceUrl(url){
    var urlPortions = url.split('/');
    if(urlPortions[2].indexOf('.salesforce.com')!=-1){
        return urlPortions[0] + '//' + urlPortions[2];
    }
    if(urlPortions[2].indexOf('.force.com') != -1){
        var tempURL = urlPortions[2].split('.');
        return urlPortions[0] + '//' + tempURL[1] +'.salesforce.com';
    }
}