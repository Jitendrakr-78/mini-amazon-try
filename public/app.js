// Global Configuration
//const API_URL = "https://your-backend-render-url.onrender.com/api";
const API_URL = "https://mini-amazon-1vlq.onrender.com";

const token = localStorage.getItem('token');
const role = localStorage.getItem('role');

// 1. HOME PAGE LOGIC (Product Catalog & Search)
async function loadProducts() {
    const productGrid = document.getElementById('product-list');
    if (!productGrid) return; // Agar index.html par nahi hain toh skip karein

    productGrid.innerHTML = `<div style="grid-column: 1/-1; text-align:center; padding:50px;"><h3>Loading Products...</h3></div>`;
    
    try {
        const search = document.getElementById('search')?.value || '';
        const res = await fetch(`${API_URL}/products?search=${search}`);
        const products = await res.json();
        
        if (products.length === 0) {
            productGrid.innerHTML = `<p style="grid-column:1/-1; text-align:center;">No products found.</p>`;
            return;
        }

        let html = '';
        products.forEach(p => {
            html += `
                <div class="product-card">
                    <img src="${p.image_url || 'https://via.placeholder.com/150'}" alt="${p.title}">
                    <h3>${p.title}</h3>
                    <p>${p.description}</p>
                    <p><strong>$${p.price}</strong></p>
                    <button onclick="addToCart(${p.id})">Add to Cart</button>
                </div>`;
        });
        productGrid.innerHTML = html;
    } catch (err) {
        productGrid.innerHTML = `<p style="grid-column:1/-1; text-align:center; color:red;">Failed to load products.</p>`;
    }
}

async function addToCart(productId) {
    if (!token) return alert('Please login first!');

    try {
        const res = await fetch(`${API_URL}/cart`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ product_id: productId, quantity: 1 })
        });
        const data = await res.json();
        alert(data.message);
    } catch (err) { alert("Error adding to cart"); }
}

// 2. CART PAGE LOGIC
async function loadCart() {
    const cartDiv = document.getElementById('cart-items');
    if (!cartDiv) return;

    if (!token) {
        cartDiv.innerHTML = "Please login to see your cart.";
        return;
    }

    try {
        const res = await fetch(`${API_URL}/cart`, { headers: { 'Authorization': `Bearer ${token}` } });
        const items = await res.json();
        
        let html = '';
        items.forEach(i => {
            html += `<div class="cart-item"><p>${i.title} - $${i.price} x ${i.quantity}</p></div>`;
        });
        cartDiv.innerHTML = html || "<p>Cart is Empty</p>";
    } catch (err) { cartDiv.innerHTML = "Error loading cart."; }
}

async function checkout() {
    try {
        const res = await fetch(`${API_URL}/cart/checkout`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        alert(data.message);
        loadCart();
    } catch (err) { alert("Checkout failed"); }
}

// 3. NAVBAR AUTH STATE CHECK
function checkAuthState() {
    const authLink = document.getElementById('auth-link');
    if (authLink && token) {
        authLink.innerText = "Logout";
        authLink.href = "#";
        authLink.onclick = () => { localStorage.clear(); location.reload(); };
    }
}

// Run functions automatically based on page elements
document.addEventListener("DOMContentLoaded", () => {
    checkAuthState();
    if (document.getElementById('product-list')) loadProducts();
    if (document.getElementById('cart-items')) loadCart();
});
