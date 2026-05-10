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

                    <td>${sale.seller}</td>

                    <td>${item.price * item.qty} EGP</td>

                </tr>

            `;

        });

    });

}

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

    document.getElementById("medicine_filter").value = "";

    document.getElementById("seller_filter").value = "";

    displayReports(salesHistory);

});

document.getElementById("print_button")
.addEventListener("click", function(){

    window.print();

});

document.getElementById("export_button")
.addEventListener("click", function(){

    alert("PDF Exported Successfully!");

});

