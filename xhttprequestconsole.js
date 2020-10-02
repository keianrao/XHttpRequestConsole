
function submit() {
    outputConsole.say("Fetching and parsing input fields.");
    const requestParameters = {
        url: undefined,
        customHeaders: undefined,
        body: undefined,
        method: undefined
    };
    requestParameters.url =
        encodeURI(inputURL.value.trim() + inputQueryString.value.trim());
    /*
    * MDN's documentation on the reliability of encodeURI is a bit lacking.
    * It seems like it's safe to use, but it doesn't explain how it
    * treats the different parts of a URI. There's a section in 'Examples'
    * where they said "encodeURI() by itself cannot form proper HTTP GET
    * and POST requests, such as for XMLHttpRequest, because "&", "+",
    * and "=" are not encoded". I.. don't know why exactly that implies
    * it cannot form proper POST requests.
    */
    requestParameters.customHeaders = parseHeaders();
    requestParameters.body = inputRequestBody.value; // Take verbatim.
    requestParameters.method = inputRequestMethod.value;
    // Straightforward so far..

    // Okay, now we have to start a request.
    outputConsole.say("Assembling XMLHttpRequest.");
    const request = new XMLHttpRequest();

    request.onload = function (e) {
        outputConsole.say("Response came back.");

        outputResponseCode.value = request.status;

        outputResponseMimetype.value =
            request.getResponseHeader("Content-Type");

        if (request.responseText == null) {
            outputConsole.say("Response body doesn't seem to be text.");
        }
        else {
            outputResponseBody.value = request.responseText;
        }
    };
    request.onloadend = function (e) {
        outputConsole.say("Connection terminated.");
        submitButton.innerText = "Submit";
    };

    request.open(requestParameters.method, requestParameters.url);
    for (var customHeader of requestParameters.customHeaders) {
        request.setResponseHeader(customHeader[0], customHeader[1]);
    }

    outputConsole.say("Sending request.");
    submitButton.innerText = "Cancel";
    request.send();
    /*
    * This is failing for us right now because of CORS restrictions.
    * Meanwhile XMLHttpRequest is working fine on Experows, presumably
    * because it asks upfront for an image blob, or something..
    * I'm not sure if we can make a plain GET request here.
    *
    * MDN suggests that we serve this application on a web server
    * which, even as localhost without a domain name, the browser will
    * recognise as "not a local file".
    */
}

function parseHeaders() {
    const lines = inputRequestHeaders.value.split("\n");
    const parsedHeaders = [];

    for (var line of lines) {
        var headerLineComponents = line.split(":", 2);

        if (headerLineComponents.length != 2) continue;
        // Not a header line, probably a comment or blank line..

        var headerName = headerLineComponents[0].trim();
        var headerValue = headerLineComponents[1].trim();

        outputConsole.say(
            "Header '" + headerName
            + "'with value '" + headerValue + "."
        );
        parsedHeaders.push([headerName, headerValue]);
    }

    return parsedHeaders;
}

function urlEncodeScratchpadSelectedText() {
    selectedText =
        scratchpad.value.slice(
            scratchpad.selectedTextStart,
            scratchpad.selectedTextEnd
        );
    // API does swapping to put lower index as selectedTextStart for us.

    scratchpad.setRangeText(encodeURIComponent(selectedText));
}



//  \\  //  \\  //  \\  //  \\  //  \\  //  \\  //  \\  //  \\  //

for (
    var mapping of
    [
        ["inputURL","input-url"],
        ["inputQueryString","input-query-string"],
        ["inputRequestHeaders","input-request-headers"],
        ["inputRequestBody","input-request-body"],
        ["inputRequestMethod","input-request-method"],
        ["submitButton","submit-button"],
        ["outputConsole","output-console"],
        ["outputResponseCode","output-response-code"],
        ["outputResponseMimetype","output-response-mimetype"],
        ["outputResponseBody","output-response-body"],
        ["scratchpad","scratchpad"],
        ["scratchpadURLEncodeButton","scratchpad-url-encode-button"],
    ]
) {
    htmlElement = document.getElementById(mapping[1]);
    if (htmlElement == null) {
        alert(
            "We failed to get a handle to one of the GUI elements, \n" +
            "this is a programming error! We'll stop loading."
        );
        break;
    }
    this[mapping[0]] = htmlElement;
}

outputConsole.say = function (string) {
    outputConsole.value = string + "\n" + outputConsole.value;
};
outputConsole.say("JavaScript program loaded.");

submitButton.onclick = submit;
submitButton.removeAttribute("disabled");

scratchpadURLEncodeButton.onclick = urlEncodeScratchpadSelectedText;
scratchpadURLEncodeButton.removeAttribute("disabled");
