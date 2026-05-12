const tableBody = document.getElementById("reports_table_body");
const sellerFilter = document.getElementById("seller_filter");
const medicineFilter = document.getElementById("medicine_filter");
const dateFilter = document.getElementById("date_filter");
const inventoryTableBody = document.getElementById("inventory_report_body");
//el taht di bet3et el medicine name dropdown beta3et el inventory report
const inventoryNameFilter = document.getElementById("inventory_name_filter");
const inventoryCategoryFilter = document.getElementById("inventory_category_filter");
const stockFilter = document.getElementById("stock_filter");
const salesReportContainer = document.getElementById("sales_report_container");
const inventoryReportContainer = document.getElementById("inventory_report_container");

let salesHistory = JSON.parse(localStorage.getItem("salesHistory")) || [];
let currentSalesData = salesHistory;
let currentInventoryData = supplies;

dateFilter.max = new Date().toISOString().split("T")[0];

//show/hide reports

function showSalesReport() {

    salesReportContainer.classList.remove("hidden");
    inventoryReportContainer.classList.add("hidden");

}


function showInventoryReport() {

    inventoryReportContainer.classList.remove("hidden");
    salesReportContainer.classList.add("hidden");

}

//sales report

function displayReports(data) {

    tableBody.innerHTML = "";

    data.forEach(function (sale) {

        sale.items.forEach(function (item) {

            tableBody.innerHTML += `

                <tr>

                    <td>${item.name}</td>
                    <td>${item.qty}</td>
                    <td>${sale.date}</td>
                    <td>${sale.time || "No time"}</td>
                    <td>${item.price} EGP</td>
                    <td>${item.price * item.qty} EGP</td>
                    <td>${sale.payment}</td>
                    <td>${sale.seller}</td>

                </tr>

            `;

        });

    });

}


function loadMedicineOptions() {

    medicineFilter.innerHTML = `<option value="">All Medicines</option>`;

    for (let i = 0; i < supplies.length; i++) {

        medicineFilter.innerHTML += `

            <option value="${supplies[i].name}">${supplies[i].name}</option>

        `;

    }

}


function loadSellerOptions() {

    sellerFilter.innerHTML = `<option value="">All Sellers</option>`;

    const doctors = JSON.parse(localStorage.getItem("doctors")) || [];

    doctors.forEach(function (doctor) {

        sellerFilter.innerHTML += `

            <option value="${doctor.username}">${doctor.username}</option>

        `;

    });

}


function updateCards(data) {

    let totalSales = 0;
    let totalProfit = 0;
    let totalMedicinesSold = 0;

    data.forEach(function (sale) {

        sale.items.forEach(function (item) {

            let itemSales = item.price * item.qty;

            totalSales += itemSales;

            totalMedicinesSold += item.qty;

            for (let i = 0; i < supplies.length; i++) {

                if (supplies[i].name === item.name) {

                    let itemProfit = (item.price - supplies[i].costPrice)* item.qty;

                    totalProfit += itemProfit;

                    break;

                }

            }

        });

    });

    document.getElementById("total_sales").textContent =totalSales + " EGP";
    document.getElementById("total_profit").textContent = totalProfit + " EGP";
    document.getElementById("total_sales_count").textContent = totalMedicinesSold;

}

//inventory report functions

function getStockStatus(item) {

    if (item.stock === 0) {

        return "Out of Stock";

    }

    else if (item.stock <= item.minStock) {

        return "Low Stock";

    }

    else {

        return "Available";

    }

}


function displayInventoryReport(data) {

    inventoryTableBody.innerHTML = "";

    data.forEach(function (item) {

        let status = getStockStatus(item);

        inventoryTableBody.innerHTML += `

            <tr>

                <td>${item.name}</td>
                <td>${item.category}</td>
                <td>${item.costPrice} EGP</td>
                <td>${item.sellingPrice} EGP</td>
                <td>${item.stock}</td>
                <td>${item.minStock}</td>
                <td>${item.expiryDate}</td>
                <td>${status}</td>

            </tr>

        `;

    });

}


function loadInventoryMedicineOptions() {

    inventoryNameFilter.innerHTML = `<option value="">All Medicines</option>`;

    supplies.forEach(function (item) {

        inventoryNameFilter.innerHTML += `

            <option value="${item.name}">${item.name}</option>

        `;

    });

}


function loadInventoryCategories() {

    inventoryCategoryFilter.innerHTML = `<option value="">All Categories</option>`;

    let categories = [];

    supplies.forEach(function (item) {

        if (!categories.includes(item.category)) {

            categories.push(item.category);

        }

    });

    categories.forEach(function (category) {

        inventoryCategoryFilter.innerHTML += `

            <option value="${category}">${category}</option>

        `;

    });

}

//sales report filter

