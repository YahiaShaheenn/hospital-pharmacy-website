window.onload = function() {
    if(!sessionStorage.getItem("currentDoctor")) {
        window.location.href = "LogIn.html";
        alert("Please log in to access the Sales.");   // redirect to login if not logged in, then restore cart on page load
    }
    if(document.getElementById("cart")) {
        renderCart();
    }
    if (sessionStorage.getItem("admin") === "true" && document.getElementById("cart")) {
    showAlert("Admins cannot access the Sales page.");
    document.getElementById("alert-popup").querySelector("button").setAttribute("onclick", "window.location.href='dashboard.html'; closeAlert();");
}
}
let supplies = JSON.parse(localStorage.getItem("suppliesStock")) || [];


let cart = JSON.parse(localStorage.getItem("cart")) || []; //// restore cart from previous session

function searchmed() {
    let input = document.getElementById("searchInput").value.toLowerCase();
    let results = document.getElementById("searchResults");
    results.innerHTML = "";

    let results_array = [];
    for (let i = 0; i < supplies.length; i++) {
        if (supplies[i].name.toLowerCase().includes(input)) {
            results_array.push({ supply: supplies[i], index: i });
        }
    }

    results_array.sort(function(a, b) {
        return new Date(a.supply.expiryDate) - new Date(b.supply.expiryDate);
    });

    for (let k = 0; k < results_array.length; k++) {
        let i = results_array[k].index;
        results.innerHTML += `
            <div class="medicine-result">
                <p><strong>${supplies[i].name}</strong></p>
                <p>Price: ${supplies[i].sellingPrice} EGP</p>
                <button onclick="addToCart(${i})">Add to Cart</button>
            </div>
        `;
    }

    if (results.innerHTML === "") {
        results.innerHTML = "<p>No medicine found.</p>";
    }
}
function addToCart(i) {   // add selected medicine to cart 
    if (supplies[i].stock <= 0) {
        showAlert("This item is out of stock!");   //checks if the item is out of stock before adding to cart
        return; 
    }
    if (new Date(supplies[i].expiryDate) < new Date()) {
        showAlert(supplies[i].name + " is expired and cannot be sold!");  //checks if the item is expired before adding to cart
        return;
    }

    let item = supplies[i];
    for (let j = 0; j < cart.length; j++) {
        if (cart[j].name === item.name) {
            if (cart[j].qty >= supplies[i].stock) {
                showAlert("No more stock available for " + item.name + "!"); //makes sure you can't add more to cart than available in stock
                return;
            }
            cart[j].qty++;   //update cart without adding duplicate entry
            renderCart();
            return;
        }
    }
    cart.push({ name: item.name, price: item.sellingPrice, qty: 1 });   // if item not already in cart add it 
    renderCart();
}

function renderCart() {                                          // render cart items total title and payment section
    localStorage.setItem("cart", JSON.stringify(cart));
    let cartDiv = document.getElementById("cart");
    cartDiv.innerHTML = "";
    let total = 0;
    for (let j = 0; j < cart.length; j++) {
        let subtotal = (cart[j].price * cart[j].qty).toFixed(2);
        total += parseFloat((cart[j].price * cart[j].qty).toFixed(2));
        cartDiv.innerHTML += `
            <div class="cart-item">
                <p><strong>${cart[j].name}</strong></p>
                <p>Price: ${cart[j].price} EGP | Subtotal: ${subtotal} EGP</p>
                <div class="qty-controls">
                    <button onclick="decreaseQty(${j})">-</button>
                    <span>${cart[j].qty}</span>
                    <button onclick="increaseQty(${j})">+</button>
                    <button class="remove-btn" onclick="removeItem(${j})">Remove</button>
                </div>
            </div>
        `;
    }
    if (cart.length > 0) {
       cartDiv.innerHTML += `<h3>Total: ${total.toFixed(2)} EGP</h3>`;
    }
    if (cart.length > 0) {
        document.getElementById("cart-title").style.display = "flex";        //gets hidden when cart is empty and shows when there's at least 1 item in cart
        document.getElementById("payment-section").style.display = "block";
    } else {
        document.getElementById("cart-title").style.display = "none";
        document.getElementById("payment-section").style.display = "none";  
    }
}

function increaseQty(j) {
    for (let i = 0; i < supplies.length; i++) {
        if (supplies[i].name === cart[j].name) {                    // checks if increasing quantity exceeds stock before allowing it            
            if (cart[j].qty >= supplies[i].stock) {
                showAlert("No more stock available for " + cart[j].name + "!");  // shows alert if quantity exceeds stock
                return;
            }
            break;
        }
    }
    cart[j].qty++;
    renderCart();
}

