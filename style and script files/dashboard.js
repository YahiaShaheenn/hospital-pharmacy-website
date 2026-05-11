if (!sessionStorage.getItem("currentDoctor")) {

    window.location.href = "LogIn.html";
    alert("Please log in to access the dashboard.");

}

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



let salesHistory = JSON.parse(localStorage.getItem("salesHistory")) || [];

let totalSales = 0;

for (let i = 0; i < salesHistory.length; i++) {
    totalSales += salesHistory[i].total;
}


let totalProfit = 0;

salesHistory.forEach(function (sale) {
    sale.items.forEach(function (item) {
        for (let i = 0; i < supplies.length; i++) {
            if (supplies[i].name === item.name) {
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


document.getElementById("totalsales").textContent = totalSales + " EGP";
document.getElementById("totalprofit").textContent = totalProfit + " EGP";
document.getElementById("expmeds").textContent = expiredMedicines.length;
document.getElementById("lowstock").textContent = lowStockMedicines.length;




const alertsContainer = document.getElementById("boxALERTS");

alertsContainer.innerHTML = "";

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