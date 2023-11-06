$(window).on('load', function () {

    // Company Name
    // $("#companyName").text(getCompanyName());
    $("#companyName").text("Ankara Büyükşehir Belediyesi");

    // Time
    var date = new Date();
    var hours = date.getHours();
    var minutes = date.getMinutes();

    $("#time").text(hours + ":" + minutes + "  " + date.toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' }));

    // CPU Heat
    //var cpuHeat = getCpuHeat();
    var cpuHeat = 95;
    var cpuHeatText = $('#cpuHeat');
    cpuHeatText.text(cpuHeat + " °C");
    var colorsCpu = heatDivColor(cpuHeat);
    $("#cpuHeatDiv").css('background-color', colorsCpu[0]);
    $("#cpuHeatDiv").css('color', colorsCpu[1]);
    if (colorsCpu[1] == "#FFFFFF") {
        $("#cpuThermometer").attr("src", "../assets/img/dashboard/thermometer.svg");
    } else {
        $("#cpuThermometer").attr("src", "../assets/img/dashboard/thermometer-black.svg");
    }

    if (cpuHeat >= 75) {
        console.log("CPU Heat is greater than 75");
        $("#cpuAlert").attr("style", "visibility: visible !important; background-color: #FF222208 !important");
    } else {
        $("#cpuAlert").attr("style", "visibility: hidden !important");
    } 

    // CPU Donut
    var ctx = $('#cpuDonut').get(0).getContext('2d');
    //var cpuPercentage = getCpuPercentage(); // Get this from the server
    var cpuPercentage = 50;
    $("#cpuUsagePercentage").text(cpuPercentage + "% Kullanım");
    var data = {
        datasets: [{
            data: [cpuPercentage, 100 - cpuPercentage],
            backgroundColor: ['#05AF07', '#EAEAEA'],
        }]
    };

    var cpuDonut = new Chart(ctx, {
        type: 'doughnut',
        data: data,
        options: {
            cutoutPercentage: 70,
            percentageInnerCutout: 80,
        },
        plugins: [{
            id: 'text',
            beforeDraw: function(chart, a, b) {
                var width = chart.width,
                    height = chart.height,
                    ctx = chart.ctx;
            
                ctx.restore();
                ctx.font = "900 42px 'Sofia-Pro-Regular', sans-serif";
                ctx.textBaseline = "middle"
            
                var text = cpuPercentage + "%",
                textX = Math.round((width - ctx.measureText(text).width) / 2),
                paddingTop = 10
                textY = height / 2 + paddingTop;
        
              ctx.fillText(text, textX, textY);
              ctx.save();
            }
        }]
    });

    // Update the center text
    var cpuPercentageText = $('#cpuPercentageText');
    cpuPercentageText.textContent = cpuPercentage; // Change this text as needed
    var chartContainer = $('#cpuDonut').parent();
    ctx.canvas.width = chartContainer.clientWidth;
    ctx.canvas.height = chartContainer.clientHeight;

    // Memory Donut
    var ctx = $('#memoryDonut').get(0).getContext('2d');
    //var memoryPercentage = getMemoryPercentage(); // Get this from the server
    var memoryPercentage = 76;
    $("#memoryUsagePercentage").text(memoryPercentage + "% Kullanım");

    var data = {
        datasets: [{
            data: [memoryPercentage, 100 - memoryPercentage],
            backgroundColor: ['#B82FE8', '#EAEAEA'],
        }]
    };

    var memoryDonut = new Chart(ctx, {
        type: 'doughnut',
        data: data,
        options: {
            cutoutPercentage: 70,
        },
        plugins: [{
            id: 'text',
            beforeDraw: function(chart, a, b) {
                var width = chart.width,
                    height = chart.height,
                    ctx = chart.ctx;
            
                ctx.restore();
                ctx.font = "900 42px 'Sofia-Pro-Regular', sans-serif";
                ctx.textBaseline = "middle"
            
                var text = memoryPercentage + "%",
                textX = Math.round((width - ctx.measureText(text).width) / 2),
                paddingTop = 10
                textY = height / 2 + paddingTop;
        
              ctx.fillText(text, textX, textY);
              ctx.save();
            }
        }]
    });

    // Update the center text
    var memoryPercentageText = $('#memoryPercentageText');
    memoryPercentageText.textContent = memoryPercentage; // Change this text as needed
    var chartContainer = $('#memoryDonut').parent();
    ctx.canvas.width = chartContainer.clientWidth;
    ctx.canvas.height = chartContainer.clientHeight;

    // Disk Donut
    var ctx = $('#diskDonut').get(0).getContext('2d');
    var diskPercentage = 85;
    $("#diskUsagePercentage").text(diskPercentage + "% Kullanım");

    if (diskPercentage > 75) {
        $("#diskAlert").attr("style", "visibility: visible !important; background-color: #FF222208 !important");
    } else {
        $("#diskAlert").attr("style", "visibility: hidden !important");
    }

    var data = {
        datasets: [{
            data: [diskPercentage, 100 - diskPercentage],
            backgroundColor: ['#04A3DA', '#EAEAEA'],
        }]
    };

    var diskDonut = new Chart(ctx, {
        type: 'doughnut',
        data: data,
        options: {
            cutoutPercentage: 70,
        },
        plugins: [{
            id: 'text',
            beforeDraw: function(chart, a, b) {
                var width = chart.width,
                    height = chart.height,
                    ctx = chart.ctx;
            
                ctx.restore();
                ctx.font = "900 42px 'Sofia-Pro-Regular', sans-serif";
                ctx.textBaseline = "middle"
            
                var text = diskPercentage + "%",
                textX = Math.round((width - ctx.measureText(text).width) / 2),
                paddingTop = 10
                textY = height / 2 + paddingTop;
        
              ctx.fillText(text, textX, textY);
              ctx.save();
            }
        }]
    });

    // Update the center text
    var diskPercentageText = $('#diskPercentageText');
    diskPercentageText.textContent = diskPercentage; // Change this text as needed
    var chartContainer = $('#diskDonut').parent();
    ctx.canvas.width = chartContainer.clientWidth;

    // Last visitor
    //var lastVisitDate = getLastVisitDate();
    var lastDate = Date.now();
    lastVisitDate = new Date(lastDate).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric'});
    lastVisitTime = new Date(lastDate).toLocaleTimeString('tr-TR', { hour: 'numeric', minute: 'numeric' });
    $("#lastVisitList").append(`<li class="list-group-item d-flex justify-content-between">
                                    <h5>${lastVisitDate}</h5>
                                    <h5>${lastVisitTime}</h5>
                                </li>`);

});

function heatDivColor(heat) {
    if (heat <= 50) {
        return ["#FFCC00", "#000000"];
    } else if (heat > 50 && heat <= 75) {
        return ["#F89500", "#FFFFFF"]
    } else {
        return ["#CE0404", "#FFFFFF"];
    }
}

// Company Name
async function getCompanyName() {
    try {
        const response = await fetch('/companyName');
        const data = await response.json();
        return data.companyName;
    } catch (error) {
        console.error(error);
    }
}

// CPU Heat
async function getCpuHeat() {
    try {
        const response = await fetch('/cpuHeat');
        const data = await response.json();
        return data.cpuHeat;
    } catch (error) {
        console.error(error);
    }
}

// CPU Usage
async function getCpuPercentage() {
    try {
        const response = await fetch('/cpu');
        const data = await response.json();
        return data.cpuPercentage;
    } catch (error) {
        console.error(error);
    }
}

// Memory Usage
async function getMemoryPercentage() {
    try {
        const response = await fetch('/memory');
        const data = await response.json();
        return data.memoryPercentage;
    } catch (error) {
        console.error(error);
    }
}

// Disk Usage
async function getDiskPercentage() {
    try {
        const response = await fetch('/disk');
        const data = await response.json();
        return data.diskPercentage;
    } catch (error) {
        console.error(error);
    }
}

// Last visitor
async function getLastVisitDate() {
    try {
        const response = await fetch('/lastVisitDate');
        const data = await response.json();
        return data.lastVisitor;
    } catch (error) {
        console.error(error);
    }
}