function decreaseQty(j) {
    if (cart[j].qty > 1) {
        cart[j].qty--;
    } else {
        cart.splice(j, 1);     // if quantity goes to 0 it removes the item from cart
    }
    renderCart();
}

function removeItem(j) {   // remove item from cart entirely
    cart.splice(j, 1); 
    renderCart();
}

function checkout() {
    if (cart.length === 0) {
        showAlert("Your cart is empty!");                                     // validate cart and payment method then decrement stock and generate receipt
        return;
    }
    let paymentinput = document.querySelector('input[name="payment"]:checked');
    if (paymentinput === null) {
        showAlert("Please select a payment method!");
        return;
    }

    for (let j = 0; j < cart.length; j++) {
        for (let i = 0; i < supplies.length; i++) {
            if (supplies[i].name === cart[j].name) {
                supplies[i].stock -= cart[j].qty;
                break;
            }
        }
    }

    localStorage.setItem("suppliesStock", JSON.stringify(supplies));
    generateReceipt(paymentinput.value);
}

function generateReceipt(paymentmethod) {
    let sellerName = sessionStorage.getItem("currentDoctor");                                              //// build and display receipt, save sale to history, clear cart
    let now = new Date();
    let time = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    let date = now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });

    let total = 0;
    let itemsHTML = "";
    for (let j = 0; j < cart.length; j++) {
        let subtotal = (cart[j].price * cart[j].qty).toFixed(2);
        total += parseFloat((cart[j].price * cart[j].qty).toFixed(2));
        itemsHTML += `<p>${cart[j].name} x${cart[j].qty} = ${subtotal} EGP</p>`;
    }

    document.getElementById("receipt-content").innerHTML = `
        <h3>Receipt</h3>
        <p>${date} | ${time}</p>
        <p>Seller: ${sellerName}</p>
        <hr>
        ${itemsHTML}
        <hr>
       <h4>Total: ${total.toFixed(2)} EGP</h4>
        <p>Payment: ${paymentmethod}</p>
        <p>Thank you!</p>
    `;
    document.getElementById("receipt-bg").style.display = "flex";

    let sale = {
        date: date,
        time: time,
        timestamp: now.getTime(),
        items: cart.slice(),
        total: total,
        payment: paymentmethod,
        seller: sellerName
    };
    let salesHistory = JSON.parse(localStorage.getItem("salesHistory")) || [];
    salesHistory.push(sale);
    localStorage.setItem("salesHistory", JSON.stringify(salesHistory));

    cart = [];
    renderCart();
    document.querySelector('input[name="payment"]:checked').checked = false;   //payment is reset after checkout
    document.getElementById("searchResults").innerHTML = "";
    document.getElementById("searchInput").value = "";
}

function closeReceipt() {
    document.getElementById("receipt-bg").style.display = "none";
}

function showAlert(message) {
    document.getElementById("alert-message").textContent = message;
    document.getElementById("alert-bg").style.display = "flex";
}

function closeAlert() {
    document.getElementById("alert-bg").style.display = "none";
}

function openRefund() {
    let salesHistory = JSON.parse(localStorage.getItem("salesHistory")) || [];    // Load past sales and display them in refund popup
    let listDiv = document.getElementById("refund-sales-list");
    listDiv.innerHTML = "";

    if (salesHistory.length === 0) {
        listDiv.innerHTML = "<p>No past sales found.</p>";    //if no sales are stored or not checked out
    }

    let today = new Date();
   for (let i = salesHistory.length - 1; i >= 0; i--) { // loop in reverse to show most recent sales at top
    let sale = salesHistory[i];
    let saleDate;
    if (sale.timestamp) {
        saleDate = new Date(sale.timestamp); // checks if sale is refundable based on date before showing refund button
    } else {
        saleDate = new Date(sale.date);
    }
    let diffDays = Math.floor((today - saleDate) / (1000 * 60 * 60 * 24)); // Calculate how many days ago the sale was made
    let blocked = diffDays > 14;  // Block refund if sale is older than 14 days

    let refundButton;
    if (blocked) {
        refundButton = `<p class="refund-blocked">Refund period expired</p>`;
    } else {
        refundButton = `<button onclick="showRefundItems(${i})">Select</button>`;
    }

    listDiv.innerHTML += `
        <div class="refund-sale-card">
            <p><strong>${sale.date}</strong> | ${sale.time}</p>
            <p>Total: ${sale.total} EGP | Seller: ${sale.seller}</p>
            ${refundButton}
        </div>
    `;
}
    document.getElementById("refund-sales-view").style.display = "block";
    document.getElementById("refund-items-view").style.display = "none";
    document.getElementById("refund-bg").style.display = "flex";
}

