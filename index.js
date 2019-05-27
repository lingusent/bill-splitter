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

let newReceiptItemButton = document.querySelector('.receipt_new-item-add_button');
newReceiptItemButton.addEventListener('click', (e) => {
    const receiptItemRow = createReceiptItemRowNode(descriptionNode.value, parseFloat(amountNode.value));
    receiptBody.insertBefore(receiptItemRow, newItemRow);
});

function calcTaxAmount(subtotal, taxrate) {
    let taxAmount = (Math.round( (subtotal * taxrate) * 100 ) / 100).toFixed(2);
    
    let taxAmountUnrounded = subtotal * taxrate;
    console.log("Subtotal: " + subtotal);
    console.log("Tax Rate: " + taxrate);
    console.log("Tax Amount(Unrounded): " + taxAmountUnrounded);
    console.log("Tax Amount(Rounded): " + taxAmount);

    return taxAmount;
}

console.log(calcTaxAmount(14.00, 0.0925));