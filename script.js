let cart = JSON.parse(localStorage.getItem("cart")) || {};

// Function to update the cart
function updateCart(item, change, price) {
    if (!cart[item]) {
        cart[item] = { quantity: 0, price: price };
    }
    cart[item].quantity = Math.max(0, cart[item].quantity + change);
    
    localStorage.setItem("cart", JSON.stringify(cart));
    
    // Update the product quantity on the product page
    let quantityElement = document.getElementById(item + "-count");
    if (quantityElement) {
        quantityElement.innerText = cart[item].quantity;
    }
    
    renderCart();
}

// Function to render cart data on cart page
function renderCart() {
    let cartItems = document.getElementById("cart-items");
    let cartTotal = document.getElementById("cart-total");

    if (!cartItems || !cartTotal) return; // Avoid errors if on products.html

    cartItems.innerHTML = "";
    let total = 0;

    for (let item in cart) {
        if (cart[item].quantity > 0) {
            let li = document.createElement("li");
            li.innerHTML = `${item} - ${cart[item].quantity} x Rs${cart[item].price.toFixed(2)} = Rs${(cart[item].quantity * cart[item].price).toFixed(2)}`;
            cartItems.appendChild(li);
            total += cart[item].quantity * cart[item].price;
        }
    }
    cartTotal.innerText = total.toFixed(2);
}

// Function to place order and reset cart
// function placeOrder() {
//     alert("Order placed successfully!");
//     localStorage.removeItem("cart");
    // cart = {};
    // renderCart();
// }

function placeOrder() {
    let cartTotal = parseFloat(document.getElementById("cart-total").innerText);
    if (cartTotal === 0) {
        alert("Cannot place order with an empty cart. Redirecting to products page.");
        window.location.href = "products.html";
    } else {
        alert("Order placed successfully!");
        localStorage.removeItem("cart");
        // window.location.href = "products.html";
        cart = {};
        renderCart();
    }
}

// Ensure cart data persists when navigating between pages
document.addEventListener("DOMContentLoaded", () => {
    renderCart();
    for (let item in cart) {
        let quantityElement = document.getElementById(item + "-count");
        if (quantityElement) {
            quantityElement.innerText = cart[item].quantity;
        }
    }
});

document.addEventListener("DOMContentLoaded", function () {
    let quotes = document.querySelectorAll(".quote-slider div");
    let index = 0;

    function showNextQuote() {
        quotes[index].style.display = "none"; // Hide current quote
        index = (index + 1) % quotes.length; // Move to next quote
        quotes[index].style.display = "block"; // Show next quote
    }

    setInterval(showNextQuote, 4000); // Change quote every 4 seconds
});

