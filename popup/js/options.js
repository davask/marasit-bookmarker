// Saves options to chrome.storage
function save_options() {
  var route = document.getElementById('route').value;
  chrome.storage.sync.set({
    'dwl.options.route': route,
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  // Use default value route = 'page' and likesColor = true.
  chrome.storage.sync.get({
    'dwl.options.route': 'page'
  }, function(options) {
    document.getElementById('route').value = options['dwl.options.route'];
  });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);