function showRefundItems(saleIndex) {
    let salesHistory = JSON.parse(localStorage.getItem("salesHistory")) || [];
    let sale = salesHistory[saleIndex];
    let itemsDiv = document.getElementById("refund-items-list");  // Display items of the selected sale and allow user to choose refund quantities
    itemsDiv.innerHTML = "";

    let today = new Date();
    let hasRefundable = false;

    for (let j = 0; j < sale.items.length; j++) {  // find matching supply in supplies array
        let item = sale.items[j];
        let supplyData = null;
        for (let i = 0; i < supplies.length; i++) { // display items of the selected sale and allow user to choose refund quantities
            if (supplies[i].name === item.name) {
                supplyData = supplies[i];
                break;
            }
        }


        let isExpired = new Date(supplyData.expiryDate) < today;
        let isNotRefundable = !supplyData.refundable;

        if (isExpired || isNotRefundable) {     // Show reason if item cannot be refunded
            let reason = "";
            if (isNotRefundable && isExpired) {
                reason = "Not refundable: refrigerated/sensitive & expired";
            } else if (isNotRefundable) {
                reason = "Not refundable: refrigerated/sensitive item";
            } else {
                reason = "Not refundable: item is expired";
            }
            itemsDiv.innerHTML += `
                <div class="refund-item-card">
                    <p><strong>${item.name}</strong></p>
                    <p class="refund-blocked">${reason}</p>
                </div>
            `;
            continue;
        }

        let alreadyRefunded = item.refundedQty || 0;
        let remaining = item.qty - alreadyRefunded;
        if (remaining <= 0) continue;                // Skip if all are already refunded

        hasRefundable = true;
        itemsDiv.innerHTML += `
            <div class="refund-item-card">
                <p><strong>${item.name}</strong></p>
                <p>Bought: ${item.qty} | Refunded: ${alreadyRefunded} | Available to refund: ${remaining}</p>
                <input type="number" id="refund-qty-${j}" min="0" max="${remaining}" value="0">
            </div>
        `;
    }
// Show or hide confirm button based on whether there are refundable items
    if (!hasRefundable) {
        document.getElementById("refund-confirm-btn").style.display = "none";
    } else {
        document.getElementById("refund-confirm-btn").style.display = "block";
    }

    document.getElementById("refund-confirm-btn").setAttribute("onclick", `processRefund(${saleIndex})`);
    document.getElementById("refund-sales-view").style.display = "none";
    document.getElementById("refund-items-view").style.display = "block";
}

function processRefund(saleIndex) {
    let salesHistory = JSON.parse(localStorage.getItem("salesHistory")) || [];
    let sale = salesHistory[saleIndex];
    let anyRefunded = false;

    for (let j = 0; j < sale.items.length; j++) {
        let input = document.getElementById("refund-qty-" + j);  
        if (!input) continue;                                 // skip items that have no more quantinty left or not refundable 
        let qty = parseInt(input.value);
        if (isNaN(qty) || qty <= 0) continue; //ski[p if no quantity entered or invalid input

        let alreadyRefunded = sale.items[j].refundedQty || 0;  
        let remaining = sale.items[j].qty - alreadyRefunded;    
        if (qty > remaining) {
            showAlert("Refund quantity exceeds available for " + sale.items[j].name);
            return;
        }

        for (let i = 0; i < supplies.length; i++) {
            if (supplies[i].name === sale.items[j].name) {
                supplies[i].stock += qty;
                break;
            }
        }

        sale.items[j].refundedQty = alreadyRefunded + qty;    // Update refunded quantity 
        anyRefunded = true;
    }

    if (!anyRefunded) {
        showAlert("Please enter a quantity to refund.");
        return;
    }

    salesHistory[saleIndex] = sale;
    localStorage.setItem("salesHistory", JSON.stringify(salesHistory));
    localStorage.setItem("suppliesStock", JSON.stringify(supplies));  // Save updated sales history and stock to localStorage
    closeRefund();
    showAlert("Refund processed successfully!");
}

function closeRefund() {
    document.getElementById("refund-bg").style.display = "none";
}