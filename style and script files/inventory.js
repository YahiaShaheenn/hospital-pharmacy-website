window.onload = function () {
    loadInventoryData();
    updateSummaryCards();
    displayTable(supplies);
};

let currentMedicineIndex = -1;
let supplies = [];

// AUTO-PRICE LOGIC: Adds 20% profit
function calculateSellingPrice(cost) {
    return (cost * 1.20).toFixed(2); 
}

// DELETE MEDICINE
function deleteMedicine(index) {
    if (confirm("Are you sure you want to remove this medicine?")) {
        supplies.splice(index, 1);
        saveInventoryData();
        displayTable(supplies);
        updateSummaryCards();
    }
}

// REGISTER NEW MEDICINE
function addNewMedicine() {
    const name = document.getElementById("new_name").value;
    const cat = document.getElementById("new_category").value;
    const cost = parseFloat(document.getElementById("new_cost").value);
    const min = parseInt(document.getElementById("new_min").value) || 10;
    const exp = document.getElementById("new_expiry").value;

    if (!name || isNaN(cost) || !exp) return alert("Fill in Name, Price, and Expiry!");

    const newEntry = {
        name: name,
        category: cat,
        costPrice: cost,
        sellingPrice: calculateSellingPrice(cost),
        stock: 0, 
        minStock: min,
        expiryDate: exp
    };

    supplies.push(newEntry);
    saveInventoryData();
    displayTable(supplies);
    updateSummaryCards();
    
    // Clear inputs
    document.getElementById("new_name").value = "";
    document.getElementById("new_cost").value = "";
    document.getElementById("new_min").value = "";
    document.getElementById("new_expiry").value = "";
}

function loadInventoryData() {
    const saved = localStorage.getItem("pharmacySupplies");
    supplies = saved ? JSON.parse(saved) : [];
}

function saveInventoryData() {
    localStorage.setItem("pharmacySupplies", JSON.stringify(supplies));
}

function updateSummaryCards() {
    const today = new Date();
    document.getElementById("total_items").textContent = supplies.length;
    document.getElementById("low_stock_count").textContent = supplies.filter(s => s.stock <= s.minStock).length;
    document.getElementById("expired_count").textContent = supplies.filter(s => new Date(s.expiryDate) < today).length;
}

function displayTable(data) {
    const tableBody = document.getElementById("inventory_table_body");
    tableBody.innerHTML = "";

    data.forEach((med) => {
        const indexInMain = supplies.indexOf(med);
        const isExp = new Date(med.expiryDate) < new Date();
        const isLow = med.stock <= med.minStock;
        
        tableBody.innerHTML += `
            <tr class="${isExp ? 'expired_row' : (isLow ? 'lowstock_row' : '')}">
                <td><strong>${med.name}</strong></td>
                <td>${med.category}</td>
                <td>${med.stock}</td>
                <td>${med.minStock}</td>
                <td>${med.expiryDate}</td>
                <td>${med.costPrice} EGP</td>
                <td><strong>${med.sellingPrice} EGP</strong></td>
                <td>${isExp ? '❌ Expired' : (isLow ? '⚠️ Low' : '✅ OK')}</td>
                <td>
                    <button class="btn_add" onclick="openTransactionModal(${indexInMain})">Add</button>
                    <button class="btn_delete" onclick="deleteMedicine(${indexInMain})">Delete</button>
                </td>
            </tr>`;
    });
}

function searchMedicine() {
    const query = document.getElementById("searchInput").value.toLowerCase();
    const filtered = supplies.filter(m => m.name.toLowerCase().includes(query));
    displayTable(filtered);
}

function resetSearch() {
    document.getElementById("searchInput").value = "";
    displayTable(supplies);
}

function openTransactionModal(index) {
    currentMedicineIndex = index;
    document.getElementById("edit_medicine_name").textContent = supplies[index].name;
    document.getElementById("edit_qty").value = "";
    document.getElementById("edit_modal").style.display = "flex";
}

function closeTransactionModal() { 
    document.getElementById("edit_modal").style.display = "none"; 
}

function processTransaction(action) {
    const qty = parseInt(document.getElementById("edit_qty").value);
    if (isNaN(qty) || qty <= 0) return alert("Enter valid quantity!");

    supplies[currentMedicineIndex].stock += qty;

    saveInventoryData();
    updateSummaryCards();
    displayTable(supplies);
    closeTransactionModal();
}