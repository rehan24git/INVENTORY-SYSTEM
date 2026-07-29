// ===============================
// LOGIN CHECK
// ===============================
if (localStorage.getItem("isLoggedIn") !== "true") {
    window.location.href = "login.html";
}

// ===============================
// LOCAL STORAGE
// ===============================
let currentUser = localStorage.getItem("currentUser");

let products = JSON.parse(localStorage.getItem(currentUser + "_products")) || [];
let bill = JSON.parse(localStorage.getItem(currentUser + "_bill")) || [];

// ===============================
// SAVE PRODUCTS
// ===============================
function saveProducts() {
    localStorage.setItem(currentUser + "_products", JSON.stringify(products));
}

// ===============================
// UPDATE DASHBOARD
// ===============================
function updateDashboard() {

    if (document.getElementById("productCount")) {
        document.getElementById("productCount").innerText = products.length;
    }
    if (document.getElementById("lowStock")) {

    let lowProducts = products.filter(p => p.stock <= 5);

    document.getElementById("lowStock").innerText = lowProducts.length;

    let list = document.getElementById("lowStockList");

    if (list) {

        list.innerHTML = "";

        if (lowProducts.length === 0) {

            list.innerHTML = "No Low Stock";

        } else {

            lowProducts.forEach(function(product) {

                list.innerHTML += `
                    <div>${product.name} - ${product.stock} Left</div>
                `;

            });

        }

    }

}
    

    if (document.getElementById("salesCount")) {
        document.getElementById("salesCount").innerText = bill.length;
    }

    if (document.getElementById("revenue")) {

        let revenue = 0;

        bill.forEach(item => {
            revenue += item.total;
        });

        document.getElementById("revenue").innerText = revenue;
    }
}
// ===============================
// LOAD PRODUCTS
// ===============================
function loadProducts() {

    let table = document.getElementById("productTable");
    let select = document.getElementById("billProduct");

    if (table) table.innerHTML = "";
    if (select) select.innerHTML = "";

    products.forEach((product, index) => {

        if (table) {
            table.innerHTML += `
            <tr>
                <td>${index + 1}</td>
                <td>${product.name}</td>
                <td>₹${product.price}</td>
                <td>${product.stock}</td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="editProduct(${index})">
                        Edit
                    </button>

                    <button class="btn btn-danger btn-sm" onclick="deleteProduct(${index})">
                        Delete
                    </button>
                </td>
            </tr>`;
        }

        if (select) {
            select.innerHTML += `
            <option value="${index}">
                ${product.name}
            </option>`;
        }

    });

    updateDashboard();
}
// ===============================
// ADD PRODUCT
// ===============================
function addProduct() {

    let name = document.getElementById("productName").value;
    let price = document.getElementById("productPrice").value;
    let stock = document.getElementById("productStock").value;

    if (name === "" || price === "" || stock === "") {
        alert("Fill all fields");
        return;
    }

    products.push({
        name: name,
        price: Number(price),
        stock: Number(stock)
    });

    saveProducts();
    loadProducts();

    document.getElementById("productName").value = "";
    document.getElementById("productPrice").value = "";
    document.getElementById("productStock").value = "";
}

// ===============================
// DELETE PRODUCT
// ===============================
function deleteProduct(index) {

    if (confirm("Delete Product?")) {
        products.splice(index, 1);
        saveProducts();
        loadProducts();
    }

}

// ===============================
// SEARCH PRODUCT
// ===============================
function searchProduct() {

    let value = document.getElementById("search").value.toLowerCase();

    let rows = document.querySelectorAll("#productTable tr");

    rows.forEach(row => {
        row.style.display = row.innerText.toLowerCase().includes(value)
            ? ""
            : "none";
    });

}

