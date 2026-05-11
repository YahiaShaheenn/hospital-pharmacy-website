// 1. The Static Data (Your 5 Medicines)
const inventory = [
    { id: "M001", name: "Panadol", category: "Analgesic", stock: 5, expiry: "2026-12" },
    { id: "M002", name: "Amoxil", category: "Antibiotic", stock: 20, expiry: "2027-08" },
    { id: "M003", name: "Brufen", category: "Painkiller", stock: 15, expiry: "2030-01" },
    { id: "M004", name: "Zyrtec", category: "Antihistamine", stock: 8, expiry: "2027-03" },
    { id: "M005", name: "Nexium", category: "Antacid", stock: 12, expiry: "2028-11" },
    { id: "M006", name: "Ketofan", category: "Painkiller", stock: 17, expiry: "2027-09" }
    .
];

// Remembers which medicine the doctor is currently looking at
let currentMedicineIndex = -1; 

// 2. Search Function
function searchMedicine() {
    const searchQuery = document.getElementById("searchInput").value.toLowerCase();
    
    let found = false;
    for (let i = 0; i < inventory.length; i++) {
        if (inventory[i].name.toLowerCase() === searchQuery) {
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
        alert("Medicine not found! Please try 'Panadol' or 'Amoxil'.");
    }
}

// 3. Update HTML Screen Function
function updateScreen() {
    const med = inventory[currentMedicineIndex];
    document.getElementById("display-name").innerText = med.name;
    document.getElementById("display-id").innerText = med.id;
    document.getElementById("display-category").innerText = med.category;
    document.getElementById("display-expiry").innerText = med.expiry;
    document.getElementById("display-stock").innerText = med.stock;
}

// 4. Add/Take Stock Function
function updateStock(action) {
    const inputBox = document.getElementById("qtyInput");
    const qty = parseInt(inputBox.value);

    if (isNaN(qty) || qty <= 0) {
        alert("Please enter a valid quantity.");
        return;
    }

    if (action === 'add') {
        inventory[currentMedicineIndex].stock += qty; 
    } else if (action === 'take') {
        if (qty > inventory[currentMedicineIndex].stock) {
            alert("Not enough stock available!");
            return;
        }
        inventory[currentMedicineIndex].stock -= qty; 
    }

    inputBox.value = "";
    updateScreen();
}