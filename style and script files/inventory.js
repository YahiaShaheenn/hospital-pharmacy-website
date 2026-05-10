let currentMedicineIndex = -1; 

function searchMedicine() {
    const searchQuery = document.getElementById("searchInput").value.toLowerCase();
    
    let found = false;
    for (let i = 0; i < supplies.length; i++) {
        if (supplies[i].name.toLowerCase() === searchQuery) {
            currentMedicineIndex = i; 
            found = true;
            break;
        }
    }

    if (found) {
        updateScreen();
        document.getElementById("medicineCard").style.display = "block";
    } else {
        document.getElementById("medicineCard").style.display = "none";
        alert("Medicine not found!");
    }
}

function updateScreen() {
    const med = supplies[currentMedicineIndex];
    document.getElementById("display-name").innerText = med.name;
    document.getElementById("display-category").innerText = med.category;
    document.getElementById("display-expiry").innerText = med.expiryDate;
    document.getElementById("display-stock").innerText = med.stock;
}

function updateStock(action) {
    const inputBox = document.getElementById("qtyInput");
    const qty = parseInt(inputBox.value);

    if (isNaN(qty) || qty <= 0) {
        alert("Please enter a valid quantity.");
        return;
    }

    if (action === 'add') {
        supplies[currentMedicineIndex].stock += qty; 
    } else if (action === 'take') {
        if (qty > supplies[currentMedicineIndex].stock) {
            alert("Not enough stock available!");
            return;
        }
        supplies[currentMedicineIndex].stock -= qty; 
    }

    inputBox.value = "";
    updateScreen();
    localStorage.setItem("suppliesStock", JSON.stringify(supplies.map(s => s.stock)));
}
if(!sessionStorage.getItem("currentDoctor")) {

   window.location.href = "LogIn.html";
   alert("Please log in to access the Inventory.");

}