// ===============================
// EDIT PRODUCT
// ===============================
function editProduct(index) {

    let product = products[index];

    let newName = prompt("Product Name", product.name);
    let newPrice = prompt("Price", product.price);
    let newStock = prompt("Stock", product.stock);

    if (newName && newPrice && newStock) {

        products[index] = {
            name: newName,
            price: Number(newPrice),
            stock: Number(newStock)
        };

        saveProducts();
        loadProducts();

        alert("Product Updated Successfully");
    }

}

loadProducts();
// ===============================
// BILLING
// ===============================

function generateBill() {

    if (products.length === 0) {
        alert("Please add a product first.");
        return;
    }

    let productIndex = document.getElementById("billProduct").value;
    let qty = parseInt(document.getElementById("billQty").value);

    if (isNaN(qty) || qty <= 0) {
        alert("Enter valid quantity");
        return;
    }

    let product = products[productIndex];

    if (!product) {
        alert("Please select a product");
        return;
    }

    if (product.stock < qty) {
        alert("Not enough stock!");
        return;
    }

    let total = qty * product.price;

    bill.push({
        name: product.name,
        qty: qty,
        price: product.price,
        total: total
    });

    let sales = JSON.parse(localStorage.getItem(currentUser + "_sales")) || [];

sales.push({
    name: product.name,
    qty: qty,
    price: product.price,
    total: total,
    date: new Date().toLocaleString()
});

localStorage.setItem(currentUser + "_sales", JSON.stringify(sales));
// Save Customer History
let customers = JSON.parse(localStorage.getItem(currentUser + "_customers")) || [];

customers.push({
    name: document.getElementById("customerName").value,
    phone: document.getElementById("customerPhone").value,
    total: total,
    date: new Date().toLocaleString()
});

localStorage.setItem(currentUser + "_customers", JSON.stringify(customers));

    product.stock -= qty;

    localStorage.setItem(currentUser + "_bill", JSON.stringify(bill));
    saveProducts();

    loadProducts();
    showBill();
}

function showBill() {

    let table = document.getElementById("billTable");

    if (!table) return;

    table.innerHTML = "";

    let grandTotal = 0;

    bill.forEach(item => {

        grandTotal += item.total;

        table.innerHTML += `
        <tr>
            <td>${item.name}</td>
            <td>${item.qty}</td>
            <td>₹${item.price}</td>
            <td>₹${item.total}</td>
        </tr>`;
    });

   let gst = grandTotal * 0.18;

let discount = Number(document.getElementById("discount")?.value || 0);

let discountAmount = (grandTotal * discount) / 100;

let finalTotal = grandTotal + gst - discountAmount;

if (document.getElementById("subTotal")) {
    document.getElementById("subTotal").innerText = grandTotal.toFixed(2);
}

if (document.getElementById("gstAmount")) {
    document.getElementById("gstAmount").innerText = gst.toFixed(2);
}

document.getElementById("grandTotal").innerText = finalTotal.toFixed(2);
    updateDashboard();
}

function clearBill() {
    bill = [];
    localStorage.setItem(currentUser + "_bill", JSON.stringify(bill));
    localStorage.removeItem("bill");
    showBill();
}

if (document.getElementById("billTable")) {
    showBill();
}

// ===============================
// SALES HISTORY
// ===============================
function loadSales() {

    let table = document.getElementById("salesTable");

    if (!table) return;

    let sales = JSON.parse(localStorage.getItem(currentUser + "_sales")) || [];

    table.innerHTML = "";

    sales.forEach((item, index) => {

        table.innerHTML += `
        <tr>
            <td>${index + 1}</td>
            <td>${item.name}</td>
            <td>${item.qty}</td>
            <td>₹${item.price}</td>
            <td>₹${item.total}</td>
        </tr>`;
    });

}

loadSales();
loadMonthlySales();
// ===============================
// INVOICE DETAILS
// ===============================

function generateInvoiceDetails() {

    let invoice = "INV-" + Date.now();

    if (document.getElementById("invoiceNo")) {
        document.getElementById("invoiceNo").innerText = invoice;
    }

    if (document.getElementById("invoiceDate")) {
        document.getElementById("invoiceDate").innerText =
            new Date().toLocaleString();
    }
}

