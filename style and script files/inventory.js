window.onload = function () {
    loadInventoryData();
    updateSummaryCards();
    displayTable(supplies);
};

let currentMedicineIndex = -1;
let supplies = [];

function loadInventoryData() {
    let saved = localStorage.getItem("pharmacySupplies");
    if (saved) {
        supplies = JSON.parse(saved);
    } else {
        // Default 34 items data here...
        saveInventoryData();
    }
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

// Fixed Table Display with Sorting
function displayTable(data) {
    let tableBody = document.getElementById("inventory_table_body");
    tableBody.innerHTML = "";

    if (data.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="9">No results found.</td></tr>`;
        return;
    }

    // Sort the incoming data: Expired and Low Stock to the bottom
    let sortedData = [...data].sort((a, b) => {
        let getScore = (m) => (new Date(m.expiryDate) < new Date() ? 2 : (m.stock <= m.minStock ? 1 : 0));
        return getScore(a) - getScore(b);
    });

    sortedData.forEach(med => {
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

// Fixed Search Function
function searchMedicine() {
    let query = document.getElementById("searchInput").value.toLowerCase();
    let category = document.getElementById("categoryFilter").value;

    let filtered = supplies.filter(med => {
        let nameMatch = med.name.toLowerCase().includes(query);
        let catMatch = (category === "" || med.category === category);
        return nameMatch && catMatch;
    });

    displayTable(filtered);
}

function resetSearch() {
    document.getElementById("searchInput").value = "";
    document.getElementById("categoryFilter").value = "";
    displayTable(supplies);
}

function openTransactionModal(index) {
    currentMedicineIndex = index;
    const med = supplies[index];
    document.getElementById("edit_medicine_name").textContent = med.name;
    document.getElementById("edit_current_stock").textContent = med.stock;
    document.getElementById("edit_qty").value = "";
    document.getElementById("modal-doctor").value = "";
    document.getElementById("modal-reason").value = "";
    document.getElementById("edit_modal").style.display = "flex";
}

function closeTransactionModal() { document.getElementById("edit_modal").style.display = "none"; }

function processTransaction(action) {
    let qty = parseInt(document.getElementById("edit_qty").value);
    let doctor = document.getElementById("modal-doctor").value;
    let reason = document.getElementById("modal-reason").value;
    let med = supplies[currentMedicineIndex];

    if (isNaN(qty) || qty <= 0) return alert("Enter valid quantity.");
    if (action === 'take' && (!doctor || !reason)) return alert("Select Doctor and Reason.");

    if (action === 'add') {
        med.stock += qty;
    } else {
        if (qty > med.stock) return alert("Not enough stock.");
        med.stock -= qty;
    }

    saveInventoryData();
    updateSummaryCards();
    displayTable(supplies);
    closeTransactionModal();
}