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

    let totalRevenue = 0;

    let totalProfit = 0;

    let totalMedicinesSold = 0;

    data.forEach(function(sale){

        sale.items.forEach(function(item){

            let itemRevenue =
            item.price * item.qty;

            totalRevenue += itemRevenue;

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

    document.getElementById("total_revenue")
    .textContent =
    totalRevenue + " EGP";

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
.addEventListener("click", function(){

    const medicineValue =
    document.getElementById("medicine_filter")
    .value.toLowerCase();

    const sellerValue =
    document.getElementById("seller_filter").value;

    let filteredSales = [];

    salesHistory.forEach(function(sale){

        let filteredItems = sale.items.filter(function(item){

            let medicineMatch =
            item.name.toLowerCase()
            .includes(medicineValue);

            return medicineMatch;

        });

        if(
            filteredItems.length > 0 &&
            (sellerValue === "" ||
             sale.seller === sellerValue)
        ){

            filteredSales.push({

                ...sale,

                items: filteredItems

            });

        }

    });

    displayReports(filteredSales);

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

document.getElementById("export_button")
.addEventListener("click", function(){

    alert("PDF Exported Successfully!");

});

if(!sessionStorage.getItem("currentDoctor")) {

   window.location.href = "LogIn.html";
   alert("Please log in to access the Reports.");

}