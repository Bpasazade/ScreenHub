$(window).on("load", function() {
    $("#shutdownBtn").on("click", function() {
        shutdown();
    });

    $("#logoutBtn").on("click", function() {
        logout();
    });

    $("#restartBtn").on("click", function() {
        restart();
    });
});

// Shutdown
function shutdown() {
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