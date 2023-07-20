const deleteProductButtonElements = document.querySelectorAll('.product-item button');

async function deleteProduct(event){
    // console.log("Error");
    const buttonElement = event.target;
    const productId = buttonElement.dataset.productid;
    const csrfToken = buttonElement.dataset.csrf;

    // fetch(`/admin/products/${productId}?_csrf=${csrfToken}`, {
    //     method: 'DELETE',
    // });
    const response = await fetch('/admin/products/' + productId + '?_csrf=' + csrfToken, {
        method: 'DELETE'
    });

    if(!response.ok){
        // const error = await response.json();
        alert('Something went wrong!');
        return;
    }

    buttonElement.parentElement.parentElement.parentElement.parentElement.remove(); //removes the product item from the product list

}

for(const deleteProductButtonElement of deleteProductButtonElements){
    // alert("Errorrrrrrr");
    deleteProductButtonElement.addEventListener('click', deleteProduct);
}