document.getElementById("filter_button")
    .addEventListener("click", function () {

        const dateValue = dateFilter.value;
        const medicineValue = medicineFilter.value.toLowerCase();
        const sellerValue = sellerFilter.value;

        let selectedDateText = "";

        if (dateValue !== "") {

            selectedDateText =
                new Date(dateValue).toLocaleDateString("en-US", {

                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric"

                });

        }

        let filteredSales = [];

        salesHistory.forEach(function (sale) {

            let dateMatch = dateValue === "" || sale.date === selectedDateText;

            let sellerMatch = sellerValue === "" || sale.seller === sellerValue;

            let filteredItems = sale.items.filter(function (item) {

                    let medicineMatch = item.name.toLowerCase().includes(medicineValue);

                    return medicineMatch;

                });

            if (
                dateMatch && sellerMatch && filteredItems.length > 0
            ) {

                filteredSales.push({

                    ...sale,
                    items: filteredItems

                });

            }

        });

        currentSalesData = filteredSales;

        displayReports(currentSalesData);
        updateCards(currentSalesData);

    });


document.getElementById("reset_button").addEventListener("click", function () {

        dateFilter.value = "";
        medicineFilter.value = "";
        sellerFilter.value = "";

        currentSalesData = salesHistory;

        displayReports(currentSalesData);
        updateCards(currentSalesData);

    });

//inventory report filter

document.getElementById("inventory_filter_button").addEventListener("click", function () {

        const nameValue = inventoryNameFilter.value;

        const categoryValue = inventoryCategoryFilter.value;

        const stockValue = stockFilter.value;

        let filteredInventory = supplies.filter(function (item) {

                let nameMatch = nameValue === "" || item.name === nameValue;

                let categoryMatch = categoryValue === "" || item.category === categoryValue;

                let stockMatch = true;

                if (stockValue === "available") {

                    stockMatch = item.stock > item.minStock;

                }

                else if (stockValue === "low") {

                    stockMatch =
                        item.stock > 0 && item.stock <= item.minStock;

                }

                else if (stockValue === "out") {

                    stockMatch = item.stock === 0;

                }

                return nameMatch && categoryMatch && stockMatch;

            });

        currentInventoryData = filteredInventory;

        displayInventoryReport(currentInventoryData);

    });


document.getElementById("inventory_reset_button").addEventListener("click", function () {

        inventoryNameFilter.value = "";
        inventoryCategoryFilter.value = "";
        stockFilter.value = "";

        currentInventoryData = supplies;

        displayInventoryReport(currentInventoryData);

    });

//print sales report function

document.getElementById("print_button").addEventListener("click", function () {

        document.body.classList.add("print-sales");
        window.print();
        document.body.classList.remove("print-sales");

    });

//print inventory report function

document.getElementById("inventory_print_button").addEventListener("click", function () {

        document.body.classList.add("print-inventory");
        window.print();
        document.body.classList.remove("print-inventory");

    });

//export sales report function

document.getElementById("export_button").addEventListener("click", function () {

        if (currentSalesData.length === 0) {

            alert("No sales data to export!");

            return;

        }

        let csv = "Medicine Name,Quantity,Date,Time,Unit Price,Total Price,Payment Method,Seller\n";

        currentSalesData.forEach(function (sale) {

            sale.items.forEach(function (item) {

                csv +=
                    `${item.name},${item.qty},${sale.date},${sale.time || "No time"},${item.price} EGP,${item.price * item.qty} EGP,${sale.payment},${sale.seller}\n`;

            });

        });

        let blob = new Blob([csv], { type: "text/csv" });

        let url =URL.createObjectURL(blob);

        let link =document.createElement("a");

        link.href = url;

        link.download = "SalesReport.csv";

        link.click();

        URL.revokeObjectURL(url);

    });

//export inventory report function

document.getElementById("inventory_export_button").addEventListener("click", function () {

        if (currentInventoryData.length === 0) {

            alert("No inventory data to export!");

            return;

        }

        let csv ="Medicine Name,Category,Cost Price,Selling Price,Stock,Minimum Stock,Expiry Date,Status\n";

        currentInventoryData.forEach(function (item) {

            let status =getStockStatus(item);

            csv +=`${item.name},${item.category},${item.costPrice} EGP,${item.sellingPrice} EGP,${item.stock},${item.minStock},${item.expiryDate},${status}\n`;

        });

        let blob =new Blob([csv], { type: "text/csv" });

        let url =URL.createObjectURL(blob);

        let link =document.createElement("a");

        link.href = url;

        link.download = "InventoryReport.csv";

        link.click();

        URL.revokeObjectURL(url);

    });

// login check

window.addEventListener("load", function () {

    if (!sessionStorage.getItem("currentDoctor")) {

        alert("Please log in to access the Reports.");

        window.location.href = "LogIn.html";

    }

});


//page start

loadMedicineOptions();
loadSellerOptions();

loadInventoryMedicineOptions();
loadInventoryCategories();

displayReports(salesHistory);
updateCards(salesHistory);
displayInventoryReport(supplies);