window.onload = function() {
    if(!sessionStorage.getItem("currentDoctor")) {
        window.location.href = "LogIn.html";
        alert("Please log in to access the Sales.");   // redirect to login if not logged in, then restore cart on page load
    }
    if(document.getElementById("cart")) {
        renderCart();
    }
}

const supplies = [
{ name: "Paracetamol", category: "Pain Relief", costPrice: 15, sellingPrice: 25, stock: 120, minStock: 20, expiryDate: "2027-06-01", refundable: true },
{ name: "Ibuprofen", category: "Pain Relief", costPrice: 25, sellingPrice: 40, stock: 80, minStock: 15, expiryDate: "2027-08-15", refundable: true },
{ name: "Diclofenac", category: "Pain Relief", costPrice: 35, sellingPrice: 55, stock: 60, minStock: 10, expiryDate: "2028-01-10", refundable: true },
{ name: "Amoxicillin", category: "Antibiotics", costPrice: 45, sellingPrice: 65, stock: 90, minStock: 15, expiryDate: "2027-03-20", refundable: true },
{ name: "Azithromycin", category: "Antibiotics", costPrice: 60, sellingPrice: 85, stock: 50, minStock: 10, expiryDate: "2027-09-05", refundable: true },
{ name: "Ciprofloxacin", category: "Antibiotics", costPrice: 50, sellingPrice: 70, stock: 40, minStock: 10, expiryDate: "2028-02-14", refundable: true },
{ name: "Nasal Spray", category: "Cold & Flu", costPrice: 28, sellingPrice: 45, stock: 55, minStock: 10, expiryDate: "2027-04-18", refundable: true },
{ name: "Vitamin C Tablets", category: "Cold & Flu", costPrice: 18, sellingPrice: 30, stock: 100, minStock: 20, expiryDate: "2028-07-22", refundable: true },
{ name: "Metformin", category: "Diabetes", costPrice: 25, sellingPrice: 40, stock: 60, minStock: 12, expiryDate: "2027-12-01", refundable: true },
{ name: "Glucose Test Strips", category: "Diabetes", costPrice: 55, sellingPrice: 80, stock: 35, minStock: 10, expiryDate: "2027-05-15", refundable: true },
{ name: "Amlodipine", category: "Heart", costPrice: 35, sellingPrice: 55, stock: 45, minStock: 10, expiryDate: "2028-03-08", refundable: true },
{ name: "Atenolol", category: "Heart", costPrice: 28, sellingPrice: 45, stock: 50, minStock: 10, expiryDate: "2027-11-20", refundable: true },
{ name: "Omeprazole", category: "Stomach", costPrice: 30, sellingPrice: 50, stock: 70, minStock: 15, expiryDate: "2027-07-14", refundable: true },
{ name: "Antacids", category: "Stomach", costPrice: 12, sellingPrice: 20, stock: 90, minStock: 20, expiryDate: "2028-01-25", refundable: true },
{ name: "ORS Packets", category: "Stomach", costPrice: 8, sellingPrice: 15, stock: 110, minStock: 25, expiryDate: "2027-10-10", refundable: true },
{ name: "Salbutamol Inhaler", category: "Respiratory", costPrice: 80, sellingPrice: 120, stock: 30, minStock: 8, expiryDate: "2027-06-18", refundable: false },
{ name: "Nebulizer Solution", category: "Respiratory", costPrice: 50, sellingPrice: 75, stock: 40, minStock: 10, expiryDate: "2027-02-28", refundable: false },
{ name: "Syringes", category: "Supplies", costPrice: 5, sellingPrice: 10, stock: 300, minStock: 50, expiryDate: "2030-01-01", refundable: false },
{ name: "Bandages", category: "Supplies", costPrice: 12, sellingPrice: 20, stock: 200, minStock: 40, expiryDate: "2030-06-01", refundable: true },
{ name: "Alcohol Swabs", category: "Supplies", costPrice: 8, sellingPrice: 15, stock: 250, minStock: 50, expiryDate: "2029-12-01", refundable: false },
{ name: "Surgical Mask Box", category: "Supplies", costPrice: 40, sellingPrice: 60, stock: 150, minStock: 30, expiryDate: "2029-08-15", refundable: false },
{ name: "Surgical Gloves", category: "Supplies", costPrice: 28, sellingPrice: 45, stock: 180, minStock: 30, expiryDate: "2030-03-20", refundable: false },
{ name: "IV Fluids", category: "Emergency", costPrice: 55, sellingPrice: 85, stock: 40, minStock: 10, expiryDate: "2027-08-30", refundable: false },
{ name: "Oxygen Mask", category: "Emergency", costPrice: 70, sellingPrice: 110, stock: 25, minStock: 8, expiryDate: "2030-01-15", refundable: true },
{ name: "Multivitamins", category: "Vitamins", costPrice: 45, sellingPrice: 70, stock: 85, minStock: 15, expiryDate: "2028-05-10", refundable: true },
{ name: "Vitamin D", category: "Vitamins", costPrice: 35, sellingPrice: 55, stock: 90, minStock: 15, expiryDate: "2028-09-22", refundable: true },
{ name: "Omega-3 Capsules", category: "Vitamins", costPrice: 65, sellingPrice: 95, stock: 60, minStock: 12, expiryDate: "2028-11-30", refundable: true },
{ name: "Diapers", category: "Baby Care", costPrice: 80, sellingPrice: 120, stock: 50, minStock: 10, expiryDate: "2030-01-01", refundable: true },
{ name: "Pediatric Syrup", category: "Baby Care", costPrice: 25, sellingPrice: 40, stock: 65, minStock: 12, expiryDate: "2027-04-05", refundable: true },
{ name: "Insulin", category: "Diabetes", costPrice: 100, sellingPrice: 150, stock: 5, minStock: 8, expiryDate: "2025-06-01", refundable: false },
{ name: "Nitroglycerin", category: "Heart", costPrice: 60, sellingPrice: 90, stock: 3, minStock: 8, expiryDate: "2025-07-15", refundable: false },
{ name: "Epinephrine Injection", category: "Emergency", costPrice: 140, sellingPrice: 200, stock: 2, minStock: 5, expiryDate: "2025-08-01", refundable: false },
{ name: "Baby Formula", category: "Baby Care", costPrice: 120, sellingPrice: 180, stock: 4, minStock: 8, expiryDate: "2025-09-10", refundable: true },
{ name: "Cough Syrup", category: "Cold & Flu", costPrice: 20, sellingPrice: 35, stock: 6, minStock: 15, expiryDate: "2025-05-30", refundable: true },
];

