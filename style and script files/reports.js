
const tableBody = document.getElementById("reports_table_body");
const sellerFilter = document.getElementById("seller_filter");

let salesHistory =
    JSON.parse(localStorage.getItem("salesHistory")) || [];

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

const medicineFilter =
    document.getElementById("medicine_filter");

function loadMedicineOptions() {

    for (let i = 0; i < supplies.length; i++) {

        medicineFilter.innerHTML += `

            <option value="${supplies[i].name}">
                ${supplies[i].name}
            </option>

        `;
    }

}

function loadSellerOptions() {
    sellerFilter.innerHTML = "<option value=''>All Sellers</option>";
    const doctors = JSON.parse(localStorage.getItem("doctors")) || [];
    doctors.forEach(function (doctor) {
        sellerFilter.innerHTML += `
            <option value="${doctor.username}">${doctor.username}</option>
        `;
    });
}

loadMedicineOptions();
loadSellerOptions();

function updateCards(data) {

    let totalSales = 0;
    let totalProfit = 0;
    let totalMedicinesSold = 0;

    data.forEach(function (sale) {

        sale.items.forEach(function (item) {

            let itemSales =
                item.price * item.qty;

            totalSales += itemSales;

            totalMedicinesSold += item.qty;

            for (let i = 0; i < supplies.length; i++) {

                if (supplies[i].name === item.name) {

                    let itemProfit =
                        (item.price - supplies[i].costPrice)
                        * item.qty;

                    totalProfit += itemProfit;

                    break;

                }

            }

        });

    });

    document.getElementById("total_sales")
        .textContent =
        totalSales + " EGP";

    document.getElementById("total_profit")
        .textContent =
        totalProfit + " EGP";

    document.getElementById("total_sales_count")
        .textContent =
        totalMedicinesSold;

}

updateCards(salesHistory);
displayReports(salesHistory);

document.getElementById("filter_button")
    .addEventListener("click", function () {

        const medicineValue =
            document.getElementById("medicine_filter")
                .value.toLowerCase();

        const sellerValue =
            document.getElementById("seller_filter").value;

        let filteredSales = [];

        salesHistory.forEach(function (sale) {

            let filteredItems = sale.items.filter(function (item) {

                let medicineMatch =
                    item.name.toLowerCase()
                        .includes(medicineValue);

                return medicineMatch;

            });

            if (
                filteredItems.length > 0 &&
                (sellerValue === "" ||
                    sale.seller === sellerValue)
            ) {

                filteredSales.push({

                    ...sale,

                    items: filteredItems

                });

            }

        });

        displayReports(filteredSales);
        updateCards(filteredSales);

    });

document.getElementById("reset_button")
    .addEventListener("click", function () {

        document.getElementById("date_filter").value = "";

        document.getElementById("medicine_filter").value = "";

        document.getElementById("seller_filter").value = "";

        displayReports(salesHistory);

        updateCards(salesHistory);

    });


document.getElementById("print_button")
    .addEventListener("click", function () {

        window.print();

    });

document.getElementById("export_button").addEventListener("click", function () {
    if (salesHistory.length === 0) {
        alert("No sales data to export!");
        return;
    }

    let csv = "Medicine Name,Quantity,Date,Time,Seller,Sales\n";

    salesHistory.forEach(function (sale) {
        sale.items.forEach(function (item) {
            csv += `${item.name},${item.qty},${sale.date},${sale.time || "No time"},${sale.seller || "Unknown"},${item.price * item.qty} EGP\n`;
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

window.onload = function () {
    if (!sessionStorage.getItem("currentDoctor")) {

        window.location.href = "LogIn.html";
        alert("Please log in to access the Reports.");

    }
}

