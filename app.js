let iconCart = document.querySelector('.icon-cart');
let closeCart = document.querySelector('.close');
let body = document.querySelector('body');
let listVegetableHTML = document.querySelector('.listVegetable');
let listCartHTML = document.querySelector('.listCart');
// tinh tong so san pham
let iconCartSpan = document.querySelector('.icon-cart span');

let listVegetables = [];
let carts = [];

// ham khi nhan vao thi se them ten class va lan tiep theo se bo
iconCart.addEventListener('click', () => {
    body.classList.toggle('showCart')
})

closeCart.addEventListener('click', () => {
    body.classList.toggle('showCart')
})

// ham lay du lieu tu json

const addDataToHTML = () => {
    listVegetableHTML.innerHTML = '';
    if(listVegetables.length > 0){
        listVegetables.forEach(vegetable => {
            let newVegetable = document.createElement('div');
            newVegetable.classList.add('item');
            newVegetable.dataset.id = vegetable.id;
            // su dung Template literals ``
            newVegetable.innerHTML = `
                <img src="${vegetable.image}" alt="">
                <h2>${vegetable.name}</h2>
                <div class="price">$${vegetable.price}</div>
                <button class="addCart"> 
                    Add To Cart 
                </button>
            `;
            listVegetableHTML.appendChild(newVegetable);
        })
    }
}

listCartHTML.addEventListener('click', (even) => {
    let positionClick = even.target;
    if(positionClick.classList.contains('minus') || positionClick.classList.contains('plus')){
        let vegetable_id  = positionClick.parentElement.parentElement.dataset.id;
        let type = 'minus';
        if(positionClick.classList.contains('plus')){
            type = 'plus';
        }
        chanQuantity(vegetable_id, type);
    }
})

const chanQuantity = (vegetable_id, type) => {
    let positionItemInCart = carts.findIndex((value) => value.vegetable_id == vegetable_id);
    if(positionItemInCart >= 0 ){
        switch (type) {
            case 'plus':
                carts[positionItemInCart].quantity = carts[positionItemInCart].quantity + 1;
                break;
        
            default:
                let valueChange = carts[positionItemInCart].quantity - 1;
                if(valueChange > 0){
                    carts[positionItemInCart].quantity = valueChange;
                } else {
                    carts.splice(positionItemInCart, 1);
                }
            break;
        }
    }
    addCartToMemory();
    addCartToHTML();
}

listVegetableHTML.addEventListener('click', (event) => {
    let positionClick = event.target;
    if(positionClick.classList.contains('addCart')){
        let vegetable_id = positionClick.parentElement.dataset.id;
        addToCart(vegetable_id);
    }
})
// ham xu li khi tang or giam
const addToCart = (vegetable_id) => {
    let positionThisVegetableInCart = carts.findIndex((value) => value.vegetable_id == vegetable_id);
    if(carts.length <= 0){
        carts = [{
            vegetable_id: vegetable_id,
            quantity: 1
        }]
    } else if(positionThisVegetableInCart < 0){
        carts.push({
            vegetable_id: vegetable_id,
            quantity: 1
        })
    } else {
        carts[positionThisVegetableInCart].quantity = carts[positionThisVegetableInCart].quantity + 1;
    }
    addCartToHTML();
    addCartToMemory();
}

// ham luu du lieu duoi localstorage
const addCartToMemory = () => {
    localStorage.setItem('cart', JSON.stringify(carts));
}

const addCartToHTML = () => {
    listCartHTML.innerHTML = '';
    let totalQuantity = 0;
    if(carts.length > 0){
        carts.forEach(cart => {
            totalQuantity = totalQuantity + cart.quantity;
            // them the div
            let newCart = document.createElement('div');
            // them thuoc the con
            newCart.classList.add('item');
            newCart.dataset.id = cart.vegetable_id;
            // lay id cua san pham vua add to cart
            let positionVegetable = listVegetables.findIndex((value) => value.id == cart.vegetable_id);
            let info = listVegetables[positionVegetable];
            newCart.innerHTML = `
            <div class="image">
                    <img src="${info.image}" alt="">
                </div>
            <div class="name">
                ${info.name}
            </div>
            <div class="totalPrice">
                $${info.price * cart.quantity}
            </div>
            <div class="quantity">
                <span class="minus"><</span>
                <span>${cart.quantity}</span>
                <span class="plus">></span>
            </div>
            `;
            // hien thi len html
            listCartHTML.appendChild(newCart);
        })
    }
    iconCartSpan.innerText = totalQuantity;
}


const initApp = () => {
    fetch('vegetable.json')
    .then(response => response.json())
    .then(data => {
        listVegetables = data;
        addDataToHTML();

        // get cart from memory
        if(localStorage.getItem('cart')){
            carts = JSON.parse(localStorage.getItem('cart'));
            addCartToHTML();
        }
    })
}
initApp(); // goi ham