generateInvoiceDetails();
if (document.getElementById("discount")) {
    document.getElementById("discount").addEventListener("input", showBill);
}

function downloadPDF() {

    const { jsPDF } = window.jspdf;

    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("CSCORNER COMPUTER STORE", 20, 20);

    doc.setFontSize(12);
    doc.text("Invoice", 20, 35);

    let invoiceNo = document.getElementById("invoiceNo")?.innerText || "";
    let date = document.getElementById("invoiceDate")?.innerText || "";
    let total = document.getElementById("grandTotal")?.innerText || "0";

    doc.text("Invoice No: " + invoiceNo, 20, 45);
    doc.text("Date: " + date, 20, 55);

    doc.text("Grand Total: Rs. " + total, 20, 70);

    doc.save("Invoice.pdf");
}

// =====================
// BUSINESS PROFILE
// =====================

function saveBusinessProfile(){

    localStorage.setItem(currentUser + "_businessName",
        document.getElementById("businessName").value);

    localStorage.setItem(currentUser + "_ownerName",
        document.getElementById("ownerName").value);

    localStorage.setItem(currentUser + "_businessPhone",
        document.getElementById("businessPhone").value);

    localStorage.setItem(currentUser + "_businessEmail",
        document.getElementById("businessEmail").value);

    localStorage.setItem(currentUser + "_businessAddress",
        document.getElementById("businessAddress").value);

    alert("Business Profile Saved Successfully");
    loadBusinessProfile();
window.location.reload();
}
window.onload = function(){

    if(document.getElementById("businessName")){

        document.getElementById("businessName").value =
localStorage.getItem(currentUser + "_businessName") || "";

document.getElementById("ownerName").value =
localStorage.getItem(currentUser + "_ownerName") || "";

document.getElementById("businessEmail").value =
localStorage.getItem(currentUser + "_businessEmail") || "";

document.getElementById("businessAddress").value =
localStorage.getItem(currentUser + "_businessAddress") || "";

document.getElementById("businessPhone").value =
localStorage.getItem(currentUser + "_businessPhone") || "";
    }

}

// =====================
// SHOW BUSINESS DETAILS
// =====================

function loadBusinessProfile() {

    if(document.getElementById("shopName")){
        document.getElementById("shopName").innerText =
        localStorage.getItem(currentUser + "_businessName") || "CSCORNER COMPUTER STORE";
    }

    if(document.getElementById("ownerDisplay")){
        document.getElementById("ownerDisplay").innerText =
       localStorage.getItem(currentUser + "_ownerName")|| "";
    }

    if(document.getElementById("addressDisplay")){
        document.getElementById("addressDisplay").innerText =
        localStorage.getItem(currentUser + "_businessAddress") || "";
    }

    if(document.getElementById("phoneDisplay")){
        document.getElementById("phoneDisplay").innerText =
        localStorage.getItem(currentUser + "_businessPhone") || "";
    }
    // Dashboard Profile
if(document.getElementById("profileBusiness")){
    document.getElementById("profileBusiness").innerText =
    localStorage.getItem(currentUser + "_businessName") || "CSCORNER";
}

if(document.getElementById("profileOwner")){
    document.getElementById("profileOwner").innerText =
    localStorage.getItem(currentUser + "_ownerName") || "Admin";
}

if(document.getElementById("profileBusiness2")){
    document.getElementById("profileBusiness2").innerText =
    localStorage.getItem(currentUser + "_businessName") || "CSCORNER";
}

if(document.getElementById("profileOwner2")){
    document.getElementById("profileOwner2").innerText =
    localStorage.getItem(currentUser + "_ownerName") || "Admin";
}

if(document.getElementById("profilePhone")){
    document.getElementById("profilePhone").innerText =
    localStorage.getItem(currentUser + "_businessPhone") || "";
}

if(document.getElementById("profileEmail")){
    document.getElementById("profileEmail").innerText =
    localStorage.getItem(currentUser + "_businessEmail") || "";
}

if(document.getElementById("profileAddress")){
    document.getElementById("profileAddress").innerText =
    localStorage.getItem(currentUser + "_businessAddress") || "";
}

}

