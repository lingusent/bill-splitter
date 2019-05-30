// Everything else on this line is a comment
/*
Everything between the symbol above and the symbol below is a comment.
*/

/*
Actions:
- Add a receipt item
- Remove a receipt item
- Add a guest
- Remove a guest
- Adding a guest to a receipt item
- Removing a guest from a receipt item
- Set a tax rate
- Set a tip rate
- Edit receipt item name
- Edit receipt item amount
- Edit guest name

Calculations:
- Receipt subtotal
- Receipt tax
- Receipt tip
- Receipt total
- Guest portion of receipt item
- Guest subtotal
- Guest tax
- Guest tip
- Guest total
*/

const receiptBody = document.querySelector('.receipt_body');
const newItemRow = document.querySelector('.receipt_new-item-row');
const descriptionNode = newItemRow.querySelector('.receipt_new-item-description');
const amountNode = newItemRow.querySelector('.receipt_new-item-amount');

const receiptSubtotalValue = document.querySelector('.receipt_subtotal-value');
const receiptTaxValue = document.querySelector('.receipt_tax-value');
const receiptTipValue = document.querySelector('.receipt_tip-value');
const receiptTotalValue = document.querySelector('.receipt_total-value');

const receiptTaxRateInput = document.querySelector('.receipt_tax-rate');
const receiptTipRateInput = document.querySelector('.receipt_tip-rate');

let receiptSubtotal = 0;
let receiptTaxAmount = 0;
let receiptTipAmount = 0;

let receiptTaxRate = 0.0925;
let receiptTipRate = 0.20;

receiptTaxRateInput.value = receiptTaxRate * 100;
receiptTipRateInput.value = receiptTipRate * 100;

let receiptItems = {};
let lastReceiptItemId = 0; 


const guestsBody = document.querySelector('.guests_body');
const guestsNewItemRow = document.querySelector('.guests_new-item-row');

const guest1SubtotalValue = document.querySelector('.guest1_subtotal-value');
const guest1TaxValue = document.querySelector('.guest1_tax-value');
const guest1TipValue = document.querySelector('.guest1_tip-value');
const guest1TotalValue = document.querySelector('.guest1_total-value');

let guest1Subtotal = 0;
let guest1TaxAmount = 0;
let guest1TipAmount = 0;
let lastGuestId = 1;

function createReceiptItemRowNode(description, amount) {
    const newRow = document.createElement('tr');
    
    const descriptionCell = document.createElement('td');
    descriptionCell.innerText = description;
    newRow.append(descriptionCell);
    
    const amountCell = document.createElement('td');
    amountCell.innerText = amount.toFixed(2);
    amountCell.className += " value";
    newRow.append(amountCell);

    return newRow;
}

function createGuestsRowNode(itemId, guestId) {
    const newRow = document.createElement('tr');
    
    for (step = 1; step <= guestId; step++) {
        const newCell = document.createElement('td');
    
        newRow.append(newCell);

        const checkBox = document.createElement("input");
        checkBox.setAttribute("type", "checkbox");
        checkBox.className += " guests-checkbox";
        
        checkBox.setAttribute("data-guest_id", step);
        checkBox.setAttribute("data-item_id", itemId);
        newCell.append(checkBox);
    }

    return newRow;
}

let newReceiptItemButton = document.querySelector('.receipt_new-item-add_button');
newReceiptItemButton.addEventListener('click', (e) => {
    lastReceiptItemId++; 
    
    let newReceiptItem = {
        description: descriptionNode.value,
        cost: 0,
        guestIds: [] 
    };

    if (amountNode.value == '') {
        newReceiptItem['cost'] = 0;
    } else {
        newReceiptItem['cost'] = parseFloat(amountNode.value);
    }

    receiptItems[lastReceiptItemId] = newReceiptItem;

    const receiptItemRow = createReceiptItemRowNode(newReceiptItem.description, newReceiptItem.cost);
    receiptBody.insertBefore(receiptItemRow, newItemRow);
    
    //console.log(receiptItems[lastReceiptItemId].description + ": " + receiptItems[lastReceiptItemId].cost);
    
    receiptSubtotal = receiptSubtotal + receiptItems[lastReceiptItemId].cost;
    receiptSubtotalValue.innerText = receiptSubtotal.toFixed(2);

    calcTotals();
    
    guestsBody.insertBefore(createGuestsRowNode(lastReceiptItemId, lastGuestId), guestsNewItemRow);

});

