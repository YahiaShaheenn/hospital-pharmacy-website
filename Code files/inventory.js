if (!sessionStorage.getItem("currentDoctor")) {
    window.location.href = "LogIn.html";
}

let currentMedicineIndex = -1;

// --- Summary Cards ---
function updateSummaryCards() {
    let lowStock = 0;
    let expired = 0;

    for (let i = 0; i < supplies.length; i++) {
        if (supplies[i].stock <= supplies[i].minStock) lowStock++;
        if (new Date(supplies[i].expiryDate) < new Date()) expired++;
    }

    document.getElementById("total_items").textContent = supplies.length;
    document.getElementById("low_stock_count").textContent = lowStock;
    document.getElementById("expired_count").textContent = expired;
}

// --- Display Table ---
function displayTable(data) {
    let tableBody = document.getElementById("inventory_table_body");
    tableBody.innerHTML = "";

    if (data.length === 0) {
        tableBody.innerHTML = <tr><td colspan="9">No medicines found.</td></tr>;
        return;
    }

    for (let i = 0; i < data.length; i++) {
        let med = data[i];
        let isExpired = new Date(med.expiryDate) < new Date();
        let isLowStock = med.stock <= med.minStock;

        let status = "✅ OK";
        let rowClass = "";

        if (isExpired) {
            status = "❌ Expired";
            rowClass = "expired_row";
        } else if (isLowStock) {
            status = "⚠️ Low Stock";
            rowClass = "lowstock_row";
        }

        let originalIndex = supplies.indexOf(med);

        tableBody.innerHTML += `
            <tr class="${rowClass}">
                <td>${med.name}</td>
                <td>${med.category}</td>
                <td>${med.stock}</td>
                <td>${med.minStock}</td>
                <td>${med.expiryDate}</td>
                <td>${med.costPrice} EGP</td>
                <td>${med.sellingPrice} EGP</td>
                <td>${status}</td>
                <td><button onclick="openEditModal(${originalIndex})">Update Stock</button></td>
            </tr>
        `;
    }
}

// --- Search & Filter ---
function searchMedicine() {
    let searchQuery = document.getElementById("searchInput").value.toLowerCase();
    let categoryValue = document.getElementById("categoryFilter").value;

    let filtered = [];

    for (let i = 0; i < supplies.length; i++) {
        let nameMatch = supplies[i].name.toLowerCase().includes(searchQuery);
        let categoryMatch = categoryValue === "" || supplies[i].category === categoryValue;

        if (nameMatch && categoryMatch) {
            filtered.push(supplies[i]);
        }
    }

    displayTable(filtered);
}

function resetSearch() {
    document.getElementById("searchInput").value = "";
    document.getElementById("categoryFilter").value = "";
    displayTable(supplies);
}

// --- Edit Modal ---
function openEditModal(index) {
    currentMedicineIndex = index;
    document.getElementById("edit_medicine_name").textContent = supplies[index].name;
    document.getElementById("edit_current_stock").textContent = supplies[index].stock;
    document.getElementById("edit_qty").value = "";
    document.getElementById("edit_modal").style.display = "flex";
}

function closeEditModal() {
    document.getElementById("edit_modal").style.display = "none";
}

function updateStock(action) {
    let qty = parseInt(document.getElementById("edit_qty").value);

    if (isNaN(qty) || qty <= 0) {
        alert("Please enter a valid quantity.");
        return;
    }

    if (action === 'add') {
        supplies[currentMedicineIndex].stock += qty;
    } else if (action === 'take') {
        if (qty > supplies[currentMedicineIndex].stock) {
            alert("Not enough stock!");
            return;
        }
        supplies[currentMedicineIndex].stock -= qty;
    }

    localStorage.setItem("suppliesStock", JSON.stringify(supplies.map(s => s.stock)));
    document.getElementById("edit_current_stock").textContent = supplies[currentMedicineIndex].stock;
    updateSummaryCards();
    displayTable(supplies);
}

// --- Init ---
updateSummaryCards();
displayTable(supplies);
