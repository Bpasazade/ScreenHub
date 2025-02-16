$(window).on("load", function() {
    console.log("Common.js");
    $("#shutdownConfirm").on("click", function() {
        shutdown();
    });

    $("#logoutConfirm").on("click", function() {
        logout();
    });

    $("#restartConfirm").on("click", function() {
        restart();
    });
});

// Shutdown
function shutdown() {
    console.log("Shutdown");
    $.ajax({
        url: "/shutdown",
        type: "POST",
        success: function() {
            console.log("Shutdown");
        },
        error: function() {
            console.log("Error");
        }
    });
}

// Logout
function logout() {
    console.log("Logout");
    $.ajax({
        url: "/logout",
        type: "POST",
        success: function() {
            console.log("Logout");
        },
        error: function() {
            console.log("Error");
        }
    });
}

// Restart
function restart() {
    console.log("Restart");
    $.ajax({
        url: "/restart",
        type: "POST",
        success: function() {
            console.log("Restart");
        },
        error: function() {
            console.log("Error");
        }
    });
}