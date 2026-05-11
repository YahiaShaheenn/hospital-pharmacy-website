const supplies = [
{ name: "Paracetamol", category: "Pain Relief", costPrice: 15, sellingPrice: 25, stock: 120, minStock: 20, expiryDate: "2027-06-01" },
{ name: "Ibuprofen", category: "Pain Relief", costPrice: 25, sellingPrice: 40, stock: 80, minStock: 15, expiryDate: "2027-08-15" },
{ name: "Diclofenac", category: "Pain Relief", costPrice: 35, sellingPrice: 55, stock: 60, minStock: 10, expiryDate: "2028-01-10" },
{ name: "Amoxicillin", category: "Antibiotics", costPrice: 45, sellingPrice: 65, stock: 90, minStock: 15, expiryDate: "2027-03-20" },
{ name: "Azithromycin", category: "Antibiotics", costPrice: 60, sellingPrice: 85, stock: 50, minStock: 10, expiryDate: "2027-09-05" },
{ name: "Ciprofloxacin", category: "Antibiotics", costPrice: 50, sellingPrice: 70, stock: 40, minStock: 10, expiryDate: "2028-02-14" },
{ name: "Nasal Spray", category: "Cold & Flu", costPrice: 28, sellingPrice: 45, stock: 55, minStock: 10, expiryDate: "2027-04-18" },
{ name: "Vitamin C Tablets", category: "Cold & Flu", costPrice: 18, sellingPrice: 30, stock: 100, minStock: 20, expiryDate: "2028-07-22" },
{ name: "Metformin", category: "Diabetes", costPrice: 25, sellingPrice: 40, stock: 60, minStock: 12, expiryDate: "2027-12-01" },
{ name: "Glucose Test Strips", category: "Diabetes", costPrice: 55, sellingPrice: 80, stock: 35, minStock: 10, expiryDate: "2027-05-15" },
{ name: "Amlodipine", category: "Heart", costPrice: 35, sellingPrice: 55, stock: 45, minStock: 10, expiryDate: "2028-03-08" },
{ name: "Atenolol", category: "Heart", costPrice: 28, sellingPrice: 45, stock: 50, minStock: 10, expiryDate: "2027-11-20" },
{ name: "Omeprazole", category: "Stomach", costPrice: 30, sellingPrice: 50, stock: 70, minStock: 15, expiryDate: "2027-07-14" },
{ name: "Antacids", category: "Stomach", costPrice: 12, sellingPrice: 20, stock: 90, minStock: 20, expiryDate: "2028-01-25" },
{ name: "ORS Packets", category: "Stomach", costPrice: 8, sellingPrice: 15, stock: 110, minStock: 25, expiryDate: "2027-10-10" },
{ name: "Salbutamol Inhaler", category: "Respiratory", costPrice: 80, sellingPrice: 120, stock: 30, minStock: 8, expiryDate: "2027-06-18" },
{ name: "Nebulizer Solution", category: "Respiratory", costPrice: 50, sellingPrice: 75, stock: 40, minStock: 10, expiryDate: "2027-02-28" },
{ name: "Syringes", category: "Supplies", costPrice: 5, sellingPrice: 10, stock: 300, minStock: 50, expiryDate: "2030-01-01" },
{ name: "Bandages", category: "Supplies", costPrice: 12, sellingPrice: 20, stock: 200, minStock: 40, expiryDate: "2030-06-01" },
{ name: "Alcohol Swabs", category: "Supplies", costPrice: 8, sellingPrice: 15, stock: 250, minStock: 50, expiryDate: "2029-12-01" },
{ name: "Surgical Mask Box", category: "Supplies", costPrice: 40, sellingPrice: 60, stock: 150, minStock: 30, expiryDate: "2029-08-15" },
{ name: "Surgical Gloves", category: "Supplies", costPrice: 28, sellingPrice: 45, stock: 180, minStock: 30, expiryDate: "2030-03-20" },
{ name: "IV Fluids", category: "Emergency", costPrice: 55, sellingPrice: 85, stock: 40, minStock: 10, expiryDate: "2027-08-30" },
{ name: "Oxygen Mask", category: "Emergency", costPrice: 70, sellingPrice: 110, stock: 25, minStock: 8, expiryDate: "2030-01-15" },
{ name: "Multivitamins", category: "Vitamins", costPrice: 45, sellingPrice: 70, stock: 85, minStock: 15, expiryDate: "2028-05-10" },
{ name: "Vitamin D", category: "Vitamins", costPrice: 35, sellingPrice: 55, stock: 90, minStock: 15, expiryDate: "2028-09-22" },
{ name: "Omega-3 Capsules", category: "Vitamins", costPrice: 65, sellingPrice: 95, stock: 60, minStock: 12, expiryDate: "2028-11-30" },
{ name: "Diapers", category: "Baby Care", costPrice: 80, sellingPrice: 120, stock: 50, minStock: 10, expiryDate: "2030-01-01" },
{ name: "Pediatric Syrup", category: "Baby Care", costPrice: 25, sellingPrice: 40, stock: 65, minStock: 12, expiryDate: "2027-04-05" },
{ name: "Insulin", category: "Diabetes", costPrice: 100, sellingPrice: 150, stock: 5, minStock: 8, expiryDate: "2025-06-01" },
{ name: "Nitroglycerin", category: "Heart", costPrice: 60, sellingPrice: 90, stock: 3, minStock: 8, expiryDate: "2025-07-15" },
{ name: "Epinephrine Injection", category: "Emergency", costPrice: 140, sellingPrice: 200, stock: 2, minStock: 5, expiryDate: "2025-08-01" },
{ name: "Baby Formula", category: "Baby Care", costPrice: 120, sellingPrice: 180, stock: 4, minStock: 8, expiryDate: "2025-09-10" },
{ name: "Cough Syrup", category: "Cold & Flu", costPrice: 20, sellingPrice: 35, stock: 6, minStock: 15, expiryDate: "2025-05-30" },
]; //cards of supplies with all the details

