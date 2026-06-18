let supplies = [];
let inventoryHistory = JSON.parse(localStorage.getItem("inventoryHistory")) || [];

let currentMedicineIndex = -1;
let currentBatchMedicineIndex = -1;
let currentDeleteMedicineIndex = -1;

/* 
    Selling price is calculated automatically.
    Selling price = buying price + 20% profit.
*/
function calculateSellingPrice(cost) {
    return (Number(cost) * 1.20).toFixed(2);
}

function normalizeName(name) {
    return name.trim().toLowerCase();
}

isAdmin = sessionStorage.getItem("admin") === "true";

function loadInventoryData() {
    const saved = localStorage.getItem("suppliesStock");

    supplies = saved ? JSON.parse(saved) : [];

    migrateOldInventoryData();

    saveInventoryData();
}

function saveInventoryData() {
    localStorage.setItem("suppliesStock", JSON.stringify(supplies));
}

function saveInventoryHistory() {
    localStorage.setItem("inventoryHistory", JSON.stringify(inventoryHistory));
}

function formatInventoryEventTimestamp() {
    const now = new Date();
    return {
        date: now.toISOString().split("T")[0],
        time: now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
    };
}

function addInventoryHistoryEntry(name, category, quantity, expiryDate, costPrice) {
    const seller = sessionStorage.getItem("currentDoctor") || "Unknown";
    const timestamp = formatInventoryEventTimestamp();

    inventoryHistory.push({
        name: name,
        category: category,
        date: timestamp.date,
        time: timestamp.time,
        seller: seller,
        expiryDate: expiryDate || "No expiry",
        costPrice: Number(costPrice).toFixed(2),
        quantity: Number(quantity),
        totalPrice: (Number(costPrice) * Number(quantity)).toFixed(2)
    });

    saveInventoryHistory();
}

/* 
    Converts old data into the batch system.
    It merges medicines with the same name, category, and refund policy.
*/
function migrateOldInventoryData() {
    let mergedSupplies = [];

    supplies.forEach(function (med) {

        const medicineName = med.name || "";

        if (medicineName.trim() === "") {
            return;
        }

        const medicineCategory = med.category || "Supplies";
        const medicineRefundable = med.refundable || "Refundable";
        const medicineCost = Number(med.costPrice) || 0;
        const medicineMinStock = med.minStock || 10;

        let medicineBatches = [];

        if (Array.isArray(med.batches) && med.batches.length > 0) {

            medicineBatches = med.batches.map(function (batch) {

                const batchCost = Number(batch.costPrice) || medicineCost;
                const batchAddedAt = Number(batch.addedAt) || Date.now();

                return {
                    stock: Number(batch.stock) || 0,
                    expiryDate: batch.expiryDate,
                    costPrice: batchCost,
                    sellingPrice: batch.sellingPrice || calculateSellingPrice(batchCost),
                    addedAt: batchAddedAt
                };

            });

        } else {

            medicineBatches.push({
                stock: Number(med.stock) || 0,
                expiryDate: med.expiryDate,
                costPrice: medicineCost,
                sellingPrice: calculateSellingPrice(medicineCost),
                addedAt: Date.now()
            });

        }

        const existingMedicine = mergedSupplies.find(function (item) {
            return normalizeName(item.name) === normalizeName(medicineName) &&
                item.category === medicineCategory &&
                item.refundable === medicineRefundable;
        });

        if (existingMedicine) {

            medicineBatches.forEach(function (batch) {
                if (batch.expiryDate) {
                    addBatchToMedicine(
                        existingMedicine,
                        Number(batch.stock) || 0,
                        batch.expiryDate,
                        Number(batch.costPrice) || medicineCost,
                        Number(batch.addedAt) || Date.now()
                    );
                }
            });

        } else {

            const newMedicine = {
                name: medicineName,
                category: medicineCategory,
                costPrice: medicineCost,
                sellingPrice: calculateSellingPrice(medicineCost),
                stock: 0,
                minStock: medicineMinStock,
                expiryDate: "",
                refundable: medicineRefundable,
                batches: []
            };

            medicineBatches.forEach(function (batch) {
                if (batch.expiryDate) {
                    addBatchToMedicine(
                        newMedicine,
                        Number(batch.stock) || 0,
                        batch.expiryDate,
                        Number(batch.costPrice) || medicineCost,
                        Number(batch.addedAt) || Date.now()
                    );
                }
            });

            updateMedicineHighestPrice(newMedicine);

            mergedSupplies.push(newMedicine);
        }

    });

    supplies = mergedSupplies;
}

