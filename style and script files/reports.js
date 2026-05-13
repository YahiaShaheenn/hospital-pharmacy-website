// Sales report elements
const tableBody = document.getElementById("reports_table_body");
const sellerFilter = document.getElementById("seller_filter");
const medicineFilter = document.getElementById("medicine_filter");
const dateFilter = document.getElementById("date_filter");
const durationFilter = document.getElementById("duration_filter");

// Inventory report elements
const inventoryTableBody = document.getElementById("inventory_report_body");
//beta3et el medicine dropdown fe inventory report
const inventoryNameFilter = document.getElementById("inventory_name_filter");
const inventoryCategoryFilter = document.getElementById("inventory_category_filter");
const inventorySellerFilter = document.getElementById("inventory_seller_filter");

//el hanestakhdemhom fe functions : show/hide sales/inventory report
const salesReportContainer = document.getElementById("sales_report_container");
const inventoryReportContainer = document.getElementById("inventory_report_container");

//3ashan el data betetsagel fel local storage as text,fa benhawelha le array/objects be JSON.parse
//law fady yeb2a yehotely array fadi 3ashan mayeb2ash error lama yeb2a fe loop 3aleh w mayetba3sh null
let salesHistory = JSON.parse(localStorage.getItem("salesHistory")) || [];
let inventoryHistory = JSON.parse(localStorage.getItem("inventoryHistory")) || [];

//betebda2 be all data metsagela fel local storage, w ba3den betetghayar ma3 el filter
let currentSalesData = salesHistory;
let currentInventoryData = inventoryHistory;

//3ashan akhali max date fel input hwa today's date
//toISOString bete3mel format date w time, fa ben split 3and T 3ashan nakhod el date bas
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


//sales report display functions

function displayReports(data) {

    //hena ba clear el table awel ma a display data gedida
    //3ashan mayetkararsh el old data
    tableBody.innerHTML = "";

    //da bey loop thru every sale fel data array
    data.forEach(function (sale) {

        //da bey loop thru every item fel sale da
        sale.items.forEach(function (item) {

            //da beyzawed row gedida fel table le kol item
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


//fills the medicine dropdown fel sales report filter
function loadMedicineOptions() {

    //1st option law wala medicine selected, so all medicines will be shown
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

                    let itemProfit = (item.price - supplies[i].costPrice) * item.qty;

                    totalProfit += itemProfit;

                    //bawa2af el loop awel ma ala2i el matching medicine
                    break;

                }

            }

        });

    });

    //textContent di 3ashan a change el visible text inside an element
    document.getElementById("total_sales").textContent = Math.round(totalSales) + " EGP";
    document.getElementById("total_profit").textContent = Math.round(totalProfit) + " EGP";
    document.getElementById("total_sales_count").textContent = totalMedicinesSold;

}


//inventory report functions

function displayInventoryReport(data) {

    inventoryTableBody.innerHTML = "";

    data.forEach(function (item) {

        inventoryTableBody.innerHTML += `

            <tr>

                <td>${item.name}</td>
                <td>${item.date}</td>
                <td>${item.time}</td>
                <td>${item.seller}</td>
                <td>${item.expiryDate}</td>
                <td>${item.costPrice} EGP</td>
                <td>${item.quantity}</td>
                <td>${item.totalPrice} EGP</td>

            </tr>
        `;

    });

}


function loadInventoryMedicineOptions() {

    inventoryNameFilter.innerHTML = `<option value="">All Medicines</option>`;

    let names = [];

    inventoryHistory.forEach(function (item) {

        if (!names.includes(item.name)) {

            names.push(item.name);

        }

    });

    names.forEach(function (name) {

        inventoryNameFilter.innerHTML += `

            <option value="${name}">${name}</option>
        `;

    });

}


