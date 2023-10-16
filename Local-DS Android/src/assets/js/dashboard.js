$(window).on("load", function(event) {
    event.preventDefault();
    // Dashboard
    // Dashboard: Time and Date
    var date = new Date();
    var day = date.getDate();
    var month = date.getMonth();
    var year = date.getFullYear();
    var hour = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds();
    var dayName = date.getDay();
    var monthName = date.getMonth();
    var dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    var ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12;
    hour = hour ? hour : 12;
    minute = minute < 10 ? '0'+minute : minute;
    second = second < 10 ? '0'+second : second;
    var time = hour + ':' + minute + ':' + second + ' ' + ampm;
    var date = dayNames[dayName] + ', ' + monthNames[monthName] + ' ' + day + ', ' + year;
    $("#time").text(time);
    $("#date").text(date);

    // Dashboard: CPU Usage
    var cpuUsage = 0;
    var cpuUsageInterval = setInterval(function() {
        cpuUsage = Math.floor(Math.random() * 100) + 1;
        $("#cpu-usage").text(cpuUsage + "%");
    }, 1000);

    // Dashboard: Memory Usage
    var memoryUsage = 0;
    var memoryUsageInterval = setInterval(function() {
        memoryUsage = Math.floor(Math.random() * 100) + 1;
        $("#memory-usage").text(memoryUsage + "%");
    }, 1000);

    // Dashboard: Disk Usage
    var diskUsage = 0;
    var diskUsageInterval = setInterval(function() {
        diskUsage = Math.floor(Math.random() * 100) + 1;
        $("#disk-usage").text(diskUsage + "%");
    }, 1000);


});