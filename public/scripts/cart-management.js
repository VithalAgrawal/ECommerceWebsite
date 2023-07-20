
const addToCartButtonElement = document.querySelector("#product-details button");
const cartBadgeElements = document.querySelectorAll(".nav-items .badge");

async function addToCart() {
    const productId = addToCartButtonElement.dataset.productid;
    const csrfToken = addToCartButtonElement.dataset.csrf;
    let response;
    try {
        response = await fetch('/cart/items', {
            method: 'POST',
            body: JSON.stringify({
                productId: productId,
                _csrf: csrfToken,
                // quantity: quantity
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        alert('Error adding product to cart!');
        return;
    }

    if (!response.ok) {
        // const errorMessage = await response.text();
        // alert(errorMessage);
        alert('Error adding product to cart!');
        return;
    }

    const responseData = await response.json();

    const newTotalQuantity = responseData.newTotalItems;

    for(const cartBadgeElement of cartBadgeElements){
        cartBadgeElement.textContent = newTotalQuantity;
    }

}

addToCartButtonElement.addEventListener("click", addToCart);