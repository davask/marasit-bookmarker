/* OMNIBOX */
chrome.omnibox.onInputChanged.addListener(function(text, suggest) {
    suggest([
      // {content: text + " one", description: "the first one"},
      // {content: text + " number two", description: "the second entry"}
    ]);
});
chrome.omnibox.onInputEntered.addListener(function(text) {
    // alert('You just typed "' + text + '"');
});

console.log('dwl-omnibox.js loaded');