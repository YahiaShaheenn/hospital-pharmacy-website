const supplies = [

    { name: "Paracetamol", category: "Pain Relief", price: 25, stock: 120 },
    { name: "Ibuprofen", category: "Pain Relief", price: 40, stock: 80 },
    { name: "Diclofenac", category: "Pain Relief", price: 55, stock: 60 },

    { name: "Amoxicillin", category: "Antibiotics", price: 65, stock: 90 },
    { name: "Azithromycin", category: "Antibiotics", price: 85, stock: 50 },
    { name: "Ciprofloxacin", category: "Antibiotics", price: 70, stock: 40 },

    { name: "Cough Syrup", category: "Cold & Flu", price: 35, stock: 75 },
    { name: "Nasal Spray", category: "Cold & Flu", price: 45, stock: 55 },
    { name: "Vitamin C Tablets", category: "Cold & Flu", price: 30, stock: 100 },

    { name: "Insulin", category: "Diabetes", price: 150, stock: 20 },
    { name: "Metformin", category: "Diabetes", price: 40, stock: 60 },
    { name: "Glucose Test Strips", category: "Diabetes", price: 80, stock: 35 },

    { name: "Amlodipine", category: "Heart", price: 55, stock: 45 },
    { name: "Atenolol", category: "Heart", price: 45, stock: 50 },
    { name: "Nitroglycerin", category: "Heart", price: 90, stock: 25 },

    { name: "Omeprazole", category: "Stomach", price: 50, stock: 70 },
    { name: "Antacids", category: "Stomach", price: 20, stock: 90 },
    { name: "ORS Packets", category: "Stomach", price: 15, stock: 110 },

    { name: "Salbutamol Inhaler", category: "Respiratory", price: 120, stock: 30 },
    { name: "Nebulizer Solution", category: "Respiratory", price: 75, stock: 40 },

    { name: "Syringes", category: "Supplies", price: 10, stock: 300 },
    { name: "Bandages", category: "Supplies", price: 20, stock: 200 },
    { name: "Alcohol Swabs", category: "Supplies", price: 15, stock: 250 },
    { name: "Surgical Mask Box", category: "Supplies", price: 60, stock: 150 },
    { name: "Surgical Gloves", category: "Supplies", price: 45, stock: 180 },

    { name: "Epinephrine Injection", category: "Emergency", price: 200, stock: 15 },
    { name: "IV Fluids", category: "Emergency", price: 85, stock: 40 },
    { name: "Oxygen Mask", category: "Emergency", price: 110, stock: 25 },

    { name: "Multivitamins", category: "Vitamins", price: 70, stock: 85 },
    { name: "Vitamin D", category: "Vitamins", price: 55, stock: 90 },
    { name: "Omega-3 Capsules", category: "Vitamins", price: 95, stock: 60 },

    { name: "Baby Formula", category: "Baby Care", price: 180, stock: 30 },
    { name: "Diapers", category: "Baby Care", price: 120, stock: 50 },
    { name: "Pediatric Syrup", category: "Baby Care", price: 40, stock: 65 }
];

function searchmed(){
    let input = document.getElementById("searchInput").value.toLowerCase(); // read it either lowercase or uppercase
    let results= document.getElementById("searchResults");
     results.innerHTML = "";

    for (let i = 0; i < supplies.length; i++) {
        if (supplies[i].name.toLowerCase().includes(input)) {      //can seearch the supply if you added a few letters and gives suggestions
            results.innerHTML += `
                <div class="medicine-result">
                    <p><strong>${supplies[i].name}</strong></p>
                    <p>Price: ${supplies[i].price} EGP</p>
                    <p>Stock: ${supplies[i].stock}</p>
                    <button onclick="addToCart(${i})">Add to Cart</button>
                </div>
            `;
        }
    }

    if (results.innerHTML === "") {
        results.innerHTML = "<p>No medicine found.</p>";
    }
}
let cart=[];
function addToCart(i){
      document.getElementById("receipt").innerHTML = "";
    let item=supplies[i];
    for(let j=0;j<cart.length; j++){
        if(cart[j].name ===item.name){
            cart[j].qty++;
             supplies[i].stock--;
            renderCart();
            searchmed();
            return;
        }}
supplies[i].stock--;
cart.push({
    name:item.name,
    price: item.price,
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
            <button onclick="removeItem(${j})">Remove</button>
        </div>
    </div>
`;
    }
    if (cart.length > 0) {
    cartDiv.innerHTML += `<h3>Total: ${total} EGP</h3>`;
}
if (cart.length > 0) {
    document.getElementById("payment-section").style.display = "block";
} else {
    document.getElementById("payment-section").style.display = "none";
}
}
function increaseQty(j) {
    // find the matching supply index
    for (let i = 0; i < supplies.length; i++) {
        if (supplies[i].name === cart[j].name) {
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
        cart.splice(j, 1);
    }
    renderCart();
    searchmed();
}
function removeItem(j) {
    for (let i = 0; i < supplies.length; i++) {
        if (supplies[i].name === cart[j].name) {
            supplies[i].stock += cart[j].qty;
            break;
        }
    }
    cart.splice(j, 1);
    renderCart();
    searchmed();
}
function checkout() {
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }
    let paymentinput = document.querySelector('input[name="payment"]:checked');
    if (paymentinput === null) {
        alert("Please select a payment method!");
        return;
    }

    let paymentmethod = paymentinput.value;
    generateReceipt(paymentmethod);
}
function generateReceipt(paymentmethod) {
    let receiptDiv = document.getElementById("receipt");  //save date and time
    let now = new Date();
    let date = now.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric"
    });

    let total = 0;
    let itemsHTML = "";

    for (let j = 0; j < cart.length; j++) {
        let subtotal = cart[j].price * cart[j].qty;
        total += subtotal;
        itemsHTML += `<p>${cart[j].name} x${cart[j].qty} = ${subtotal} EGP</p>`;
    }
    
    receiptDiv.innerHTML = `
        <h3>Receipt</h3>
        <p>${date}</p>
        <hr>
        ${itemsHTML}
        <hr>
        <h4>Total: ${total} EGP</h4>
        <p>Payment: ${paymentmethod}</p>
        <p>Thank you!</p>
    `;
let sale = {      //saves it
    date: date,
    items: cart.slice(), 
    total: total,
    payment: paymentmethod
};
let salesHistory = JSON.parse(localStorage.getItem("salesHistory")) || [];
salesHistory.push(sale);
localStorage.setItem("salesHistory", JSON.stringify(salesHistory));

    cart = [];
    renderCart();
}