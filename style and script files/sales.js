// 1. Static Data Definition
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

let currentMedicineIndex = -1;

// 2. Table Render Function
function displayTable(data) {
    const tableBody = document.getElementById("inventory_table_body");
    tableBody.innerHTML = "";

    // Sort: Problematic at bottom (Healthy 0, Low Stock 1, Expired 2)
    const sortedData = [...data].sort((a, b) => {
        const getScore = (m) => {
            if (new Date(m.expiryDate) < new Date()) return 2; 
            if (m.stock <= m.minStock) return 1;              
            return 0;                                         
        };
        return getScore(a) - getScore(b); 
    });

    sortedData.forEach((med) => {
        const isExp = new Date(med.expiryDate) < new Date();
        const isLow = med.stock <= med.minStock;
        const indexInSupplies = supplies.findIndex(s => s.name === med.name);

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
                    <button class="btn_add" onclick="openTransactionModal(${indexInSupplies})">Add</button>
                    <button class="btn_delete" onclick="deleteMedicine(${indexInSupplies})">Delete</button>
                </td>
            </tr>`;
    });
}

// 3. Search and Summary logic
function searchMedicine() {
    const query = document.getElementById("searchInput").value.toLowerCase();
    const filtered = supplies.filter(med => med.name.toLowerCase().includes(query));
    displayTable(filtered);
}

function resetSearch() {
    document.getElementById("searchInput").value = "";
    displayTable(supplies);
}

function updateSummaryCards() {
    const today = new Date();
    document.getElementById("total_items").textContent = supplies.length;
    document.getElementById("low_stock_count").textContent = supplies.filter(s => s.stock <= s.minStock).length;
    document.getElementById("expired_count").textContent = supplies.filter(s => new Date(s.expiryDate) < today).length;
}

// 4. Modals and Transactions
function openTransactionModal(index) {
    currentMedicineIndex = index;
    document.getElementById("edit_medicine_name").textContent = supplies[index].name;
    document.getElementById("edit_modal").style.display = "flex";
}

function closeTransactionModal() {
    document.getElementById("edit_modal").style.display = "none";
}

function processTransaction() {
    const qty = parseInt(document.getElementById("edit_qty").value);
    if (isNaN(qty) || qty <= 0) return alert("Enter valid quantity!");

    supplies[currentMedicineIndex].stock += qty;
    displayTable(supplies);
    updateSummaryCards();
    closeTransactionModal();
    showSuccessWindow(`Success! Stock updated for ${supplies[currentMedicineIndex].name}.`);
}

function showSuccessWindow(msg) {
    document.getElementById("success_msg").textContent = msg;
    document.getElementById("success_modal").style.display = "flex";
}

function closeSuccessModal() {
    document.getElementById("success_modal").style.display = "none";
}

// 5. Initial Trigger (CRITICAL)
window.onload = function() {
    updateSummaryCards();
    displayTable(supplies);
};