function getTotalStock(med) {
    if (!Array.isArray(med.batches)) {
        return Number(med.stock) || 0;
    }

    let total = 0;

    med.batches.forEach(function (batch) {
        total += Number(batch.stock) || 0;
    });

    return total;
}

function isExpiredDate(expiryDate) {
    if (!expiryDate) {
        return false;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const expiry = new Date(expiryDate);
    expiry.setHours(0, 0, 0, 0);

    return expiry < today;
}

/*
    Main table status:
    Expired only if ALL batches are expired.
*/
function hasExpiredBatch(med) {
    if (!Array.isArray(med.batches) || med.batches.length === 0) {
        return isExpiredDate(med.expiryDate);
    }

    const validBatches = med.batches.filter(function (batch) {
        return batch.expiryDate;
    });

    if (validBatches.length === 0) {
        return false;
    }

    const hasNotExpiredBatch = validBatches.some(function (batch) {
        return !isExpiredDate(batch.expiryDate);
    });

    return !hasNotExpiredBatch;
}

/*
    Delete button:
    True if there is at least one expired batch.
*/
function hasAnyExpiredBatch(med) {
    if (!Array.isArray(med.batches) || med.batches.length === 0) {
        return isExpiredDate(med.expiryDate);
    }

    return med.batches.some(function (batch) {
        return isExpiredDate(batch.expiryDate);
    });
}

/*
    Shows the nearest non-expired expiry date.
*/
function getNearestExpiry(med) {
    if (!Array.isArray(med.batches) || med.batches.length === 0) {
        return "No expiry";
    }

    const validBatches = med.batches.filter(function (batch) {
        return batch.expiryDate;
    });

    if (validBatches.length === 0) {
        return "No expiry";
    }

    const notExpiredBatches = validBatches.filter(function (batch) {
        return !isExpiredDate(batch.expiryDate);
    });

    const batchesToUse = notExpiredBatches.length > 0 ? notExpiredBatches : validBatches;

    const sortedBatches = [...batchesToUse].sort(function (a, b) {
        return new Date(a.expiryDate) - new Date(b.expiryDate);
    });

    return sortedBatches[0].expiryDate;
}

function sortBatchesByExpiry(med) {
    med.batches.sort(function (a, b) {
        return new Date(a.expiryDate) - new Date(b.expiryDate);
    });
}

function consolidateBatches(med) {
    let mergedBatches = [];

    med.batches.forEach(function (batch) {

        const batchCost = Number(batch.costPrice) || Number(med.costPrice) || 0;
        const batchAddedAt = Number(batch.addedAt) || Date.now();

        const existingBatch = mergedBatches.find(function (item) {
            return item.expiryDate === batch.expiryDate &&
                Number(item.costPrice) === batchCost;
        });

        if (existingBatch) {
            existingBatch.stock = Number(existingBatch.stock) + Number(batch.stock);

            if (batchAddedAt > existingBatch.addedAt) {
                existingBatch.addedAt = batchAddedAt;
            }

        } else {
            mergedBatches.push({
                stock: Number(batch.stock) || 0,
                expiryDate: batch.expiryDate,
                costPrice: batchCost,
                sellingPrice: calculateSellingPrice(batchCost),
                addedAt: batchAddedAt
            });
        }

    });

    med.batches = mergedBatches;

    sortBatchesByExpiry(med);
}

function updateMedicineHighestPrice(med) {
    let highestCost = 0;

    if (Array.isArray(med.batches) && med.batches.length > 0) {

        med.batches.forEach(function (batch) {

            const batchCost = Number(batch.costPrice) || 0;

            if (batchCost > highestCost) {
                highestCost = batchCost;
            }

        });

    } else {
        highestCost = Number(med.costPrice) || 0;
    }

    med.costPrice = highestCost;
    med.sellingPrice = calculateSellingPrice(highestCost);
    med.stock = getTotalStock(med);
    med.expiryDate = getNearestExpiry(med);
}

function getDifferentPriceCount(med) {
    if (!Array.isArray(med.batches)) {
        return 1;
    }

    let prices = [];

    med.batches.forEach(function (batch) {
        const batchCost = Number(batch.costPrice) || Number(med.costPrice) || 0;

        if (!prices.includes(batchCost)) {
            prices.push(batchCost);
        }
    });

    return prices.length;
}

function getNewestBatch(med) {
    if (!Array.isArray(med.batches) || med.batches.length === 0) {
        return null;
    }

    let newestBatch = med.batches[0];

    med.batches.forEach(function (batch) {
        if ((Number(batch.addedAt) || 0) > (Number(newestBatch.addedAt) || 0)) {
            newestBatch = batch;
        }
    });

    return newestBatch;
}

function addBatchToMedicine(med, stock, expiryDate, costPrice, addedAt) {
    if (!Array.isArray(med.batches)) {
        med.batches = [];
    }

    const batchCost = Number(costPrice) || Number(med.costPrice) || 0;
    const batchSelling = calculateSellingPrice(batchCost);
    const batchAddedAt = addedAt || Date.now();

    const existingBatch = med.batches.find(function (batch) {
        return batch.expiryDate === expiryDate &&
            Number(batch.costPrice) === batchCost;
    });

    if (existingBatch) {
        existingBatch.stock = Number(existingBatch.stock) + Number(stock);
        existingBatch.addedAt = batchAddedAt;
    } else {
        med.batches.push({
            stock: Number(stock),
            expiryDate: expiryDate,
            costPrice: batchCost,
            sellingPrice: batchSelling,
            addedAt: batchAddedAt
        });
    }

    consolidateBatches(med);
    updateMedicineHighestPrice(med);
}

function updateSummaryCards() {
    document.getElementById("total_items").textContent = supplies.length;

    document.getElementById("low_stock_count").textContent =
        supplies.filter(function (med) {
            return getTotalStock(med) <= med.minStock;
        }).length;

    document.getElementById("expired_count").textContent =
        supplies.filter(function (med) {
            return hasExpiredBatch(med);
        }).length;
}

function displayTable(data) {
    const tableBody = document.getElementById("inventory_table_body");

    tableBody.innerHTML = "";

    const sortedData = [...data].sort(function (a, b) {

        function getScore(medicine) {
            if (hasExpiredBatch(medicine)) {
                return 2;
            }

            if (getTotalStock(medicine) <= medicine.minStock) {
                return 1;
            }

            return 0;
        }

        return getScore(b) - getScore(a);
    });

    sortedData.forEach(function (med) {

        updateMedicineHighestPrice(med);

        const indexInMain = supplies.indexOf(med);

        const totalStock = getTotalStock(med);
        const nearestValidExpiry = getNearestExpiry(med);

        const isExp = hasExpiredBatch(med);
        const isLow = totalStock <= med.minStock;

        const priceLevels = getDifferentPriceCount(med);
        const newestBatch = getNewestBatch(med);

        const newestCost = newestBatch ? Number(newestBatch.costPrice) : Number(med.costPrice);
        const newestSelling = newestBatch ? newestBatch.sellingPrice || calculateSellingPrice(newestCost) : med.sellingPrice;

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

        let detailsButtonHTML = "";

        if (med.batches.length > 1 || priceLevels > 1) {
            detailsButtonHTML = `
                <button class="btn_details" onclick="openDetailsModal(${indexInMain})">
                    Details
                </button>
            `;
        }

        let deleteButtonHTML = "";

        if (isAdmin) {
            deleteButtonHTML = `
                <button class="btn_delete" onclick="deleteExpiredMedicine(${indexInMain})">
                    Delete
                </button>
            `;
        }

        let batchInfoHTML = "";

        if (med.batches.length > 1) {
            batchInfoHTML = `<span class="batch_count">${med.batches.length} batches</span>`;
        }

        let priceInfoHTML = "";

        if (priceLevels > 1) {
            priceInfoHTML = `<span class="price_note">${priceLevels} buying prices</span>`;
        }

        tableBody.innerHTML += `
            <tr class="${isExp ? 'expired_row' : (isLow ? 'lowstock_row' : '')}">

                <td>
                    <strong>${med.name}</strong>
                    ${batchInfoHTML}
                    ${priceInfoHTML}
                </td>

                <td>${med.category}</td>

                <td>${totalStock}</td>

                <td>${nearestValidExpiry}</td>

                <td>
                    <span style="color: #7f8c8d; font-size: 0.85em;">
                        Newest Buy: ${newestCost} EGP
                    </span>
                    <br>
                    <strong>Newest Sell: ${newestSelling} EGP</strong>
                </td>

                <td>${refundStatusHTML}</td>

                <td>${statusHTML}</td>

                <td>
                    <button class="btn_edit" onclick="openTransactionModal(${indexInMain})">
                        Edit
                    </button>

                    <button class="btn_batch" onclick="openAddBatchModal(${indexInMain})">
                        Add
                    </button>

                    ${detailsButtonHTML}

                    ${deleteButtonHTML}
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

    document.getElementById("batch_cost").addEventListener("input", function () {
        updateAutoSellingPrice("batch_cost", "batch_auto_selling");
    });
}

/* PREVENT NEGATIVE NUMBERS */

function preventNegativeNumbers() {
    const numberInputs = document.querySelectorAll('input[type="number"]');

    numberInputs.forEach(function (input) {

        input.addEventListener("keydown", function (event) {
            if (event.key === "-" || event.key === "+" || event.key === "e") {
                event.preventDefault();
            }
        });

        input.addEventListener("input", function () {
            if (Number(input.value) < 0) {
                input.value = "";
            }
        });

    });
}

/* ADD COMPLETELY NEW MEDICINE OR ADD SAME MEDICINE AS A BATCH */

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

    const existingMedicine = supplies.find(function (med) {
        return normalizeName(med.name) === normalizeName(name);
    });

    if (existingMedicine) {

        const sameCategory = existingMedicine.category === cat;
        const sameRefundPolicy = existingMedicine.refundable === isRefundable;

        if (!sameCategory || !sameRefundPolicy) {
            showMessageModal(
                "error",
                "Medicine Already Exists",
                "This medicine name already exists with a different category or refund policy."
            );

            return;
        }

        addBatchToMedicine(existingMedicine, stock, exp, cost);
        addInventoryHistoryEntry(existingMedicine.name, existingMedicine.category, stock, exp, cost);

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
            "Batch Added Successfully",
            "This medicine already exists, so the new stock was added under the same row."
        );

        return;
    }

    const min = 10;

    const newMedicine = {
        name: name,
        category: cat,
        costPrice: cost,
        sellingPrice: calculateSellingPrice(cost),
        stock: 0,
        minStock: min,
        expiryDate: "",
        refundable: isRefundable,
        batches: []
    };

    addBatchToMedicine(newMedicine, stock, exp, cost);
    supplies.push(newMedicine);
    addInventoryHistoryEntry(name, cat, stock, exp, cost);

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

/* EDIT NEWEST BATCH PRICE ONLY */

function openTransactionModal(index) {
    clearInputErrors();

    currentMedicineIndex = index;

    const med = supplies[index];
    const newestBatch = getNewestBatch(med);

    document.getElementById("edit_medicine_name").textContent = med.name;

    if (newestBatch) {
        document.getElementById("edit_cost").value = newestBatch.costPrice;
        document.getElementById("edit_auto_selling").value = newestBatch.sellingPrice;
    } else {
        document.getElementById("edit_cost").value = med.costPrice;
        document.getElementById("edit_auto_selling").value = med.sellingPrice;
    }

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

    if (costValue === "") {
        markInputError("edit_cost");

        showMessageModal(
            "error",
            "Missing Required Field",
            "Buying Price is required."
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

    const med = supplies[currentMedicineIndex];
    const newestBatch = getNewestBatch(med);

    if (!newestBatch) {
        showMessageModal(
            "error",
            "No Batch Found",
            "There is no batch available to edit."
        );

        return;
    }

    newestBatch.costPrice = newCost;
    newestBatch.sellingPrice = calculateSellingPrice(newCost);

    autoSellingInput.value = newestBatch.sellingPrice;

    consolidateBatches(med);
    updateMedicineHighestPrice(med);

    saveInventoryData();

    displayTable(supplies);

    updateSummaryCards();

    closeTransactionModal();

    showMessageModal(
        "success",
        "Price Updated Successfully",
        "Only the newest batch price was updated."
    );
}

/* ADD ANOTHER BATCH TO SAME MEDICINE ROW */

function openAddBatchModal(index) {
    clearInputErrors();

    currentBatchMedicineIndex = index;

    const med = supplies[index];

    document.getElementById("batch_medicine_name").textContent = med.name;

    document.getElementById("batch_stock").value = "";
    document.getElementById("batch_expiry").value = "";

    document.getElementById("batch_cost").value = med.costPrice;
    document.getElementById("batch_auto_selling").value = calculateSellingPrice(Number(med.costPrice));

    document.getElementById("add_batch_modal").style.display = "flex";
}

function closeAddBatchModal() {
    document.getElementById("add_batch_modal").style.display = "none";
}

function processAddBatch() {
    clearInputErrors();

    const stockInput = document.getElementById("batch_stock");
    const expiryInput = document.getElementById("batch_expiry");
    const costInput = document.getElementById("batch_cost");
    const autoSellingInput = document.getElementById("batch_auto_selling");

    const stockValue = stockInput.value.trim();
    const expiryValue = expiryInput.value;
    const costValue = costInput.value.trim();

    let missingFields = [];

    if (stockValue === "") {
        missingFields.push("Stock Quantity");
        markInputError("batch_stock");
    }

    if (expiryValue === "") {
        missingFields.push("Expiry Date");
        markInputError("batch_expiry");
    }

    if (costValue === "") {
        missingFields.push("Buying Price");
        markInputError("batch_cost");
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
        markInputError("batch_stock");

        showMessageModal(
            "error",
            "Invalid Stock",
            "Stock Quantity must be greater than 0."
        );

        return;
    }

    if (isNaN(newCost) || newCost <= 0) {
        markInputError("batch_cost");

        showMessageModal(
            "error",
            "Invalid Buying Price",
            "Buying Price must be greater than 0."
        );

        return;
    }

    const med = supplies[currentBatchMedicineIndex];

    const newSelling = calculateSellingPrice(newCost);

    autoSellingInput.value = newSelling;

    addBatchToMedicine(med, newStock, expiryValue, newCost);
    addInventoryHistoryEntry(med.name, med.category, newStock, expiryValue, newCost);

    saveInventoryData();

    displayTable(supplies);

    updateSummaryCards();

    closeAddBatchModal();

    showMessageModal(
        "success",
        "Batch Added Successfully",
        "The new stock was added under the same medicine."
    );
}

/* DETAILS MODAL */

function openDetailsModal(index) {
    const med = supplies[index];

    const detailsBody = document.getElementById("batch_details_body");

    document.getElementById("details_medicine_name").textContent = med.name;
    document.getElementById("details_total_stock").textContent = getTotalStock(med);

    detailsBody.innerHTML = "";

    sortBatchesByExpiry(med);

    med.batches.forEach(function (batch, batchIndex) {

        const expired = isExpiredDate(batch.expiryDate);

        const statusText = expired ? "Expired" : "Valid";
        const statusClass = expired ? "expired_status" : "valid_status";

        const batchCost = Number(batch.costPrice) || Number(med.costPrice) || 0;
        const batchSelling = batch.sellingPrice || calculateSellingPrice(batchCost);

        let highestPriceLabel = "";

        if (batchCost === Number(med.costPrice)) {
            highestPriceLabel = `<span class="highest_price_status">Used for selling</span>`;
        }

        detailsBody.innerHTML += `
            <tr>
                <td>Batch ${batchIndex + 1}</td>
                <td>${batch.stock}</td>
                <td>${batch.expiryDate}</td>
                <td>${batchCost} EGP ${highestPriceLabel}</td>
                <td>${batchSelling} EGP</td>
                <td>
                    <span class="${statusClass}">
                        ${statusText}
                    </span>
                </td>
            </tr>
        `;
    });

    document.getElementById("details_modal").style.display = "flex";
}

function closeDetailsModal() {
    document.getElementById("details_modal").style.display = "none";
}

/* DELETE MEDICINE STOCK - ADMIN ONLY */

function deleteExpiredMedicine(index) {
    if (!isAdmin) {
        showMessageModal(
            "error",
            "Access Denied",
            "Only admin can delete medicine stock."
        );

        return;
    }

    currentDeleteMedicineIndex = index;
    const med = supplies[index];

    if (hasAnyExpiredBatch(med)) {
        const removedCount = removeExpiredBatchesFromMedicine(med);

        if (!Array.isArray(med.batches) || getTotalStock(med) === 0) {
            supplies.splice(index, 1);
        } else {
            consolidateBatches(med);
            updateMedicineHighestPrice(med);
        }

        saveInventoryData();
        displayTable(supplies);
        updateSummaryCards();

        showMessageModal(
            "success",
            "Expired Stock Removed",
            removedCount > 0
                ? removedCount + " expired unit(s) were removed from " + med.name + "."
                : "Expired stock was removed from " + med.name + "."
        );

        return;
    }

    const totalStock = getTotalStock(med);

    document.getElementById("delete_medicine_name").textContent = med.name;
    document.getElementById("delete_total_stock").textContent = totalStock;
    document.getElementById("delete_quantity").value = "";
    document.getElementById("delete_batch_container").style.display = Array.isArray(med.batches) && med.batches.length > 0 ? "block" : "none";

    populateDeleteBatchSelect(med);
    updateDeleteBatchStockInfo();

    document.getElementById("delete_modal").style.display = "flex";
}

function closeDeleteModal() {
    document.getElementById("delete_modal").style.display = "none";
}

function removeExpiredBatchesFromMedicine(med) {
    let removed = 0;

    if (!Array.isArray(med.batches) || med.batches.length === 0) {
        if (isExpiredDate(med.expiryDate)) {
            removed = Number(med.stock) || 0;
            med.stock = 0;
        }
        return removed;
    }

    const remainingBatches = [];

    med.batches.forEach(function (batch) {
        const batchStock = Number(batch.stock) || 0;
        if (isExpiredDate(batch.expiryDate)) {
            removed += batchStock;
        } else {
            remainingBatches.push(batch);
        }
    });

    med.batches = remainingBatches;
    return removed;
}

function populateDeleteBatchSelect(med) {
    const batchSelect = document.getElementById("delete_batch_select");
    batchSelect.innerHTML = "";

    if (!Array.isArray(med.batches) || med.batches.length === 0) {
        batchSelect.disabled = true;
        return;
    }

    med.batches.forEach(function (batch, batchIndex) {
        const batchStock = Number(batch.stock) || 0;
        const expiry = batch.expiryDate || "No expiry";
        const cost = Number(batch.costPrice) || Number(med.costPrice) || 0;
        const label = `Batch ${batchIndex + 1} — ${batchStock} unit(s) — ${expiry} — ${cost} EGP`;

        const option = document.createElement("option");
        option.value = batchIndex;
        option.textContent = label;
        batchSelect.appendChild(option);
    });

    batchSelect.disabled = false;
}

function updateDeleteBatchStockInfo() {
    const med = supplies[currentDeleteMedicineIndex];
    const batchSelect = document.getElementById("delete_batch_select");
    const batchInfo = document.getElementById("delete_batch_info");

    if (!med || !Array.isArray(med.batches) || med.batches.length === 0) {
        batchInfo.textContent = "";
        return;
    }

    const batchIndex = parseInt(batchSelect.value, 10);
    const batch = med.batches[batchIndex];

    if (!batch) {
        batchInfo.textContent = "";
        return;
    }

    batchInfo.textContent = "Selected batch has " + (Number(batch.stock) || 0) + " unit(s).";
}

function removeQuantityFromBatch(med, batchIndex, quantityToRemove) {
    if (!Array.isArray(med.batches) || med.batches.length === 0) {
        med.stock = Math.max(0, (Number(med.stock) || 0) - quantityToRemove);
        return;
    }

    const batch = med.batches[batchIndex];
    if (!batch) {
        return;
    }

    const batchStock = Number(batch.stock) || 0;
    if (quantityToRemove >= batchStock) {
        med.batches.splice(batchIndex, 1);
    } else {
        batch.stock = batchStock - quantityToRemove;
    }
}

function removeStockFromMedicine(med, quantityToRemove) {
    let remaining = quantityToRemove;

    if (!Array.isArray(med.batches) || med.batches.length === 0) {
        med.stock = Math.max(0, (Number(med.stock) || 0) - remaining);
        return;
    }

    med.batches.sort(function (a, b) {
        const expiryA = new Date(a.expiryDate).getTime() || 0;
        const expiryB = new Date(b.expiryDate).getTime() || 0;
        return expiryA - expiryB || (Number(a.addedAt) - Number(b.addedAt));
    });

    med.batches = med.batches.reduce(function (acc, batch) {
        if (remaining <= 0) {
            acc.push(batch);
            return acc;
        }

        const batchStock = Number(batch.stock) || 0;

        if (batchStock <= remaining) {
            remaining -= batchStock;
            return acc;
        }

        batch.stock = batchStock - remaining;
        remaining = 0;
        acc.push(batch);
        return acc;
    }, []);
}

function processDeleteMedicine() {
    clearInputErrors();

    const quantityInput = document.getElementById("delete_quantity");
    const quantityValue = quantityInput.value.trim();

    if (quantityValue === "") {
        markInputError("delete_quantity");

        showMessageModal(
            "error",
            "Missing Required Field",
            "Quantity to remove is required."
        );

        return;
    }

    const quantity = parseInt(quantityValue, 10);
    const med = supplies[currentDeleteMedicineIndex];

    if (!med) {
        showMessageModal(
            "error",
            "Invalid Medicine",
            "Selected medicine could not be found."
        );

        return;
    }

    const batchSelect = document.getElementById("delete_batch_select");
    const hasBatchSelection = !batchSelect.disabled && batchSelect.options.length > 0;
    const selectedBatchIndex = hasBatchSelection ? parseInt(batchSelect.value, 10) : -1;

    const selectedStock = hasBatchSelection && med.batches && med.batches[selectedBatchIndex]
        ? Number(med.batches[selectedBatchIndex].stock) || 0
        : getTotalStock(med);

    if (isNaN(quantity) || quantity <= 0 || quantity > selectedStock) {
        markInputError("delete_quantity");

        showMessageModal(
            "error",
            "Invalid Quantity",
            "Enter a quantity between 1 and " + selectedStock + "."
        );

        return;
    }

    const medicineName = med.name;
    const removeAllFromBatch = hasBatchSelection && quantity === selectedStock;
    const removeAll = !hasBatchSelection && quantity === getTotalStock(med);

    if (hasBatchSelection) {
        removeQuantityFromBatch(med, selectedBatchIndex, quantity);
    } else {
        removeStockFromMedicine(med, quantity);
    }

    if (!Array.isArray(med.batches) || getTotalStock(med) === 0) {
        supplies.splice(currentDeleteMedicineIndex, 1);
    } else {
        consolidateBatches(med);
        updateMedicineHighestPrice(med);
    }

    saveInventoryData();
    displayTable(supplies);
    updateSummaryCards();
    closeDeleteModal();

    showMessageModal(
        "success",
        "Stock Removed",
        quantity + " unit(s) removed from " + medicineName + " stock."
    );
}

/* IMPORT FROM EXCEL */

function importExcel() {
    const file = document.getElementById("excel-import").files[0];

    if (!file) {
        return;
    }

    const reader = new FileReader();

    reader.onload = function (e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(sheet, { raw: false });

        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];

            const name = row["Name"] || "Unknown";
            const cat = row["Category"] || "Supplies";
            const cost = parseFloat(row["Cost Price"]) || 0;
            const stock = parseInt(row["Stock"]) || 0;
            const minStock = parseInt(row["Min Stock"]) || 10;
            const expiry = row["Expiry Date"] || "2030-01-01";

            let refundable = "Non-Refundable";

            if (
                row["Refundable"] === true ||
                row["Refundable"] === "true" ||
                row["Refundable"] === "Refundable" ||
                row["Refundable"] === "Yes"
            ) {
                refundable = "Refundable";
            }

            if (cost <= 0 || stock <= 0) {
                continue;
            }

            const existing = supplies.find(function (med) {
                return normalizeName(med.name) === normalizeName(name);
            });

            if (existing) {
                addBatchToMedicine(existing, stock, expiry, cost);
                addInventoryHistoryEntry(existing.name, existing.category, stock, expiry, cost);
            } else {
                const newMedicine = {
                    name: name,
                    category: cat,
                    costPrice: cost,
                    sellingPrice: calculateSellingPrice(cost),
                    stock: 0,
                    minStock: minStock,
                    expiryDate: "",
                    refundable: refundable,
                    batches: []
                };

                addBatchToMedicine(newMedicine, stock, expiry, cost);
                supplies.push(newMedicine);
                addInventoryHistoryEntry(name, cat, stock, expiry, cost);
            }
        }

        saveInventoryData();

        displayTable(supplies);

        updateSummaryCards();

        showMessageModal(
            "success",
            "Import Complete",
            "Medicines imported successfully from Excel."
        );

        document.getElementById("excel-import").value = "";
    };

    reader.readAsArrayBuffer(file);
}

/* PAGE LOAD */

window.onload = function () {
    loadInventoryData();

    updateSummaryCards();

    displayTable(supplies);

    setupInputErrorClearing();

    setupAutoSellingPriceCalculation();

    preventNegativeNumbers();
};

function importExcel() {
    let file = document.getElementById("excel-import").files[0];
    let reader = new FileReader();
    reader.onload = function(e) {
        let data = new Uint8Array(e.target.result);
        let workbook = XLSX.read(data, { type: "array" });
        let sheet = workbook.Sheets[workbook.SheetNames[0]];
        let rows = XLSX.utils.sheet_to_json(sheet, { raw: false });

        for (let i = 0; i < rows.length; i++) {
            let row = rows[i];
            let name = row["Name"] || "Unknown";
            let cat = row["Category"] || "General";
            let cost = parseFloat(row["Cost Price"]) || 0;
            let stock = parseInt(row["Stock"]) || 0;
            let minStock = parseInt(row["Min Stock"]) || 10;
            let expiry = row["Expiry Date"] || "2030-01-01";
            let refundable = row["Refundable"] === "true" ? "Refundable" : "Non-Refundable";

            let existing = supplies.find(function(med) {
                return normalizeName(med.name) === normalizeName(name);
            });

            if (existing) {
                addBatchToMedicine(existing, stock, expiry, cost);
            } else {
                let newMedicine = {
                    name: name,
                    category: cat,
                    costPrice: cost,
                    sellingPrice: calculateSellingPrice(cost),
                    stock: 0,
                    minStock: minStock,
                    expiryDate: "",
                    refundable: refundable,
                    batches: []
                };
                addBatchToMedicine(newMedicine, stock, expiry, cost);
                supplies.push(newMedicine);
            }
        }

        saveInventoryData();
        displayTable(supplies);
        updateSummaryCards();
        alert("Medicines imported successfully!");
    };
    reader.readAsArrayBuffer(file);
}
function exportExcel() {
    let rows = [];
    for (let i = 0; i < supplies.length; i++) {
        let med = supplies[i];
        if (Array.isArray(med.batches) && med.batches.length > 0) {
            for (let j = 0; j < med.batches.length; j++) {
                let batch = med.batches[j];
                rows.push({
                    "Name": med.name,
                    "Category": med.category,
                    "Cost Price": batch.costPrice,
                    "Stock": batch.stock,
                    "Min Stock": med.minStock,
                    "Expiry Date": batch.expiryDate,
                    "Refundable": med.refundable === "Refundable" ? "true" : "false"
                });
            }
        } else {
            rows.push({
                "Name": med.name,
                "Category": med.category,
                "Cost Price": med.costPrice,
                "Stock": med.stock,
                "Min Stock": med.minStock,
                "Expiry Date": med.expiryDate,
                "Refundable": med.refundable === "Refundable" ? "true" : "false"
            });
        }
    }

    let worksheet = XLSX.utils.json_to_sheet(rows);
    let workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Inventory");
    XLSX.writeFile(workbook, "pharmacy_inventory.xlsx");
}
