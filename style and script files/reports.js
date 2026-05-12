// Sales report elements
const tableBody = document.getElementById("reports_table_body");
const sellerFilter = document.getElementById("seller_filter");
const medicineFilter = document.getElementById("medicine_filter");
const dateFilter = document.getElementById("date_filter");

// Inventory report elements
const inventoryTableBody = document.getElementById("inventory_report_body");
//beta3et el medicine dropdown fe inventory report
const inventoryNameFilter = document.getElementById("inventory_name_filter");
const inventoryCategoryFilter = document.getElementById("inventory_category_filter");
const stockFilter = document.getElementById("stock_filter");

//el hanestakhdemhom fe functions : show/hide sales/inventory report
const salesReportContainer = document.getElementById("sales_report_container");
const inventoryReportContainer = document.getElementById("inventory_report_container");

//3ashan el data betetsagel fel local storage as text,fa benhawelha le array/objects be JSON.parse 
//law fady yeb2a yeb2a yehotely array fadi 3ashan mayeb2ash error lama yeb2a fe loop 3aleh w mayetba3sh null
let salesHistory = JSON.parse(localStorage.getItem("salesHistory")) || [];

//betebda2 be all data metsagela fel local storage, w ba3den betetghayar ma3 el filter 
let currentSalesData = salesHistory;
let currentInventoryData = supplies;

//3ashan akhali max date fel input hwa today's date,toISOString bete3mel el format beta3et el date w gambo el time,fa ben split men awel el time,3ashan nakhod el date bas,da el input of typr date byakhdo,w ba3den bakhod [0] 3ashan nakhod part el date bas
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

//sales report ddisplay functions

function displayReports(data) {

    //hena ba clear el table awel ma ados 3ala filter button,3ashan yeb2a y display el data el met3adala bas, w mayetba3sh el data el adima kaman(to avoid duplication)
    tableBody.innerHTML = "";

    //da bey loop thru every sale fel data array(every transaction=every reciept)
    data.forEach(function (sale) {

        //da bey loop thru every item fel sale da
     sale.items.forEach(function (item) {

        // da beyzawed row gedida fel table le kol item
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


//fills the medicine drpodown fel sales report filter
function loadMedicineOptions() {

    //1st option law wala medicine selected,so all medicines will be shown(inner html 3ashan ana bazawed fel html dropdown)
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

                    // bawa2af el loop awel ma ala2i el matching medecine
                    break;
                }
            }
        });
    });

    //text content di 3ashan a change el visible text inside an element
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

    //ba3mel empty array 3ashan a store feha el categories el unique bas 3ashan a avoid repeated category options in the dropdown
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
//add event listener:eno mestani event mo3ayan yehsal 3ashan ye3mel el function (hena el event hwa el click)
document.getElementById("filter_button").addEventListener("click", function () {

        const dateValue = dateFilter.value;
        //3ashan nekhali searching easier w avoid case sensitivity
        const medicineValue = medicineFilter.value.toLowerCase();
        const sellerValue = sellerFilter.value;

        let selectedDateText = "";

        if (dateValue !== "") {

            //ba2lebo keda 3ashan hwa met sayev keda fel storage
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

                //lazem el date w el seller ye match,w at least 1 medicine men el sharwa di ye match
            if (
                dateMatch && sellerMatch && filteredItems.length > 0
            ) {

                filteredSales.push({

                    //da el spread operator,byakhod all original sale properties (date time payment seller)
                    ...sale,

                    //replace the original full items list with only filtered matching items
                    items: filteredItems

                });

            }

        });

        //da mohem awi lel print w el export
        currentSalesData = filteredSales;

        //diplay the filtered data fe el table w update el cards based 3aleh
        displayReports(currentSalesData);
        updateCards(currentSalesData);

    });

    //sales reset filter button
    //Reset clears all filters and returns the sales report to its original full data

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

    //bakhod el selected filter values
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

                    stockMatch = item.stock > 0 && item.stock <= item.minStock;

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
//zawedt temporary class abl el printing 3ashan CSS ye3raf that eni 3ayza a print the sales report bas,w shelto after printing
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

        //3ashan law masalan 3amalt filter,fa hwa hayetba3 el filtered
        currentSalesData.forEach(function (sale) {

            sale.items.forEach(function (item) {

                csv +=
                    `${item.name},${item.qty},${sale.date},${sale.time || "No time"},${item.price} EGP,${item.price * item.qty} EGP,${sale.payment},${sale.seller}\n`;

            });

        });

        //blob bye3mel a file-like object from the CSV text
        // A Blob is used to store file data in the browser
        let blob = new Blob([csv], { type: "text/csv" });

        //temporary download
        let url =URL.createObjectURL(blob);

        //invisible link
        let link =document.createElement("a");

       //beykhali link target lel CSV file URL
       // create it using JS because we want to download the CSV automatically
        link.href = url;

        link.download = "SalesReport.csv";

        //automatic click 3ashan a download file
        link.click();

        //ashil el temp
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