let supplies = [];

let currentMedicineIndex = -1;
let currentAddMedicineIndex = -1;

/* 
    This function calculates the selling price automatically.
    The selling price = buying price + 20% profit.
*/
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

    document.getElementById("low_stock_count").textContent =
        supplies.filter(function (s) {
            return s.stock <= s.minStock;
        }).length;

    document.getElementById("expired_count").textContent =
        supplies.filter(function (s) {
            return new Date(s.expiryDate) < today;
        }).length;
}

function displayTable(data) {
    const tableBody = document.getElementById("inventory_table_body");

    tableBody.innerHTML = "";

    const sortedData = [...data].sort(function (a, b) {

        function getScore(medicine) {
            if (new Date(medicine.expiryDate) < new Date()) {
                return 2;
            }

            if (medicine.stock <= medicine.minStock) {
                return 1;
            }

            return 0;
        }

        return getScore(b) - getScore(a);
    });

    sortedData.forEach(function (med) {

        const indexInMain = supplies.indexOf(med);

        const isExp = new Date(med.expiryDate) < new Date();
        const isLow = med.stock <= med.minStock;

        let refundStatusHTML = "";

        if (med.refundable === "Refundable") {
            refundStatusHTML = '<span style="color: #4CAF50; font-weight: bold;">Yes</span>';
        } else {
            refundStatusHTML = '<span style="color: #f44336; font-weight: bold; font-size: 0.9em;">No</span>';
        }

        let statusHTML = "";

        if (isExp) {
            statusHTML = '<span class="material-icons" style="color:red">cancel</span>';
        } else if (isLow) {
            statusHTML = '<span class="material-icons" style="color:orange">warning</span>';
        } else {
            statusHTML = '<span class="material-icons" style="color:green">check_circle</span>';
        }

        tableBody.innerHTML += `
            <tr class="${isExp ? 'expired_row' : (isLow ? 'lowstock_row' : '')}">

                <td><strong>${med.name}</strong></td>

                <td>${med.category}</td>

                <td>${med.stock}</td>

                <td>${med.expiryDate}</td>

                <td>
                    <span style="color: #7f8c8d; font-size: 0.85em;">
                        Buy: ${med.costPrice} EGP
                    </span>
                    <br>
                    <strong>Sell: ${med.sellingPrice} EGP</strong>
                </td>

                <td>${refundStatusHTML}</td>

                <td>${statusHTML}</td>

                <td>
                    <button class="btn_edit" onclick="openTransactionModal(${indexInMain})">Edit</button>
                    <button class="btn_same" onclick="openAddSameMedicineModal(${indexInMain})">Add</button>
                </td>

            </tr>
        `;
    });
}

function searchMedicine() {
    const query = document.getElementById("searchInput").value.toLowerCase();

    const filtered = supplies.filter(function (med) {
        return med.name.toLowerCase().includes(query);
    });

    displayTable(filtered);
}

function resetSearch() {
    document.getElementById("searchInput").value = "";

    displayTable(supplies);
}

/* MESSAGE MODAL FUNCTIONS */

function showMessageModal(type, title, message) {
    const modal = document.getElementById("message_modal");
    const icon = document.getElementById("message_icon");
    const titleBox = document.getElementById("message_title");
    const textBox = document.getElementById("message_text");

    modal.classList.remove("success_message", "error_message");

    if (type === "success") {
        modal.classList.add("success_message");
        icon.textContent = "check_circle";
    } else {
        modal.classList.add("error_message");
        icon.textContent = "error";
    }

    titleBox.textContent = title;
    textBox.textContent = message;

    modal.style.display = "flex";
}

function closeMessageModal() {
    document.getElementById("message_modal").style.display = "none";
}

function markInputError(inputId) {
    document.getElementById(inputId).classList.add("field_error");
}

function clearInputErrors() {
    const inputs = document.querySelectorAll("input, select");

    inputs.forEach(function (input) {
        input.classList.remove("field_error");
    });
}

function setupInputErrorClearing() {
    const inputs = document.querySelectorAll("input, select");

    inputs.forEach(function (input) {

        input.addEventListener("input", function () {
            input.classList.remove("field_error");
        });

        input.addEventListener("change", function () {
            input.classList.remove("field_error");
        });

    });
}