let savedStock = JSON.parse(localStorage.getItem("suppliesStock"));
if (savedStock) {
    for (let i = 0; i < supplies.length; i++) {  // saves the stock in local storage so it doesn't reset when you refresh the page
        supplies[i].stock = savedStock[i];
    }
}

function searchmed(){  //search function
    let input = document.getElementById("searchInput").value.toLowerCase(); // read it either lowercase or uppercase
    let results= document.getElementById("searchResults");
     results.innerHTML = "";

    for (let i = 0; i < supplies.length; i++) {
        if (supplies[i].name.toLowerCase().includes(input)) {      //can seearch the supply if you added a few letters and gives suggestions
            results.innerHTML += `
                <div class="medicine-result">
                    <p><strong>${supplies[i].name}</strong></p>
                    <p>Price: ${supplies[i].sellingPrice} EGP</p>
                    <p>Stock: ${supplies[i].stock}</p>
                    <button onclick="addToCart(${i})">Add to Cart</button>
                </div>
            `;
        }
    }

    if (results.innerHTML === "") {
        results.innerHTML = "<p>No medicine found.</p>"; // if no med is found
    }
}
let cart=[];  //empty cart
function addToCart(i){
    if (supplies[i].stock <= 0) {
       showAlert("This item is out of stock!") //checks if the stock is 0
        return;
    }
     
    let item=supplies[i];
    for(let j=0;j<cart.length; j++){
        if(cart[j].name ===item.name){
            cart[j].qty++;
             supplies[i].stock--;  //dec qty if med is found from stock and if alr in cart
            renderCart();
            searchmed();
            return;
        }}
supplies[i].stock--; //if item not alr in cart it adds it
cart.push({
    name:item.name,
    price: item.sellingPrice,
    qty:1
});
renderCart();
searchmed();
}
function renderCart() {
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
            <button  class="remove-btn" onclick="removeItem(${j})">Remove</button>
        </div>
    </div>
`;
    }
    if (cart.length > 0) { // if cart has items it shows total
    cartDiv.innerHTML += `<h3>Total: ${total} EGP</h3>`;
}
if (cart.length > 0) { //payment section only shows if cart has items
    document.getElementById("payment-section").style.display = "block";
} else {
    document.getElementById("payment-section").style.display = "none";
}
localStorage.setItem("suppliesStock", JSON.stringify(supplies.map(s => s.stock))); //saves the stock in local storage so it doesn't reset when you refresh the page
}
function increaseQty(j) {
    for (let i = 0; i < supplies.length; i++) {
        if (supplies[i].name === cart[j].name) {
            if (supplies[i].stock === 0) { // doesnt add below zero
                showAlert("No more stock available!");
                return;
            }
            supplies[i].stock--; 
            break;
        }
    }
    cart[j].qty++;
    renderCart();
    searchmed();
}
function decreaseQty(j) {
    for (let i = 0; i < supplies.length; i++) {
        if (supplies[i].name === cart[j].name) { 
            supplies[i].stock++;
            break;
        }
    }
    if (cart[j].qty > 1) {
        cart[j].qty--;
    } else {
        cart.splice(j, 1);  // remove it it reached zero
    }
    renderCart();
    searchmed();
}
function removeItem(j) {
    for (let i = 0; i < supplies.length; i++) {
        if (supplies[i].name === cart[j].name) {
            supplies[i].stock += cart[j].qty; //restore the items that were in the cart
            break;
        }
    }
    cart.splice(j, 1);
    renderCart();
    searchmed();
}
function checkout() {
    if (cart.length === 0) { // if cart is empty
        showAlert("Your cart is empty!")
        return;
    }
    let paymentinput = document.querySelector('input[name="payment"]:checked'); //must select payment method 
    if (paymentinput === null) {
       showAlert("Please select a payment method!")
        return;
    }

    let paymentmethod = paymentinput.value;
    generateReceipt(paymentmethod);
}
function generateReceipt(paymentmethod) {
    let sellerName = sessionStorage.getItem("currentDoctor");  
    let now = new Date(); // saves date
    let time = now.toLocaleTimeString("en-US", { //saves time
    hour: "2-digit",
    minute: "2-digit"
}); //saves time
    let date = now.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric"
    });

    let total = 0;
    let itemsHTML = "";

    for (let j = 0; j < cart.length; j++) {    //items showon in the receipt
        let subtotal = cart[j].price * cart[j].qty;
        total += subtotal;
        itemsHTML += `<p>${cart[j].name} x${cart[j].qty} = ${subtotal} EGP</p>`;
    }
    
   document.getElementById("modal-receipt").innerHTML = `  
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
//show modal
document.getElementById("modal-overlay").style.display = "flex";
let sale = {      //saves it
    date: date,
    time: time,
    items: cart.slice(), 
    total: total,
    payment: paymentmethod,
     seller: sellerName 
};
let salesHistory = JSON.parse(localStorage.getItem("salesHistory")) || []; //save sales in local storage
salesHistory.push(sale);
localStorage.setItem("salesHistory", JSON.stringify(salesHistory));

    cart = [];
    renderCart();
}
function closeModal() {
    document.getElementById("modal-overlay").style.display = "none";
}
function showAlert(message) {
    document.getElementById("alert-message").textContent = message; //popup alrets 
    document.getElementById("alert-overlay").style.display = "flex";
}

function closeAlert() {
    document.getElementById("alert-overlay").style.display = "none";
};
if(!sessionStorage.getItem("currentDoctor")) {

   window.location.href = "LogIn.html";
   alert("Please log in to access the Sales.");

}