let savedStock = JSON.parse(localStorage.getItem("suppliesStock"));
if (savedStock) {
    for (let i = 0; i < supplies.length; i++) {
        supplies[i].stock = savedStock[i];              // reload ftom local stroage saved stock
    }
} 

let cart = JSON.parse(localStorage.getItem("cart")) || []; //// restore cart from previous session

function searchmed() {  // Search medicines by name and display results
    let input = document.getElementById("searchInput").value.toLowerCase(); //searchs by partial name match
    let results = document.getElementById("searchResults");
    results.innerHTML = "";

    for (let i = 0; i < supplies.length; i++) {    //loops the supply list 
        if (supplies[i].name.toLowerCase().includes(input)) {
            results.innerHTML += `
                <div class="medicine-result">
                    <p><strong>${supplies[i].name}</strong></p>  
                    <p>Price: ${supplies[i].sellingPrice} EGP</p>
                    <button onclick="addToCart(${i})">Add to Cart</button>
                </div>
            `;
        }
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
            cart[j].qty++;
            renderCart();
            return;
        }
    }
    cart.push({ name: item.name, price: item.sellingPrice, qty: 1 });
    renderCart();
}

function renderCart() {                                          // render cart items total title and payment section
    localStorage.setItem("cart", JSON.stringify(cart));
    let cartDiv = document.getElementById("cart");
    cartDiv.innerHTML = "";
    let total = 0;
    for (let j = 0; j < cart.length; j++) {
        let subtotal = cart[j].price * cart[j].qty;
        total += subtotal;
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
        cartDiv.innerHTML += `<h3>Total: ${total} EGP</h3>`;
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
        showAlert("Your cart is empty!");                                     //// validate cart and payment method then decrement stock and generate receipt
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

    localStorage.setItem("suppliesStock", JSON.stringify(supplies.map(s => s.stock)));
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
        let subtotal = cart[j].price * cart[j].qty;
        total += subtotal;
        itemsHTML += `<p>${cart[j].name} x${cart[j].qty} = ${subtotal} EGP</p>`;
    }

    document.getElementById("receipt-content").innerHTML = `
        <h3>Receipt</h3>
        <p>${date} | ${time}</p>
        <p>Seller: ${sellerName}</p>
        <hr>
        ${itemsHTML}
        <hr>
        <h4>Total: ${total} EGP</h4>
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
        if (remaining <= 0) continue;

        hasRefundable = true;
        itemsDiv.innerHTML += `
            <div class="refund-item-card">
                <p><strong>${item.name}</strong></p>
                <p>Bought: ${item.qty} | Refunded: ${alreadyRefunded} | Available to refund: ${remaining}</p>
                <input type="number" id="refund-qty-${j}" min="0" max="${remaining}" value="0">
            </div>
        `;
    }

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
        if (!input) continue;
        let qty = parseInt(input.value);
        if (isNaN(qty) || qty <= 0) continue;

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

        sale.items[j].refundedQty = alreadyRefunded + qty;
        anyRefunded = true;
    }

    if (!anyRefunded) {
        showAlert("Please enter a quantity to refund.");
        return;
    }

    salesHistory[saleIndex] = sale;
    localStorage.setItem("salesHistory", JSON.stringify(salesHistory));
    localStorage.setItem("suppliesStock", JSON.stringify(supplies.map(s => s.stock)));
    closeRefund();
    showAlert("Refund processed successfully!");
}

function closeRefund() {
    document.getElementById("refund-bg").style.display = "none";
}