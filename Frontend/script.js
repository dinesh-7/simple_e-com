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

// function placeOrder() {
//     let cartTotal = parseFloat(document.getElementById("cart-total").innerText);
//     if (cartTotal === 0) {
//         alert("Cannot place order with an empty cart. Redirecting to products page.");
//         window.location.href = "products.html";
//     } else {
//         alert("Order placed successfully!");
//         localStorage.removeItem("cart");
//         // window.location.href = "products.html";
//         cart = {};
//         renderCart();
//     }
// }
// async function placeOrder() {
//     let cartTotal = parseFloat(document.getElementById("cart-total").innerText);
//     if (cartTotal === 0) {
//         alert("Cannot place an order with an empty cart. Redirecting to products page.");
//         window.location.href = "products.html";
//         return;
//     }

//     const token = localStorage.getItem("jwtToken"); // Retrieve JWT token

//     if (!token) {
//         alert("You must be logged in to place an order.");
//         window.location.href = "login.html";
//         return;
//     }

//     try {
//         let cart = JSON.parse(localStorage.getItem("cart")) || {};
//         const response = await fetch("http://localhost:3000/orders/place-order", {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//                 "Authorization": `Bearer ${token}`
//             },
//             body: JSON.stringify({ cart, cartTotal })
//         });

//         const data = await response.json();
//         if (response.ok) {
//             alert("Order placed successfully!");
//             localStorage.removeItem("cart");
//             window.location.href = "order-success.html";  // Redirect to confirmation page
//         } else {
//             alert("Error placing order: " + data.message);
//         }
//     } catch (error) {
//         console.error("Order error:", error);
//     }
// }


