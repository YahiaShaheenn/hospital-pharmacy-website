window.onload = function () {
    if (!sessionStorage.getItem("currentDoctor")) {
        window.location.href = "LogIn.html";
        window.alert("Please log in to access the inventory.");
    }
}

let currentMedicineIndex = -1;

// --- Summary Cards ---
function updateSummaryCards() {
    let lowStock = 0;
    let expired = 0;

    for (let i = 0; i < supplies.length; i++) {  // Loop through supplies to count low stock and expired medicines
        if (supplies[i].stock <= supplies[i].minStock) lowStock++; //bnshof lw el stock a2al aw equal el minStock
        if (new Date(supplies[i].expiryDate) < new Date()) expired++; //bnshof lw el expiryDate a2al mn el date el 7aly (expired)
    }

    document.getElementById("total_items").textContent = supplies.length; 
    document.getElementById("low_stock_count").textContent = lowStock; 
    document.getElementById("expired_count").textContent = expired; 
}

// --- Display Table ---
function displayTable(data) {  // function el bt3ml display lel table 
    let tableBody = document.getElementById("inventory_table_body"); // ya3ny el tbody elly feh el data
    tableBody.innerHTML = ""; // bnms7 el data el 2dema 3ashan n7ot el data el gdeda

    if (data.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="9">No medicines found.</td></tr>`; // lw mafeesh data y3ny mafeesh medicines, hyb2a yktb no medicines found
        return;
    }

    for (let i = 0; i < data.length; i++) { // bnloop 3ala el data elly 3ndna (el medicines) w n7ot kol wa7da fe row
        let med = data[i]; // el medicine elly bn7ot fe row
        let isExpired = new Date(med.expiryDate) < new Date(); // bnshof lw el expiryDate a2al mn el date el 7aly (expired)
        let isLowStock = med.stock <= med.minStock; // bnshof lw el stock a2al aw equal el minStock (low stock)

        let status = "✅ OK"; 
        let rowClass = "";

        if (isExpired) {
            status = "❌ Expired"; // lw expired hyb2a status expired w rowClass expired_row
            rowClass = "expired_row"; // el class elly hyb2a feh el row elly expired
        } else if (isLowStock) {
            status = "⚠️ Low Stock"; // lw low stock hyb2a status low stock w rowClass lowstock_row
            rowClass = "lowstock_row";// el class elly hyb2a feh el row elly low stock
        }

        let originalIndex = supplies.indexOf(med); // bn7awel n3raf el index el asly lel medicine fe array el supplies 3ashan n3ml update 3aleh ba3d kda

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
function searchMedicine() { // function el bt3ml search w filter lel medicines
    let searchQuery = document.getElementById("searchInput").value.toLowerCase(); // bn7awel el search query lowercase 3ashan n3ml search case-insensitive
    let categoryValue = document.getElementById("categoryFilter").value; // bn5od el category elly enta m5tarha fe filter

    let filtered = []; 

    for (let i = 0; i < supplies.length; i++) { // // bn-loop 3ala el supplies 3ashan nla2y el dwa elly matches el esm wel category elly el user katabhom
        let nameMatch = supplies[i].name.toLowerCase().includes(searchQuery); // bnshof lw el name fe el supply includes el search query (case-insensitive)
        let categoryMatch = categoryValue === "" || supplies[i].category === categoryValue; //

        if (nameMatch && categoryMatch) { 
            filtered.push(supplies[i]);
        }
        // by filter msln lw ekhtart para ysheel ay haga mn el table  khlas ysebly da bs
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