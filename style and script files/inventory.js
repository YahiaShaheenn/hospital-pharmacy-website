let supplies = [];

let currentBatchMedicineIndex = -1;

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

function loadInventoryData() {
    const saved = localStorage.getItem("suppliesStock");

    supplies = saved ? JSON.parse(saved) : [];

    migrateOldInventoryData();

    saveInventoryData();
}

function saveInventoryData() {
    localStorage.setItem("suppliesStock", JSON.stringify(supplies));
}

/* 
    Converts old data into the batch system.
    It merges medicines with the same name, category, and refund policy.
    Different buying prices stay inside different batches.
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

                return {
                    stock: Number(batch.stock) || 0,
                    expiryDate: batch.expiryDate,
                    costPrice: batchCost,
                    sellingPrice: batch.sellingPrice || calculateSellingPrice(batchCost)
                };

            });

        } else {

            medicineBatches.push({
                stock: Number(med.stock) || 0,
                expiryDate: med.expiryDate,
                costPrice: medicineCost,
                sellingPrice: calculateSellingPrice(medicineCost)
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
                        Number(batch.costPrice) || medicineCost
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
                        Number(batch.costPrice) || medicineCost
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

function hasExpiredBatch(med) {
    if (!Array.isArray(med.batches)) {
        return isExpiredDate(med.expiryDate);
    }

    return med.batches.some(function (batch) {
        return isExpiredDate(batch.expiryDate);
    });
}

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

    const sortedBatches = [...validBatches].sort(function (a, b) {
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

        const existingBatch = mergedBatches.find(function (item) {
            return item.expiryDate === batch.expiryDate &&
                Number(item.costPrice) === batchCost;
        });

        if (existingBatch) {
            existingBatch.stock = Number(existingBatch.stock) + Number(batch.stock);
        } else {
            mergedBatches.push({
                stock: Number(batch.stock) || 0,
                expiryDate: batch.expiryDate,
                costPrice: batchCost,
                sellingPrice: calculateSellingPrice(batchCost)
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

function addBatchToMedicine(med, stock, expiryDate, costPrice) {
    if (!Array.isArray(med.batches)) {
        med.batches = [];
    }

    const batchCost = Number(costPrice) || Number(med.costPrice) || 0;
    const batchSelling = calculateSellingPrice(batchCost);

    const existingBatch = med.batches.find(function (batch) {
        return batch.expiryDate === expiryDate &&
            Number(batch.costPrice) === batchCost;
    });

    if (existingBatch) {
        existingBatch.stock = Number(existingBatch.stock) + Number(stock);
    } else {
        med.batches.push({
            stock: Number(stock),
            expiryDate: expiryDate,
            costPrice: batchCost,
            sellingPrice: batchSelling
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
        const nearestExpiry = getNearestExpiry(med);

        const isExp = hasExpiredBatch(med);
        const isLow = totalStock <= med.minStock;

        const priceLevels = getDifferentPriceCount(med);

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

                <td>${nearestExpiry}</td>

                <td>
                    <span style="color: #7f8c8d; font-size: 0.85em;">
                        Highest Buy: ${med.costPrice} EGP
                    </span>
                    <br>
                    <strong>Sell: ${med.sellingPrice} EGP</strong>
                </td>

                <td>${refundStatusHTML}</td>

                <td>${statusHTML}</td>

                <td>
                    <button class="btn_batch" onclick="openAddBatchModal(${indexInMain})">
                        Add Batch
                    </button>

                    ${detailsButtonHTML}
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

    document.getElementById("batch_cost").addEventListener("input", function () {
        updateAutoSellingPrice("batch_cost", "batch_auto_selling");
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
            "This medicine already exists, so the new stock was added under the same row. The selling price is based on the highest buying price."
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

    saveInventoryData();

    displayTable(supplies);

    updateSummaryCards();

    closeAddBatchModal();

    showMessageModal(
        "success",
        "Batch Added Successfully",
        "The new stock was added under the same medicine. The selling price is now based on the highest buying price."
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

/* PAGE LOAD */

window.onload = function () {
    loadInventoryData();

    updateSummaryCards();

    displayTable(supplies);

    setupInputErrorClearing();

    setupAutoSellingPriceCalculation();
};