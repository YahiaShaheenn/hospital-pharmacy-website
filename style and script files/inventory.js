window.onload = function () {
    loadInventoryData();
    updateSummaryCards();
    displayTable(supplies);
};

let currentMedicineIndex = -1;
let supplies = [];

// Realistic Data: Low Stock and Expired are different items
const defaultSupplies = [
    { name: "Paracetamol", category: "Pain Relief", costPrice: 15, sellingPrice: 25, stock: 120, minStock: 20, expiryDate: "2024-06-01" }, 
    { name: "Amoxicillin", category: "Antibiotics", costPrice: 45, sellingPrice: 65, stock: 15, minStock: 15, expiryDate: "2027-03-20" }, 
    { name: "Insulin", category: "Diabetes", costPrice: 100, sellingPrice: 150, stock: 5, minStock: 8, expiryDate: "2027-06-01" }, 
    { name: "Nitroglycerin", category: "Heart", costPrice: 60, sellingPrice: 90, stock: 3, minStock: 8, expiryDate: "2028-07-15" }, 
    { name: "Ibuprofen", category: "Pain Relief", costPrice: 25, sellingPrice: 40, stock: 80, minStock: 15, expiryDate: "2027-08-15" }
    // ... add others as needed
];

function loadInventoryData() {
    let saved = localStorage.getItem("pharmacySupplies");
    supplies = saved ? JSON.parse(saved) : defaultSupplies;
}

function saveInventoryData() {
    localStorage.setItem("pharmacySupplies", JSON.stringify(supplies));
}

function updateSummaryCards() {
    let low = supplies.filter(s => s.stock <= s.minStock).length;
    let exp = supplies.filter(s => new Date(s.expiryDate) < new Date()).length;
    document.getElementById("total_items").textContent = supplies.length;
    document.getElementById("low_stock_count").textContent = low;
    document.getElementById("expired_count").textContent = exp;
}

function displayTable(data) {
    let tableBody = document.getElementById("inventory_table_body");
    tableBody.innerHTML = "";

    // Sort: OK first, then Warnings, then Expired at the very bottom
    let sorted = [...data].sort((a, b) => {
        let score = (m) => (new Date(m.expiryDate) < new Date() ? 2 : (m.stock <= m.minStock ? 1 : 0));
        return score(a) - score(b);
    });

    sorted.forEach(med => {
        let isExp = new Date(med.expiryDate) < new Date();
        let isLow = med.stock <= med.minStock;
        let rowClass = isExp ? "expired_row" : (isLow ? "lowstock_row" : "");
        let status = isExp ? "❌ Expired" : (isLow ? "⚠️ Low Stock" : "✅ OK");

        tableBody.innerHTML += `
            <tr class="${rowClass}">
                <td><strong>${med.name}</strong></td>
                <td>${med.category}</td>
                <td>${med.stock}</td>
                <td>${med.minStock}</td>
                <td>${med.expiryDate}</td>
                <td>${med.costPrice} EGP</td>
                <td>${med.sellingPrice} EGP</td>
                <td>${status}</td>
                <td><button onclick="openTransactionModal(${supplies.indexOf(med)})">Take / Update</button></td>
            </tr>`;
    });
}

function openTransactionModal(index) {
    currentMedicineIndex = index;
    const med = supplies[index];
    document.getElementById("edit_medicine_name").textContent = med.name;
    document.getElementById("edit_current_stock").textContent = med.stock;
    
    // Clear all inputs and selections
    document.getElementById("edit_qty").value = "";
    document.getElementById("modal-doctor").value = "";
    document.getElementById("modal-reason").value = "";
    
    document.getElementById("edit_modal").style.display = "flex";
}

function closeTransactionModal() { document.getElementById("edit_modal").style.display = "none"; }

function logTransactionToHistory(medName, type, qty, amount, person) {
    let history = JSON.parse(localStorage.getItem("pharmacyTransactions")) || [];
    history.push({ date: new Date().toISOString(), medicine: medName, type: type === 'take' ? "Take" : "Add Stock", quantity: qty, amount: amount, person: person });
    localStorage.setItem("pharmacyTransactions", JSON.stringify(history));
}

function processTransaction(action) {
    let qty = parseInt(document.getElementById("edit_qty").value);
    let doctor = document.getElementById("modal-doctor").value;
    let reason = document.getElementById("modal-reason").value;
    let med = supplies[currentMedicineIndex];

    if (isNaN(qty) || qty <= 0) return alert("Enter valid quantity.");
    if (action === 'take' && (!doctor || !reason)) return alert("Select Doctor and Reason.");

    if (action === 'add') {
        med.stock += qty;
        logTransactionToHistory(med.name, 'add', qty, qty * med.costPrice, "Owner");
    } else {
        if (qty > med.stock) return alert("Not enough stock.");
        med.stock -= qty;
        logTransactionToHistory(med.name, 'take', qty, qty * med.sellingPrice, doctor);
    }

    saveInventoryData();
    updateSummaryCards();
    displayTable(supplies);
    closeTransactionModal();
}