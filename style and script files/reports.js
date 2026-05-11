const tableBody = document.getElementById("reports_table_body");

let salesHistory =
JSON.parse(localStorage.getItem("salesHistory")) || [];

function displayReports(data){

    tableBody.innerHTML = "";

    data.forEach(function(sale){

        sale.items.forEach(function(item){

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

const dateFilter =
document.getElementById("date_filter");

dateFilter.max =
new Date().toISOString().split("T")[0];

function loadMedicineOptions(){

    for(let i = 0; i < supplies.length; i++){

        medicineFilter.innerHTML += `

            <option value="${supplies[i].name}">
                ${supplies[i].name}
            </option>

        `;
    }

}

loadMedicineOptions();

function updateCards(data){

    let totalSales = 0;
    let totalProfit = 0;
    let totalMedicinesSold = 0;

    data.forEach(function(sale){

        sale.items.forEach(function(item){

            let itemSales =
            item.price * item.qty;

            totalSales += itemSales;

            totalMedicinesSold += item.qty;

            for(let i = 0; i < supplies.length; i++){

                if(supplies[i].name === item.name){

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

const inventoryTableBody =
document.getElementById("inventory_report_body");

function displayInventoryReport(){

    inventoryTableBody.innerHTML = "";

    supplies.forEach(function(item){

        let status = "Available";

        if(item.stock <= item.minStock){
            status = "Low Stock";
        }

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

displayInventoryReport();

const inventoryCategoryFilter =
document.getElementById("inventory_category_filter");

const stockFilter =
document.getElementById("stock_filter");

function loadInventoryCategories(){

    let categories = [];

    supplies.forEach(function(item){

        if(!categories.includes(item.category)){
            categories.push(item.category);
        }

    });

    categories.forEach(function(category){

        inventoryCategoryFilter.innerHTML += `

            <option value="${category}">
                ${category}
            </option>

        `;

    });

}

loadInventoryCategories();

function displayFilteredInventory(data){

    inventoryTableBody.innerHTML = "";

    data.forEach(function(item){

        let status = "Available";

        if(item.stock === 0){
            status = "Out of Stock";
        }
        else if(item.stock <= item.minStock){
            status = "Low Stock";
        }

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

document.getElementById("inventory_filter_button")
.addEventListener("click", function(){

    const categoryValue =
    inventoryCategoryFilter.value;

    const stockValue =
    stockFilter.value;

    let filteredInventory = supplies.filter(function(item){

        let categoryMatch =
        categoryValue === "" ||
        item.category === categoryValue;

        let stockMatch = true;

        if(stockValue === "available"){
            stockMatch = item.stock > item.minStock;
        }
        else if(stockValue === "low"){
            stockMatch =
            item.stock > 0 &&
            item.stock <= item.minStock;
        }
        else if(stockValue === "out"){
            stockMatch = item.stock === 0;
        }

        return categoryMatch && stockMatch;

    });

    displayFilteredInventory(filteredInventory);

});

document.getElementById("inventory_reset_button")
.addEventListener("click", function(){

    inventoryCategoryFilter.value = "";
    stockFilter.value = "";

    displayFilteredInventory(supplies);

});

document.getElementById("filter_button")
.addEventListener("click", function(){

    const dateValue =
    document.getElementById("date_filter").value;

    const medicineValue =
    document.getElementById("medicine_filter")
    .value.toLowerCase();

    const sellerValue =
    document.getElementById("seller_filter").value;

    let filteredSales = [];

    salesHistory.forEach(function(sale){

        let selectedDateText = "";

        if(dateValue !== ""){

            selectedDateText =
            new Date(dateValue).toLocaleDateString("en-US", {

                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric"

            });

        }

        let dateMatch =
        dateValue === "" ||
        sale.date === selectedDateText;

        let sellerMatch =
        sellerValue === "" ||
        sale.seller === sellerValue;

        let filteredItems =
        sale.items.filter(function(item){

            let medicineMatch =
            item.name.toLowerCase()
            .includes(medicineValue);

            return medicineMatch;

        });

        if(
            dateMatch &&
            sellerMatch &&
            filteredItems.length > 0
        ){

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
.addEventListener("click", function(){

    document.getElementById("date_filter").value = "";

    document.getElementById("medicine_filter").value = "";

    document.getElementById("seller_filter").value = "";

    displayReports(salesHistory);

    updateCards(salesHistory);

});


document.getElementById("print_button")
.addEventListener("click", function(){

    window.print();

});

document.getElementById("export_button").addEventListener("click", function() {
    if (salesHistory.length === 0) {
        alert("No sales data to export!");
        return;
    }

    let csv = "Medicine Name,Quantity,Date,Time,Seller,Sales\n";

    salesHistory.forEach(function(sale) {
        sale.items.forEach(function(item) {
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

if(!sessionStorage.getItem("currentDoctor")) {

   window.location.href = "LogIn.html";
   alert("Please log in to access the Reports.");

}











