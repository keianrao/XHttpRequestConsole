
function submit() {

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
//submitButton.removeAttribute("disabled");

scratchpadURLEncodeButton.onclick = urlEncodeScratchpadSelectedText;
scratchpadURLEncodeButton.removeAttribute("disabled");
