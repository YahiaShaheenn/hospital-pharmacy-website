

// SEED: Pre-fill inventory from hardcoded sales data if empty
(function seedInventory() {
    if (localStorage.getItem("pharmacySupplies")) return; // already has data, skip

    const hardcoded = [
        { name: "Paracetamol", category: "Pain Relief", costPrice: 15, sellingPrice: 25, stock: 120, minStock: 20, expiryDate: "2027-06-01" },
        { name: "Ibuprofen", category: "Pain Relief", costPrice: 25, sellingPrice: 40, stock: 80, minStock: 15, expiryDate: "2027-08-15" },
        { name: "Diclofenac", category: "Pain Relief", costPrice: 35, sellingPrice: 55, stock: 60, minStock: 10, expiryDate: "2028-01-10" },
        { name: "Amoxicillin", category: "Antibiotics", costPrice: 45, sellingPrice: 65, stock: 90, minStock: 15, expiryDate: "2027-03-20" },
        { name: "Azithromycin", category: "Antibiotics", costPrice: 60, sellingPrice: 85, stock: 50, minStock: 10, expiryDate: "2027-09-05" },
        { name: "Ciprofloxacin", category: "Antibiotics", costPrice: 50, sellingPrice: 70, stock: 40, minStock: 10, expiryDate: "2028-02-14" },
        { name: "Nasal Spray", category: "Cold & Flu", costPrice: 28, sellingPrice: 45, stock: 55, minStock: 10, expiryDate: "2027-04-18" },
        { name: "Vitamin C Tablets", category: "Cold & Flu", costPrice: 18, sellingPrice: 30, stock: 100, minStock: 20, expiryDate: "2028-07-22" },
        { name: "Cough Syrup", category: "Cold & Flu", costPrice: 20, sellingPrice: 35, stock: 6, minStock: 15, expiryDate: "2025-05-30" },
        { name: "Metformin", category: "Diabetes", costPrice: 25, sellingPrice: 40, stock: 60, minStock: 12, expiryDate: "2027-12-01" },
        { name: "Glucose Test Strips", category: "Diabetes", costPrice: 55, sellingPrice: 80, stock: 35, minStock: 10, expiryDate: "2027-05-15" },
        { name: "Insulin", category: "Diabetes", costPrice: 100, sellingPrice: 150, stock: 5, minStock: 8, expiryDate: "2025-06-01" },
        { name: "Amlodipine", category: "Heart", costPrice: 35, sellingPrice: 55, stock: 45, minStock: 10, expiryDate: "2028-03-08" },
        { name: "Atenolol", category: "Heart", costPrice: 28, sellingPrice: 45, stock: 50, minStock: 10, expiryDate: "2027-11-20" },
        { name: "Nitroglycerin", category: "Heart", costPrice: 60, sellingPrice: 90, stock: 3, minStock: 8, expiryDate: "2025-07-15" },
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
        { name: "Epinephrine Injection", category: "Emergency", costPrice: 140, sellingPrice: 200, stock: 2, minStock: 5, expiryDate: "2025-08-01" },
        { name: "Multivitamins", category: "Vitamins", costPrice: 45, sellingPrice: 70, stock: 85, minStock: 15, expiryDate: "2028-05-10" },
        { name: "Vitamin D", category: "Vitamins", costPrice: 35, sellingPrice: 55, stock: 90, minStock: 15, expiryDate: "2028-09-22" },
        { name: "Omega-3 Capsules", category: "Vitamins", costPrice: 65, sellingPrice: 95, stock: 60, minStock: 12, expiryDate: "2028-11-30" },
        { name: "Diapers", category: "Baby Care", costPrice: 80, sellingPrice: 120, stock: 50, minStock: 10, expiryDate: "2030-01-01" },
        { name: "Pediatric Syrup", category: "Baby Care", costPrice: 25, sellingPrice: 40, stock: 65, minStock: 12, expiryDate: "2027-04-05" },
        { name: "Baby Formula", category: "Baby Care", costPrice: 120, sellingPrice: 180, stock: 4, minStock: 8, expiryDate: "2025-09-10" },
    ];

    localStorage.setItem("pharmacySupplies", JSON.stringify(hardcoded));
})();

let supplies = [];
let currentMedicineIndex = -1;

function calculateSellingPrice(cost) {
    return (cost * 1.20).toFixed(2);
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

    // SORT: Healthy (0) -> Low Stock (1) -> Expired (2) at bottom
    const sortedData = [...data].sort((a, b) => {
        const getScore = (m) => {
            if (new Date(m.expiryDate) < new Date()) return 2; 
            if (m.stock <= m.minStock) return 1;              
            return 0;                                         
        };
        return getScore(a) - getScore(b); 
    });

    sortedData.forEach((med) => {
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
                <td>
                    ${isExp ? '<span class="material-icons" style="color:red">cancel</span>' : 
                    (isLow ? '<span class="material-icons" style="color:orange">warning</span>' : 
                    '<span class="material-icons" style="color:green">check_circle</span>')}
                </td>
                <td>
                    <button class="btn_add" onclick="openTransactionModal(${indexInMain})">Add</button>
                    <button class="btn_delete" onclick="deleteMedicine(${indexInMain})">Delete</button>
                </td>
            </tr>`;
    });
}

function searchMedicine() {
    const query = document.getElementById("searchInput").value.toLowerCase();
    const filtered = supplies.filter(med => med.name.toLowerCase().includes(query));
    displayTable(filtered);
}

function resetSearch() {
    document.getElementById("searchInput").value = "";
    displayTable(supplies);
}

function addNewMedicine() {
    const name = document.getElementById("new_name").value;
    const cat = document.getElementById("new_category").value;
    const cost = parseFloat(document.getElementById("new_cost").value);
    const stock = parseInt(document.getElementById("new_stock").value) || 0;
    const min = parseInt(document.getElementById("new_min").value) || 10;
    const exp = document.getElementById("new_expiry").value;

    if (!name || isNaN(cost) || !exp) return alert("Fill in Name, Price, and Expiry!");

    supplies.push({ name, category: cat, costPrice: cost, sellingPrice: calculateSellingPrice(cost), stock, minStock: min, expiryDate: exp });
    saveInventoryData();
    displayTable(supplies);
    updateSummaryCards();
    document.querySelectorAll('.new_med_grid input').forEach(i => i.value = "");
    alert("New medicine added successfully!");
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

function processTransaction() {
    const qty = parseInt(document.getElementById("edit_qty").value);
    if (isNaN(qty) || qty <= 0) return alert("Enter valid quantity!");

    const med = supplies[currentMedicineIndex];
    med.stock += qty;
    
    saveInventoryData();
    displayTable(supplies);
    updateSummaryCards();
    alert(`Success! Stock updated for ${med.name}.`);
    closeTransactionModal();
}

function deleteMedicine(index) {
    if(confirm("Delete this medicine?")) {
        supplies.splice(index, 1);
        saveInventoryData();
        displayTable(supplies);
        updateSummaryCards();
    }
}

window.onload = function() {
    loadInventoryData();
    updateSummaryCards();
    displayTable(supplies);
};