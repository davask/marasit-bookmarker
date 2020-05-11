/* custom made or copied function to speed up dev */

window.Date || document.write('<script src="assets/vendor/Datejs/build/date.js"><\/script>');

if (typeof convertToDate != 'function') {
    var convertToDate = function (unix_timestamp) {
        // Create a new JavaScript Date object based on the timestamp
        // multiplied by 1000 so that the argument is in milliseconds, not seconds.
        var date = new Date(unix_timestamp);
        // Hours part from the timestamp
        var hours = "0" + date.getHours();
        // Minutes part from the timestamp
        var minutes = "0" + date.getMinutes();
        // Seconds part from the timestamp
        var seconds = "0" + date.getSeconds();
        // Hours part from the timestamp
        var day = "0" + date.getDate();
        // Minutes part from the timestamp
        var month = "0" + (date.getMonth() + 1);
        // Seconds part from the timestamp
        var year = date.getFullYear();

        // Will display time in 10:30:23 format
        var formattedTime = hours.substr(-2) + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
        var formattedDate = year + '/' + month.substr(-2) + '/' + day.substr(-2);
        return formattedDate;
    };
};