loadBusinessProfile();

function logout() {

    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("currentUser");

    window.location.href = "login.html";

}

function loadMonthlySales() {

    let sales = JSON.parse(localStorage.getItem(currentUser + "_sales")) || [];

    let monthly = {};

    sales.forEach(item => {

        let date = new Date(item.date);

        let month = date.toLocaleString("default", {
            month: "long",
            year: "numeric"
        });

        if (!monthly[month]) {
            monthly[month] = {
                bills: 0,
                revenue: 0
            };
        }

        monthly[month].bills++;
        monthly[month].revenue += Number(item.total);

    });

    let table = document.getElementById("monthlySalesTable");

    if (!table) return;

    table.innerHTML = "";

    for (let month in monthly) {

        table.innerHTML += `
        <tr>
            <td>${month}</td>
            <td>${monthly[month].bills}</td>
            <td>₹ ${monthly[month].revenue}</td>
        </tr>
        `;

    }

}

function exportSalesExcel() {

    let sales = JSON.parse(localStorage.getItem(currentUser + "_sales")) || [];

    if (sales.length === 0) {
        alert("No Sales Data Found!");
        return;
    }

    let excelData = sales.map((item, index) => ({
        "Sr No": index + 1,
        "Product": item.name,
        "Quantity": item.qty,
        "Price": item.price,
        "Total": item.total,
        "Date": item.date
    }));

    let worksheet = XLSX.utils.json_to_sheet(excelData);
    let workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Sales");

    XLSX.writeFile(workbook, "Sales_Report.xlsx");
}

function filterSales() {

    let from = document.getElementById("fromDate").value;
    let to = document.getElementById("toDate").value;

    let sales = JSON.parse(localStorage.getItem(currentUser + "_sales")) || [];

    let table = document.getElementById("salesTable");

    table.innerHTML = "";

    let totalRevenue = 0;

    sales.forEach((sale, index) => {

        let saleDate = new Date(sale.date).toISOString().split("T")[0];

        if (saleDate >= from && saleDate <= to) {

            totalRevenue += Number(sale.total);

            table.innerHTML += `
            <tr>
                <td>${index + 1}</td>
                <td>${sale.name}</td>
                <td>${sale.qty}</td>
                <td>₹ ${sale.price}</td>
                <td>₹ ${sale.total}</td>
                <td>${sale.date}</td>
            </tr>
            `;
        }

    });

    document.getElementById("revenue").innerText = totalRevenue;

}

function loadStock() {

    let table = document.getElementById("stockTable");

    if (!table) return;

    table.innerHTML = "";

    products.forEach((product, index) => {

        let status = product.stock <= 5
            ? "<span class='badge bg-danger'>Low Stock</span>"
            : "<span class='badge bg-success'>Available</span>";

        table.innerHTML += `
        <tr>
            <td>${index + 1}</td>
            <td>${product.name}</td>
            <td>${product.stock}</td>
            <td>${status}</td>
        </tr>
        `;

    });

}
loadStock();

function loadCustomers(){

    let table = document.getElementById("customerTable");

    if(!table) return;

    let customers = JSON.parse(localStorage.getItem(currentUser + "_customers")) || [];

    table.innerHTML = "";

    customers.forEach((customer,index)=>{

        table.innerHTML += `
        <tr>
            <td>${index+1}</td>
            <td>${customer.name}</td>
            <td>${customer.phone}</td>
            <td>₹ ${customer.total}</td>
            <td>${customer.date}</td>
        </tr>`;
    });

}

loadCustomers();