if(!sessionStorage.getItem("currentDoctor")) {

   window.location.href = "LogIn.html";
   alert("Please log in to access the dashboard.");

}

document.getElementById("logout").addEventListener("click", function() {
    sessionStorage.removeItem("currentDoctor");
    window.location.href = "LogIn.html";
});

document.getElementById("WelcMsg").textContent = "Welcome Back, Dr. " + sessionStorage.getItem("currentDoctor") + "!";

// const medicines = [
//     {
//         name: "Panadol",
//         costPrice: 30,
//         sellingPrice: 50,
//         stock: 40,
//         minStock: 10,
//         sold: 120,
//         expiryDate: "2026-12-01"
//     },

//     {
//         name: "Brufen",
//         costPrice: 40,
//         sellingPrice: 70,
//         stock: 5,
//         minStock: 10,
//         sold: 90,
//         expiryDate: "2027-01-10"
//     },

//     {
//         name: "Augmentin",
//         costPrice: 80,
//         sellingPrice: 120,
//         stock: 3,
//         minStock: 8,
//         sold: 70,
//         expiryDate: "2024-03-15"
//     }
// ];


// let totalSales = 0;

// for(let i = 0; i < medicines.length; i++) {
//     totalSales += medicines[i].sellingPrice * medicines[i].sold;
// }
// console.log(totalSales);


// let totalProfit = 0;

// for(let i = 0; i < medicines.length; i++) {
//     totalProfit += (medicines[i].sellingPrice - medicines[i].costPrice) * medicines[i].sold;
// }  
// console.log(totalProfit);


// let expiredMedicines = [];

// for(let i = 0; i < medicines.length; i++){

//     if(new Date(medicines[i].expiryDate) < new Date()){
//         expiredMedicines.push(medicines[i]);
//     }
// }


// let lowStockMedicines = [];

// for(let i = 0; i < medicines.length; i++){

//     if(medicines[i].stock <= medicines[i].minStock){
//         lowStockMedicines.push(medicines[i]);
//     }
// }


// document.getElementById("totalsales").textContent = totalSales +"EGP";
// document.getElementById("totalprofit").textContent = totalProfit +"EGP";
// document.getElementById("expmeds").textContent = expiredMedicines.length;
// document.getElementById("lowstock").textContent = lowStockMedicines.length;



const dateElement = document.getElementById("date");

const today = new Date();

dateElement.textContent = today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric"
});



// const alerts = [
//     {
//         type: "danger",
//         icon: "warning",
//         title: "Expired Medicine",
//         message: "1 medicine has expired and should be removed from stock."
//     },
//     {
//         type: "warning",
//         icon: "inventory_2",
//         title: "Low Stock Warning",
//         message: "2 medicines are below the minimum stock level."
//     }
// ];

// const alertsContainer = document.getElementById("boxALERTS");

// alerts.forEach(function(alert){
//     const alertCard = document.createElement("div");

//     alertCard.className = `alert-card ${alert.type}`;

//     alertCard.innerHTML = `
//         <span class="material-icons">${alert.icon}</span>

//         <div>
//             <h3>${alert.title}</h3>
//             <p>${alert.message}</p>
//         </div>
//     `;

//     alertsContainer.appendChild(alertCard);
// });






let salesHistory = JSON.parse(localStorage.getItem("salesHistory")) || [];

let totalSales = 0;

for (let i = 0; i < salesHistory.length; i++) {
    totalSales += salesHistory[i].total;
}


// let totalProfit = 0;

// for (let i = 0; i < supplies.length; i++) {
//     totalProfit += supplies[i].sellingPrice - supplies[i].costPrice;
// }


let totalProfit = 0;

salesHistory.forEach(function(sale) {
    sale.items.forEach(function(item) {
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