function loadInventoryCategories() {

    inventoryCategoryFilter.innerHTML = `<option value="">All Categories</option>`;

    //ba3mel empty array 3ashan a store feha el unique categories bas
    let categories = [];

    inventoryHistory.forEach(function (item) {

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


function loadInventorySellerOptions() {

    inventorySellerFilter.innerHTML = `<option value="">All Sellers</option>`;

    let sellers = [];

    inventoryHistory.forEach(function (item) {

        if (!sellers.includes(item.seller)) {

            sellers.push(item.seller);

        }

    });

    sellers.forEach(function (seller) {

        inventorySellerFilter.innerHTML += `

            <option value="${seller}">${seller}</option>
        `;

    });

}


// =========================
// SALES DATE / DURATION FILTER FUNCTIONS
// =========================

//bakhali el date men awel el yom 3ashan comparison yeb2a accurate
function resetDateTime(date) {

    date.setHours(0, 0, 0, 0);

    return date;

}


//date input beyeb2a string like "2026-05-12"
//fa ben split it w ne3mel local Date object 3ashan netganab timezone problems
function parseInputDate(dateValue) {

    const parts = dateValue.split("-");

    const year = Number(parts[0]);
    const month = Number(parts[1]) - 1;
    const day = Number(parts[2]);

    return resetDateTime(new Date(year, month, day));

}


//sale.date may be saved as "Tuesday, May 12, 2026"
//or "2026-05-12" depending on storage
function parseSaleDate(saleDateText) {

    if (!saleDateText) {

        return null;

    }

    // If sale date is saved as "YYYY-MM-DD"
    if (saleDateText.includes("-")) {

        const parts = saleDateText.split("-");

        if (parts.length === 3) {

            const year = Number(parts[0]);
            const month = Number(parts[1]) - 1;
            const day = Number(parts[2]);

            return resetDateTime(new Date(year, month, day));

        }

    }

    // If sale date is saved as text, like "Tuesday, May 12, 2026"
    let parsedDate = new Date(saleDateText);

    if (!isNaN(parsedDate.getTime())) {

        return resetDateTime(parsedDate);

    }

    // If sale date is saved with slashes, like "5/12/2026" or "12/5/2026"
    if (saleDateText.includes("/")) {

        const parts = saleDateText.split("/");

        if (parts.length === 3) {

            let first = Number(parts[0]);
            let second = Number(parts[1]);
            let year = Number(parts[2]);

            let month;
            let day;

            // If first number is bigger than 12, then it must be day/month/year
            if (first > 12) {

                day = first;
                month = second;

            }

            // Otherwise assume month/day/year because old code used en-US format
            else {

                month = first;
                day = second;

            }

            return resetDateTime(new Date(year, month - 1, day));

        }

    }

    return null;

}


//beygeeb start w end beta3 el period based on selected date
function getPeriodRange(selectedDate, durationValue) {

    let startDate = new Date(selectedDate);
    let endDate = new Date(selectedDate);

    // Exact date or daily: selected day only
    if (durationValue === "" || durationValue === "daily") {

        startDate = new Date(selectedDate);
        endDate = new Date(selectedDate);

    }

    // Weekly: full week containing selected date
    // Sunday to Saturday
    else if (durationValue === "weekly") {

        startDate = new Date(selectedDate);

        // getDay(): Sunday = 0, Monday = 1, Tuesday = 2, ..., Saturday = 6
        startDate.setDate(selectedDate.getDate() - selectedDate.getDay());

        endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6);

    }

    // Monthly: full month containing selected date
    else if (durationValue === "monthly") {

        startDate = new Date(
            selectedDate.getFullYear(),
            selectedDate.getMonth(),
            1
        );

        endDate = new Date(
            selectedDate.getFullYear(),
            selectedDate.getMonth() + 1,
            0
        );

    }

    // Yearly: full year containing selected date
    else if (durationValue === "yearly") {

        startDate = new Date(
            selectedDate.getFullYear(),
            0,
            1
        );

        endDate = new Date(
            selectedDate.getFullYear(),
            11,
            31
        );

    }

    return {

        startDate: resetDateTime(startDate),
        endDate: resetDateTime(endDate)

    };

}


//bycheck law el sale date dakhel el selected duration wala la
function checkDurationMatch(saleDateText, dateValue, durationValue) {

    //law mafish date w mafish duration, show all sales
    if (dateValue === "" && durationValue === "") {

        return true;

    }

    const saleDate = parseSaleDate(saleDateText);

    if (saleDate === null) {

        return false;

    }

    const selectedDate = parseInputDate(dateValue);

    const range = getPeriodRange(selectedDate, durationValue);

    return saleDate >= range.startDate && saleDate <= range.endDate;

}


//sales report filter
//add event listener: eno mestani event mo3ayan yehsal 3ashan ye3mel el function
document.getElementById("filter_button").addEventListener("click", function () {

    const dateValue = dateFilter.value;
    const durationValue = durationFilter.value;

    //3ashan nekhali searching easier w avoid case sensitivity
    const medicineValue = medicineFilter.value.toLowerCase();

    const sellerValue = sellerFilter.value;

    //law duration selected w mafish date, stop
    if (dateValue === "" && durationValue !== "") {

        alert("Please select a date for the selected report duration.");

        return;

    }

    let filteredSales = [];

    salesHistory.forEach(function (sale) {

        //bycheck el sale date according to exact/daily/weekly/monthly/yearly duration
        let dateMatch = checkDurationMatch(sale.date, dateValue, durationValue);

        //law mafish seller selected, yeb2a kol sellers accepted
        let sellerMatch = sellerValue === "" || sale.seller === sellerValue;

        let filteredItems = sale.items.filter(function (item) {

            let medicineMatch = item.name.toLowerCase().includes(medicineValue);

            return medicineMatch;

        });

        //lazem el date w el seller ye match
        //w at least 1 medicine men el sale di ye match
        if (dateMatch && sellerMatch && filteredItems.length > 0) {

            filteredSales.push({

                //da el spread operator, byakhod all original sale properties
                //zay date, time, payment, seller
                ...sale,

                //replace the original full items list with only filtered matching items
                items: filteredItems

            });

        }

    });

    //da mohem awi lel print w el export
    currentSalesData = filteredSales;

    //display the filtered data fe el table w update el cards based 3aleh
    displayReports(currentSalesData);
    updateCards(currentSalesData);

});


//sales reset filter button
//Reset clears all filters and returns the sales report to its original full data
document.getElementById("reset_button").addEventListener("click", function () {

    dateFilter.value = "";
    durationFilter.value = "";
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
    const sellerValue = inventorySellerFilter.value;

    let filteredInventory = inventoryHistory.filter(function (item) {

        let nameMatch = nameValue === "" || item.name === nameValue;
        let categoryMatch = categoryValue === "" || item.category === categoryValue;
        let sellerMatch = sellerValue === "" || item.seller === sellerValue;

        return nameMatch && categoryMatch && sellerMatch;

    });

    currentInventoryData = filteredInventory;

    displayInventoryReport(currentInventoryData);

});


document.getElementById("inventory_reset_button").addEventListener("click", function () {

    inventoryNameFilter.value = "";
    inventoryCategoryFilter.value = "";
    inventorySellerFilter.value = "";

    currentInventoryData = inventoryHistory;

    displayInventoryReport(currentInventoryData);

});


//print sales report function
//zawedt temporary class abl el printing 3ashan CSS ye3raf eni 3ayza a print the sales report bas,w shelto after printing
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

    //3ashan law masalan 3amalt filter, fa hwa hayetba3 el filtered
    currentSalesData.forEach(function (sale) {

        sale.items.forEach(function (item) {

            csv +=
                `${item.name},${item.qty},${sale.date},${sale.time || "No time"},${item.price} EGP,${item.price * item.qty} EGP,${sale.payment},${sale.seller}\n`;

        });

    });

    //blob bye3mel a file-like object from the CSV text
    let blob = new Blob([csv], { type: "text/csv" });

    //temporary download URL
    let url = URL.createObjectURL(blob);

    //invisible link
    let link = document.createElement("a");

    //beykhali link target lel CSV file URL
    link.href = url;

    link.download = "SalesReport.csv";

    //automatic click 3ashan a download file
    link.click();

    //ashil el temporary URL
    URL.revokeObjectURL(url);

});


//export inventory report function

document.getElementById("inventory_export_button").addEventListener("click", function () {

    if (currentInventoryData.length === 0) {

        alert("No inventory data to export!");

        return;

    }

    let csv = "Medicine Name,Date,Time,Seller,Expiry Date,Buy Price,Quantity Added,Total Price\n";

    currentInventoryData.forEach(function (item) {

        csv += `${item.name},${item.date},${item.time},${item.seller},${item.expiryDate},${item.costPrice} EGP,${item.quantity},${item.totalPrice} EGP\n`;

    });

    let blob = new Blob([csv], { type: "text/csv" });

    let url = URL.createObjectURL(blob);

    let link = document.createElement("a");

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
loadInventorySellerOptions();

displayReports(salesHistory);
updateCards(salesHistory);
displayInventoryReport(inventoryHistory);