async function placeOrder() {
    let cartTotal = parseFloat(document.getElementById("cart-total").innerText);
    if (cartTotal === 0) {
        alert("Cannot place order with an empty cart. Redirecting to products page.");
        window.location.href = "products.html";
        return;
    }

    const token = localStorage.getItem("jwtToken"); // Retrieve JWT token from local storage
    if (!token) {
        alert("User not authenticated. Please log in first.");
        window.location.href = "login.html";
        return;
    }

    let cart = JSON.parse(localStorage.getItem("cart")) || {};

    const response = await fetch("http://localhost:3000/orders/place-order", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` // Include JWT token
        },
        body: JSON.stringify({ cart, totalAmount: cartTotal })
    });

    // Check if the response is OK (status 200-299)
    if (!response.ok) {
        let errorText;
        try {
            errorText = await response.text(); // Get error message if JSON parsing fails
        } catch (err) {
            errorText = "Unknown error occurred";
        }
        alert(`Order error: ${errorText}`);
        return;
    }

    let responseData;
    try {
        responseData = await response.json(); // Attempt to parse JSON response
    } catch (err) {
        alert("Order error: Server returned an invalid response.");
        return;
    }

    alert("Order placed successfully!");
    console.log("Order details:", responseData);
    localStorage.removeItem("cart");
    cart = {};
    renderCart();
    window.location.href = "products.html";  // Redirect to confirmation page
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



//login and auth 
document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("login-form");

    if (loginForm) {
        loginForm.addEventListener("submit", async function (e) {
            e.preventDefault();

            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            try {
                const response = await fetch("http://localhost:3000/users/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();
                if (response.ok) {
                    localStorage.setItem("jwtToken", data.token);
                    localStorage.setItem("userRole", data.role);
                    // alert("Login successful!");
                    // Redirect based on role
                    if (data.role === "Admin") {
                        window.location.href = "orders.html";  // Admin goes to orders page
                    } else {
                        window.location.href = "index.html";  // Customer goes to homepage
                    }
                } else {
                    alert(data.message);
                }
            } catch (error) {
                console.error("Login Error:", error);
            }
        });
    }
});



function isTokenExpired(token) {
    if (!token) return true;
    const payload = JSON.parse(atob(token.split(".")[1])); // Decode JWT
    return payload.exp * 1000 < Date.now(); // Check expiry time
}

function checkAuth() {
    const token = localStorage.getItem("jwtToken");
    const userRole = localStorage.getItem("userRole");

    if (!token) {
        console.log("User not authenticated. Redirecting to login.");
        window.location.href = "login.html";
        return;
    }

    // Check if the token has expired
    if (isTokenExpired(token)) {
        console.log("Session expired! Please log in again.");
        localStorage.removeItem("jwtToken");
        localStorage.removeItem("userRole");
        window.location.href = "login.html"; // Redirect to login
        return;
    }

    // Ensure only admins can access orders page
    if (window.location.pathname.includes("orders.html") && userRole !== "Admin") {
        alert("Unauthorized access! Redirecting to home.");
        window.location.href = "index.html";
    }
}


// Only check authentication on protected pages
if (!window.location.href.includes("login.html") && !window.location.href.includes("register.html")) {
    checkAuth();  // Run on page load only if not on login/register
}

//register page 
document.addEventListener("DOMContentLoaded", function () {
    const registerForm = document.getElementById("register-form");

    if (registerForm) {
        registerForm.addEventListener("submit", async function (e) {
            e.preventDefault();

            const customerName = document.getElementById("customerName").value;
            const address = document.getElementById("address").value;
            const mobile = document.getElementById("mobile").value;
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;
            const role = document.getElementById("role").value;

            try {
                const response = await fetch("http://localhost:3000/users/register", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ customerName, address, mobile, email, password, role })
                });

                const data = await response.json();
                if (response.ok) {
                    alert("Registration successful!");
                    window.location.href = "login.html"; // Redirect to login page
                } else {
                    alert(data.message);
                }
            } catch (error) {
                console.error("Registration Error:", error);
            }
        });
    }
});


//profile page in index.html
document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem("jwtToken");
    const loginLink = document.getElementById("login-link");
    const registerLink = document.getElementById("register-link");
    const logoutLink = document.getElementById("logout-link");

    if (token) {
        // User is logged in, hide login/register and show logout
        loginLink.style.display = "none";
        registerLink.style.display = "none";
        logoutLink.style.display = "block";

        // Change profile button text
        document.querySelector(".profile-btn").textContent = "👤 My Account";
    }

    // Logout function
    logoutLink.addEventListener("click", function () {
        localStorage.removeItem("jwtToken");
        alert("Logged out successfully!");
        window.location.reload(); // Reload page to update UI
    });
});



//Fetch and render orders
document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch("http://localhost:3000/orders/orders", {
            method: "GET",
        });

        if (!response.ok) {
            throw new Error("Failed to fetch orders.");
        }

        const orders = await response.json();
        renderOrders(orders);
    } catch (error) {
        console.error("Error fetching orders:", error);
    }
});

function renderOrders(orders) {
    const tableBody = document.getElementById("orders-table-body");
    const cumulativeTotalElement = document.getElementById("cumulative-total");
    let cumulativeTotal = 0;

    tableBody.innerHTML = ""; // Clear existing rows

    orders.forEach(order => {
        const row = document.createElement("tr");

        // Format the items
        let itemsList = "<ul>";
        order.items.forEach(item => {
            itemsList += `<li>${item.name} - ${item.quantity} x Rs${item.price.toFixed(2)} = Rs${item.total.toFixed(2)}</li>`;
        });
        itemsList += "</ul>";

        // **Create action buttons dynamically**
        let actionButtons = "";
        if (order.status === "Pending") {
            actionButtons = `
                <button onclick="updateOrderStatus('${order._id}', 'Completed')">Mark as Completed</button>
                <button onclick="updateOrderStatus('${order._id}', 'Cancelled')" style="background-color: red;">Cancel Order</button>
            `;
        } else {
            actionButtons = `<button disabled>${order.status}</button>`;
        }

        // **Populate row content**
        row.innerHTML = `
            <td>${order.customerName}</td>
            <td>${order.address}</td>
            <td>${order.mobile}</td>
            <td>${itemsList}</td>
            <td>Rs ${order.totalAmount.toFixed(2)}</td>
            <td id="status-${order._id}">${order.status}</td>
            <td>${actionButtons}</td>
        `;

        tableBody.appendChild(row);
        cumulativeTotal += order.totalAmount;
    });

    cumulativeTotalElement.innerText = cumulativeTotal.toFixed(2);
}

async function updateOrderStatus(orderId, status) {
    console.log(orderId, status);
    try {
        const response = await fetch(`http://localhost:3000/orders/${orderId}/status`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" }, //this is important and need to be mentioned otherwise it will not know what type of data is being sent
            body: JSON.stringify({ status })  // Sending status dynamically
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to update order status: ${errorText}`);
        }

        // Update the UI
        document.getElementById(`status-${orderId}`).innerText = status;
        const completeButton = document.querySelector(`button[onclick="updateOrderStatus('${orderId}', 'Completed')"]`);
        const cancelButton = document.querySelector(`button[onclick="updateOrderStatus('${orderId}', 'Cancelled')"]`);

        if (completeButton) completeButton.disabled = true;
        if (cancelButton) cancelButton.disabled = true;

        // alert(`Order marked as ${status} successfully!`);
    } catch (error) {
        console.error("Error updating order status:", error);
    }
}



