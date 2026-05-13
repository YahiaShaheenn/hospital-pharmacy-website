window.onload = function() {
if (!sessionStorage.getItem("currentDoctor")) {

    window.location.href = "LogIn.html";
    alert("Please log in to access the dashboard.");

}
};

document.getElementById("logout").addEventListener("click", function () {
    sessionStorage.removeItem("currentDoctor");
    sessionStorage.setItem("admin", "false");
    window.location.href = "LogIn.html";
});

const isAdmin = sessionStorage.getItem("admin") === "true";
if (!isAdmin) {
    document.getElementById("WelcMsg").textContent = "Welcome Back, Dr. " + sessionStorage.getItem("currentDoctor") + "!";
}
else {
    document.getElementById("WelcMsg").textContent = "Welcome to the Admin Dashboard!";
}



const dateElement = document.getElementById("date");

const today = new Date();

dateElement.textContent = today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric"
});




let salesHistory = JSON.parse(localStorage.getItem("salesHistory")) || []; // if no sales use empty array

const todayDate = dateElement.textContent;

// Filter sales history to get today's sales, sales history gowaha date w total 
let todaySales = salesHistory.filter(function(sale) {
    return sale.date === todayDate;
});



let totalSales = 0;

// Calculate total sales for today
for (let i = 0; i < todaySales.length; i++) {
    totalSales += todaySales[i].total;
}


let totalProfit = 0;

// Calculate total profit for today
todaySales.forEach(function (sale) {  // Loop through each sale
    sale.items.forEach(function (item) { // Loop through each item in the sale
        for (let i = 0; i < supplies.length; i++) {
            if (supplies[i].name === item.name) {  //check if the suppplies name matches the item name, sales.item fiha el sold cart items
                let profit = (supplies[i].sellingPrice - supplies[i].costPrice) * item.qty;
                totalProfit += profit;
                break;
            }
        }
    });
});



let expiredMedicines = [];

for (let i = 0; i < supplies.length; i++) {
    if (new Date(supplies[i].expiryDate) < new Date()) { 
        expiredMedicines.push(supplies[i]);
    }
}


let lowStockMedicines = [];

for (let i = 0; i < supplies.length; i++) {
    if (supplies[i].stock <= supplies[i].minStock) {
        lowStockMedicines.push(supplies[i]);
    }
}


if (todaySales.length === 0) {
    document.getElementById("totalsales").textContent = "No sales today";
    document.getElementById("totalprofit").textContent = "No profit today";
} else {
    document.getElementById("totalsales").textContent = totalSales + " EGP";
    document.getElementById("totalprofit").textContent = totalProfit + " EGP";
}


document.getElementById("expmeds").textContent = expiredMedicines.length;
document.getElementById("lowstock").textContent = lowStockMedicines.length;




const alertsContainer = document.getElementById("boxALERTS");

alertsContainer.innerHTML = ""; //clears html of the container before adding new alerts, so that we don't have duplicate alerts when we refresh the page

for (let i = 0; i < expiredMedicines.length; i++) {
    createAlert(
        "danger",
        "warning",
        "Expired Medicine",
        expiredMedicines[i].name + " has expired and should be removed from stock."
    );
}

for (let i = 0; i < lowStockMedicines.length; i++) {
    createAlert(
        "warning",
        "inventory_2",
        "Low Stock Warning",
        lowStockMedicines[i].name + " stock is low. Current stock: " + lowStockMedicines[i].stock
    );
}

if (expiredMedicines.length === 0 && lowStockMedicines.length === 0) {
    createAlert(
        "safe",
        "check_circle",
        "No Alerts",
        "All medicines are currently within safe stock and expiry limits."
    );
}

function createAlert(type, icon, title, message) {

    const alertCard = document.createElement("div");

    alertCard.className = "alert-card " + type; 

    alertCard.innerHTML = `
        <span class="material-icons">${icon}</span>

        <div>
            <h3>${title}</h3>
            <p>${message}</p>
        </div>
    `;

    alertsContainer.appendChild(alertCard);
}



let medicineSales = {};

todaySales.forEach(function(sale) {

    sale.items.forEach(function(item) {

        //checks if the medicine name already exits in the medicineSales object,law la it adds the quantity sold to the existing value
        if (medicineSales[item.name]) {
            medicineSales[item.name] += item.qty;
        } else {
            medicineSales[item.name] = item.qty; //item.name is key fa mslan panadol, item.qty is value fa mslan 2
        }

    });

});

let topMedsBox = document.getElementById("mostBox");

topMedsBox.innerHTML = "";

//func transforms the medicineSales object into an array of [medicineName, quantitySold] pairs, then sorts it in descending order based on quantity sold, so that the most sold medicines are at the top of the list.
let sortedMedicines = Object.entries(medicineSales).sort(function(a, b) { 
    return b[1] - a[1];
});



const mostSoldSection = document.querySelector(".mostSold");

if (sortedMedicines.length === 0) {

    mostSoldSection.style.display = "none";

} else {

    for (let i = 0; i < sortedMedicines.length && i < 4; i++) {

        topMedsBox.innerHTML += `
            <div class="top-med-card">
                <span class="material-icons">medication</span>
                <div>
                    <h3>${sortedMedicines[i][0]}</h3> 
                    <p>Quantity Sold: ${sortedMedicines[i][1]}</p> 
                </div>
            </div>
        `;

    }

}



let employeeTotals = {};

salesHistory.forEach(function(sale){

    let seller = sale.seller;

    if(employeeTotals[seller]){
        employeeTotals[seller] += sale.total;
    } else {
        employeeTotals[seller] = sale.total;
    }

});

let sortedEmployees = Object.entries(employeeTotals).sort(function(a, b){
    return b[1] - a[1];
});

let employeeSection = document.getElementById("employeeMonthSection");
let employeeBox = document.getElementById("employeeMonthBox");

employeeBox.innerHTML = "";

if(sortedEmployees.length === 0){

    employeeSection.style.display = "none";

} else {

    let topEmployee = sortedEmployees[0][0];
    let topSales = sortedEmployees[0][1];

    employeeBox.innerHTML = `
        <div class="employee-month-card">

            <div class="trophy-side">
                <span class="material-icons trophy-icon">emoji_events</span>
                <div class="shine"></div>
            </div>

            <div class="employee-info">
                <p class="top-text">TOP PERFORMER</p>
                <h1>${topEmployee}</h1>

                <div class="sales-box">
                    <span class="material-icons">payments</span>
                    <p>Total Sales: ${topSales} EGP</p>
                </div>
            </div>

            <div class="badge-side">
                <div class="rank-circle">#1</div>
            </div>

        </div>
    `;
}