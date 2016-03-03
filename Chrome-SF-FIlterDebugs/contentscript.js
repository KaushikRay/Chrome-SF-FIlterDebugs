/**
 * Main content script to communicate with background page and add functionality
 *
 * @type       JS library
 * @author     Kaushik Ray (kr.ray.kaushik@gmail.com)
 */
var completeDebugText = '';
createDOMDebugButton();

/**
 * Create a new debug only button in DOM
 * 
 * @method     createDOMShareButton
 */
function createDOMDebugButton() {
    verifyCurrentURL();
}

/**
 * Content script method to get current tab url
 * Record id will be extracted from same
 *
 * @method     verifyCurrentURL
 */
function verifyCurrentURL() {
    chrome.runtime.sendMessage({type: "getCurrentTaburl"}, function(response) {
        var currentURL = response.currentTaburl;
        if (currentURL.indexOf('ApexDebugLogDetailEdit') != -1) {
            createActualDOMCheckbox()
        }
    });
}

function createActualDOMCheckbox() {
    $('.codeBlock').before(
        '<input type="checkbox" class="btn" id="debugOnlyCheckbox">SHOW ONLY DEBUG STATEMENTS</input><br>'
    );

    $(document).on("click", "#debugOnlyCheckbox", function(){
        console.log('checked -->' + $(this).is(':checked'));
        if ($(this).is(':checked')) {
            initiateFilterDebugProcess();
        } else {
            showCompleteDebug();
        }
    });

}

function showCompleteDebug() {
    $('.codeBlock').html(completeDebugText);
}

/**
 * checkbox click witll call this method to initiate the process
 *
 * @method     initiateShareProcess
 */
function initiateFilterDebugProcess() {
    setSessionInstance();
}

/**
 * sets the session id by getting it from cookies and setting it to forcetk
 * all methods are sync so need to perform method chaining for same
 *
 * @method     setSessionInstance
 */
function setSessionInstance() {
    filterOnDebugText();
}

/**
 * Method to split complete debug lines and only display debug statements
 *
 * @method     filterOnDebugText
 */
function filterOnDebugText() {
    completeDebugText = $('.codeBlock').html();
    debugLines = completeDebugText.split("\n");

    var finalDebugLines = '';
    for (var i = 0; i < debugLines.length; i++) {
        if (debugLines[i].indexOf('|DEBUG|') != -1) {
            finalDebugLines = finalDebugLines + debugLines[i] + '\n';
        }
    }
    $('.codeBlock').html(finalDebugLines);
}