/* AUTO SELLING PRICE DISPLAY */

function updateAutoSellingPrice(costInputId, sellingDisplayId) {
    const costValue = document.getElementById(costInputId).value.trim();
    const sellingDisplay = document.getElementById(sellingDisplayId);

    const cost = parseFloat(costValue);

    if (costValue === "" || isNaN(cost) || cost <= 0) {
        sellingDisplay.value = "";
        return;
    }

    sellingDisplay.value = calculateSellingPrice(cost);
}

function setupAutoSellingPriceCalculation() {
    document.getElementById("new_cost").addEventListener("input", function () {
        updateAutoSellingPrice("new_cost", "new_auto_selling");
    });

    document.getElementById("edit_cost").addEventListener("input", function () {
        updateAutoSellingPrice("edit_cost", "edit_auto_selling");
    });

    document.getElementById("same_cost").addEventListener("input", function () {
        updateAutoSellingPrice("same_cost", "same_auto_selling");
    });
}

/* ADD COMPLETELY NEW MEDICINE FROM TOP FORM */

function addNewMedicine() {
    clearInputErrors();

    const nameInput = document.getElementById("new_name");
    const categoryInput = document.getElementById("new_category");
    const stockInput = document.getElementById("new_stock");
    const expiryInput = document.getElementById("new_expiry");
    const costInput = document.getElementById("new_cost");
    const autoSellingInput = document.getElementById("new_auto_selling");
    const refundableInput = document.getElementById("new_refundable");

    const name = nameInput.value.trim();
    const cat = categoryInput.value;
    const stockValue = stockInput.value.trim();
    const exp = expiryInput.value;
    const costValue = costInput.value.trim();
    const isRefundable = refundableInput.value;

    let missingFields = [];

    if (name === "") {
        missingFields.push("Medicine Name");
        markInputError("new_name");
    }

    if (stockValue === "") {
        missingFields.push("Quantity Bought");
        markInputError("new_stock");
    }

    if (exp === "") {
        missingFields.push("Expiry Date");
        markInputError("new_expiry");
    }

    if (costValue === "") {
        missingFields.push("Buying Price");
        markInputError("new_cost");
    }

    if (missingFields.length > 0) {
        showMessageModal(
            "error",
            "Missing Required Fields",
            missingFields.join(", ") + " required."
        );

        return;
    }

    const stock = parseInt(stockValue);
    const cost = parseFloat(costValue);

    if (isNaN(stock) || stock <= 0) {
        markInputError("new_stock");

        showMessageModal(
            "error",
            "Invalid Quantity",
            "Quantity Bought must be greater than 0."
        );

        return;
    }

    if (isNaN(cost) || cost <= 0) {
        markInputError("new_cost");

        showMessageModal(
            "error",
            "Invalid Buying Price",
            "Buying Price must be greater than 0."
        );

        return;
    }

    const selling = calculateSellingPrice(cost);

    const min = 10;

    supplies.push({
        name: name,
        category: cat,
        costPrice: cost,
        sellingPrice: selling,
        stock: stock,
        minStock: min,
        expiryDate: exp,
        refundable: isRefundable
    });

    saveInventoryData();

    displayTable(supplies);

    updateSummaryCards();

    nameInput.value = "";
    stockInput.value = "";
    expiryInput.value = "";
    costInput.value = "";
    autoSellingInput.value = "";
    refundableInput.selectedIndex = 0;

    showMessageModal(
        "success",
        "Medicine Added Successfully",
        name + " has been added to the inventory stock."
    );
}

/* EDIT PRICE MODAL */

function openTransactionModal(index) {
    clearInputErrors();

    currentMedicineIndex = index;

    const med = supplies[index];

    document.getElementById("edit_medicine_name").textContent = med.name;

    document.getElementById("edit_cost").value = med.costPrice;
    document.getElementById("edit_auto_selling").value = calculateSellingPrice(parseFloat(med.costPrice));

    document.getElementById("edit_modal").style.display = "flex";
}

function closeTransactionModal() {
    document.getElementById("edit_modal").style.display = "none";
}

