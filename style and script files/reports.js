if (!sessionStorage.getItem("currentDoctor")) {
    window.location.href = "LogIn.html";
}

const tableBody = document.getElementById("reports_table_body");
let salesHistory = JSON.parse(localStorage.getItem("salesHistory")) || [];

// --- Summary Cards ---
function updateSummaryCards(data) {
    let totalRevenue = 0;
    let totalProfit = 0;
    let totalTransactions = data.length;

    data.forEach(function(sale) {
        totalRevenue += sale.total;
        sale.items.forEach(function(item) {
            for (let i = 0; i < supplies.length; i++) {
                if (supplies[i].name === item.name) {
                    totalProfit += (supplies[i].sellingPrice - supplies[i].costPrice) * item.qty;
                    break;
                }
            }
        });
    });

    document.getElementById("total_revenue").textContent = totalRevenue + " EGP";
    document.getElementById("total_profit").textContent = totalProfit + " EGP";
    document.getElementById("total_transactions").textContent = totalTransactions;
}

// --- Load Sellers ---
function loadSellers() {
    let sellerSelect = document.getElementById("seller_filter");
    let sellers = [];

    salesHistory.forEach(function(sale) {
        if (sale.seller && !sellers.includes(sale.seller)) {
            sellers.push(sale.seller);
        }
    });

    sellers.forEach(function(seller) {
        let option = document.createElement("option");
        option.value = seller;
        option.textContent = seller;
        sellerSelect.appendChild(option);
    });
}

// --- Display Table ---
function displayReports(data) {
    tableBody.innerHTML = "";

    if (data.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="5">No sales found.</td></tr>`;
        return;
    }

    data.forEach(function(sale) {
        sale.items.forEach(function(item) {
            tableBody.innerHTML += `
                <tr>
                    <td>${item.name}</td>
                    <td>${item.qty}</td>
                    <td>${sale.date}</td>
                    <td>${sale.seller || "Unknown"}</td>
                    <td>${item.price * item.qty} EGP</td>
                </tr>
            `;
        });
    });

    updateSummaryCards(data);
}

// --- Filter ---
document.getElementById("filter_button").addEventListener("click", function() {
    const medicineValue = document.getElementById("medicine_filter").value.toLowerCase();
    const sellerValue = document.getElementById("seller_filter").value;
    const dateValue = document.getElementById("date_filter").value;

    let filteredSales = [];

    salesHistory.forEach(function(sale) {
        let filteredItems = sale.items.filter(function(item) {
            return item.name.toLowerCase().includes(medicineValue);
        });

        let dateMatch = true;
        if (dateValue) {
            let saleDate = new Date(sale.date).toLocaleDateString("en-CA");
            dateMatch = saleDate === dateValue;
        }

        if (filteredItems.length > 0 && (sellerValue === "" || sale.seller === sellerValue) && dateMatch) {
            filteredSales.push({ ...sale, items: filteredItems });
        }
    });

    displayReports(filteredSales);
});

// --- Reset ---
document.getElementById("reset_button").addEventListener("click", function() {
    document.getElementById("medicine_filter").value = "";
    document.getElementById("seller_filter").value = "";
    document.getElementById("date_filter").value = "";
    displayReports(salesHistory);
});

// --- Print ---
document.getElementById("print_button").addEventListener("click", function() {
    window.print();
});

// --- Export to CSV ---
document.getElementById("export_button").addEventListener("click", function() {
    if (salesHistory.length === 0) {
        alert("No sales data to export!");
        return;
    }

    let csv = "Medicine Name,Quantity,Date,Seller,Revenue\n";

    salesHistory.forEach(function(sale) {
        sale.items.forEach(function(item) {
            csv += `${item.name},${item.qty},${sale.date},${sale.seller || "Unknown"},${item.price * item.qty} EGP\n`;
        });
    });

    let blob = new Blob([csv], { type: "text/csv" });
    let url = URL.createObjectURL(blob);
    let link = document.createElement("a");
    link.href = url;
    link.download = "SalesReport.csv";
    link.click();
    URL.revokeObjectURL(url);
});

// --- Init ---
loadSellers();
displayReports(salesHistory);