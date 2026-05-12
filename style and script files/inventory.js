let supplies = [];
let currentMedicineIndex = -1;

function calculateSellingPrice(cost) {
    return (cost * 1.20).toFixed(2);
}

function loadInventoryData() {
    const saved = localStorage.getItem("suppliesStock");
    supplies = saved ? JSON.parse(saved) : [];
}
function saveInventoryData() {
    localStorage.setItem("suppliesStock", JSON.stringify(supplies));
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