function processTransaction() {
    clearInputErrors();

    const costInput = document.getElementById("edit_cost");
    const autoSellingInput = document.getElementById("edit_auto_selling");

    const costValue = costInput.value.trim();

    let missingFields = [];

    if (costValue === "") {
        missingFields.push("Buying Price");
        markInputError("edit_cost");
    }

    if (missingFields.length > 0) {
        showMessageModal(
            "error",
            "Missing Required Fields",
            missingFields.join(", ") + " required."
        );

        return;
    }

    const newCost = parseFloat(costValue);

    if (isNaN(newCost) || newCost <= 0) {
        markInputError("edit_cost");

        showMessageModal(
            "error",
            "Invalid Buying Price",
            "Buying Price must be greater than 0."
        );

        return;
    }

    const newSelling = calculateSellingPrice(newCost);

    const med = supplies[currentMedicineIndex];

    med.costPrice = newCost;
    med.sellingPrice = newSelling;

    autoSellingInput.value = newSelling;

    saveInventoryData();

    displayTable(supplies);

    updateSummaryCards();

    closeTransactionModal();

    showMessageModal(
        "success",
        "Price Updated Successfully",
        med.name + " buying price has been updated, and the selling price was calculated automatically."
    );
}

/* ADD ANOTHER BATCH OF THE SAME MEDICINE */

function openAddSameMedicineModal(index) {
    clearInputErrors();

    currentAddMedicineIndex = index;

    const med = supplies[index];

    document.getElementById("same_medicine_name").textContent = med.name;

    document.getElementById("same_stock").value = "";
    document.getElementById("same_expiry").value = "";

    document.getElementById("same_cost").value = med.costPrice;
    document.getElementById("same_auto_selling").value = calculateSellingPrice(parseFloat(med.costPrice));

    document.getElementById("add_same_modal").style.display = "flex";
}

function closeAddSameMedicineModal() {
    document.getElementById("add_same_modal").style.display = "none";
}

function processAddSameMedicine() {
    clearInputErrors();

    const stockInput = document.getElementById("same_stock");
    const expiryInput = document.getElementById("same_expiry");
    const costInput = document.getElementById("same_cost");
    const autoSellingInput = document.getElementById("same_auto_selling");

    const stockValue = stockInput.value.trim();
    const expiryValue = expiryInput.value;
    const costValue = costInput.value.trim();

    let missingFields = [];

    if (stockValue === "") {
        missingFields.push("Stock Quantity");
        markInputError("same_stock");
    }

    if (expiryValue === "") {
        missingFields.push("Expiry Date");
        markInputError("same_expiry");
    }

    if (costValue === "") {
        missingFields.push("Buying Price");
        markInputError("same_cost");
    }

    if (missingFields.length > 0) {
        showMessageModal(
            "error",
            "Missing Required Fields",
            missingFields.join(", ") + " required."
        );

        return;
    }

    const newStock = parseInt(stockValue);
    const newCost = parseFloat(costValue);

    if (isNaN(newStock) || newStock <= 0) {
        markInputError("same_stock");

        showMessageModal(
            "error",
            "Invalid Stock",
            "Stock Quantity must be greater than 0."
        );

        return;
    }

    if (isNaN(newCost) || newCost <= 0) {
        markInputError("same_cost");

        showMessageModal(
            "error",
            "Invalid Buying Price",
            "Buying Price must be greater than 0."
        );

        return;
    }

    const newSelling = calculateSellingPrice(newCost);

    autoSellingInput.value = newSelling;

    const oldMed = supplies[currentAddMedicineIndex];

    supplies.push({
        name: oldMed.name,
        category: oldMed.category,
        costPrice: newCost,
        sellingPrice: newSelling,
        stock: newStock,
        minStock: oldMed.minStock || 10,
        expiryDate: expiryValue,
        refundable: oldMed.refundable
    });

    saveInventoryData();

    displayTable(supplies);

    updateSummaryCards();

    closeAddSameMedicineModal();

    showMessageModal(
        "success",
        "Batch Added Successfully",
        "Another batch of " + oldMed.name + " has been added. Selling price was calculated automatically."
    );
}

/* PAGE LOAD */

window.onload = function () {
    loadInventoryData();

    updateSummaryCards();

    displayTable(supplies);

    setupInputErrorClearing();

    setupAutoSellingPriceCalculation();
};