receiptTaxRateInput.addEventListener('input', (e) => {
    receiptTaxRate = receiptTaxRateInput.value / 100;
    calcTotals();
});

receiptTipRateInput.addEventListener('input', (e) => {
    receiptTipRate = receiptTipRateInput.value / 100;
    calcTotals();
});


let guestsCheckbox = document.querySelector('.guests_body');
guestsCheckbox.addEventListener('click', (e) => {
    if (e.target.type == "checkbox") {
        
        // console.log(e.target);
        //console.log(e.target.type);
        if (e.target.checked) {
            //console.log("Checkbox id:" + e.target.id + " checked.");

            guest1Subtotal = guest1Subtotal + receiptItems[e.target.dataset.item_id].cost;
            guest1SubtotalValue.innerText = guest1Subtotal.toFixed(2);
            calcGuest1Totals()
            
        } else {
            //console.log("Checkbox id:" + e.target.id + " unchecked.");

            guest1Subtotal = guest1Subtotal - receiptItems[e.target.dataset.item_id].cost;
            guest1SubtotalValue.innerText = guest1Subtotal.toFixed(2);
            calcGuest1Totals()
        }
    } 
});

let newGuestButton = document.querySelector('.guests_add-button');
newGuestButton.addEventListener('click', (e) => {  
    lastGuestId++;

    const guestsAddButtonCell = document.querySelector('.guests_add-button-cell');

    const guestsNameRow = document.querySelector('.guests_name-row');
    const newGuestNameCell = document.createElement('td');
    const newGuestNameInput = document.createElement('input');
    newGuestNameInput.setAttribute("type", "text");
    newGuestNameInput.setAttribute("class", "guest" + lastGuestId + "_name-input");
    newGuestNameCell.append(newGuestNameInput);
    guestsNameRow.insertBefore(newGuestNameCell, guestsAddButtonCell);

    createGuestTotalCell("subtotal");
    createGuestTotalCell("tax");
    createGuestTotalCell("tip");
    createGuestTotalCell("total");

});

function createGuestTotalCell(type) {
    const guestsRow = document.querySelector('.guests_' + type + '-row');
    const newGuestCell = document.createElement('td');
    const newGuestValue = document.createElement('span');
    newGuestValue.setAttribute("class", "value guest" + lastGuestId + "_" + type + "-value");
    newGuestValue.innerText = "0.00";
    newGuestCell.append(newGuestValue);
    guestsRow.append(newGuestCell);
}

function calcTotals() {
    receiptTaxAmount = calcTaxAmount(receiptSubtotal, receiptTaxRate);
    receiptTaxValue.innerText = receiptTaxAmount.toFixed(2);

    receiptTipAmount = calcTipAmount(receiptSubtotal, receiptTaxAmount, receiptTipRate);
    receiptTipValue.innerText = receiptTipAmount.toFixed(2);

    receiptTotalValue.innerText = (receiptSubtotal + receiptTaxAmount + receiptTipAmount).toFixed(2);
}

function calcGuest1Totals() {
    guest1TaxAmount = calcTaxAmount(guest1Subtotal, receiptTaxRate);
    guest1TaxValue.innerText = guest1TaxAmount.toFixed(2);

    guest1TipAmount = calcTipAmount(guest1Subtotal, guest1TaxAmount, receiptTipRate);
    guest1TipValue.innerText = guest1TipAmount.toFixed(2);

    guest1TotalValue.innerText = (guest1Subtotal + guest1TaxAmount + guest1TipAmount).toFixed(2);
}

function calcTaxAmount(subtotal, taxrate) {
    return formatNumberForCurrency(subtotal * taxrate);
}

function calcTipAmount(subtotal, taxAmount, tiprate) {
    return formatNumberForCurrency((subtotal + taxAmount) * tiprate);
}

function formatNumberForCurrency(amount) {
    return Math.round(amount * 100) / 100;
}