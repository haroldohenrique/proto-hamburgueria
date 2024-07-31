const menu = document.getElementById("menu")
const cartBtn = document.getElementById("cart-btn")
const cartModal = document.getElementById("cart-modal")
const cartItemsContainer = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const checkoutBtn = document.getElementById("checkout-btn")
const closeModalBtn = document.getElementById("close-modal-btn")
const cartCount = document.getElementById("cart-count")
const addressInput = document.getElementById("address")
const addressWarn = document.getElementById("address-warn")

let cart = [];

cartBtn.addEventListener("click", () => {
    updateCartModal();
    cartModal.style.display = "flex"
})

cartModal.addEventListener("click", (event) => {
    if (event.target === cartModal) {
        cartModal.style.display = "none"
    }
})


closeModalBtn.addEventListener("click", () => {
    cartModal.style.display = "none"
})

menu.addEventListener("click", (event) => {
    let parentButton = event.target.closest(".add-to-cart-btn")
    if (parentButton) {
        const nome = parentButton.getAttribute("data-name")
        const preco = parseFloat(parentButton.getAttribute("data-price"))
        addToCart(nome, preco)
    }
})



//adicionando no carrinho

function addToCart(nome, preco) {
    const existingItem = cart.find(item => item.nome === nome)
    if (existingItem) {
        existingItem.quantity += 1
    } else {
        cart.push({
            nome,
            preco,
            quantity: 1,
        })

    }
    updateCartModal()
}


function updateCartModal() {
    cartItemsContainer.innerHTML = "";
    let total = 0;
    let quantidade = 0;
    cart.forEach(elem => {
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col")
        cartItemElement.innerHTML = `
            <div class="flex items-center justify-between">
                <div>
                    <p class="font-medium">${elem.nome}</p>
                    <p>Qtd: ${elem.quantity}</p>
                    <p class="font-medium mt-2">R$${elem.preco.toFixed(2)}</p>
                </div>



                <button class="remove-from-cart-btn" data-name="${elem.nome}">
                    Remover
                </button>


            </div>
        `
        total += elem.preco * elem.quantity;
        quantidade += elem.quantity

        cartItemsContainer.appendChild(cartItemElement)
    })

    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

    cartCount.textContent = quantidade;
}

cartItemsContainer.addEventListener("click", (event) => {
    if (event.target.classList.contains("remove-from-cart-btn")) {
        const nome = event.target.getAttribute("data-name");
        removeCartItem(nome);
    }
})

function removeCartItem(nome) {
    const index = cart.findIndex(elem => elem.nome === nome);
    if (index !== -1) {
        const item = cart[index]

        if (item.quantity > 1) {
            item.quantity -= 1;
            updateCartModal();
            return;
        }
        cart.splice(index, 1);
        updateCartModal();
    }
}



addressInput.addEventListener("input", (event) => {
    let inputValue = event.target.value;

    if (inputValue !== "") {
        addressInput.classList.remove('border-red-500')
        addressWarn.classList.add("hidden")
    }
})



checkoutBtn.addEventListener("click", () => {
    const isOpen = checkRestaurantOpen();
    if(!isOpen){
        Toastify({
            text: "Ops! Restaurate fechado no momento!",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
                background: "#ef4444",
            },
        }).showToast();


        return;
    }




    if (cart.length === 0) return;

    if (addressInput.value === "") {
        addressInput.classList.add("border-red-500")
        addressWarn.classList.remove("hidden")
        return;
    }


    //enviando para a api do wpp    

    const cartItems = cart.map((item)=>{
        return(
            ` ${item.nome} Quantidade: (${item.quantity}) Preço: R$${item.preco} |`
        )
    }).join("")
    console.log(cartItems);

    const message = encodeURIComponent(cartItems);
    const phone = "48998314066";

    window.open(`https://wa.me/${phone}?text=${message} Endereço: ${addressInput.value}`, "_blank")

    cart = [];
    updateCartModal();
    addressInput.value = "";


})


//verificar a hora e manipular aquele verde do horario
function checkRestaurantOpen() {
    //gerando a data de hoje
    const data = new Date();
    //gerando a hora atual
    const hora = data.getHours();
    return hora >= 18 && hora < 22;
}

const spanItem = document.getElementById("date-span");
const isOpen = checkRestaurantOpen();

if (isOpen) {
    spanItem.classList.remove("bg-red-500");
    spanItem.classList.add("bg-green-600");
} else {
    spanItem.classList.remove("bg-green-600");
    spanItem.classList.add("bg-red-500");
}