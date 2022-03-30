let Estado = {
    productos: [],
    apiUrl: './assets/items.json',
    total: 0,
}

// Llamada a la api de productos falsos
async function getProducts(callback) {
    let result = await fetch(Estado.apiUrl);
    let data = await result.json();
    Estado.productos = data;
    callback();
}

// Dibujar en el DOM los productos
function drawProducts() {
    /* Dibujamos los elementos en el DOM */
    Estado.productos.forEach(element => {
        let template = `
        <div class="card col col-sm-12 col-md-5" id="${element.id}" draggable="true" ondragstart="drag(event)">            
            <div class="card-img-top" style="background-image:url(${element.image})"></div>
            <div class="card-body">
                <h6 class="card-title">${element.title}</h6>
                <p class="description">${element.description}</p>
                <p><b>Precios:</b> ${element.price}€</p>
            </div>
        </div>`

        document.querySelector('#shop').innerHTML += template;        
    });
}

getProducts(drawProducts);

/* Drag and drop */
function allowDrop(ev) {
    ev.preventDefault();    
}

function drag(ev) {
    ev.dataTransfer.setData("html", ev.target.id);
}

function drop(ev) {
    ev.preventDefault();

    let data = ev.dataTransfer.getData("html");
    let producto = Estado.productos.find(element => element.id == data);    

    let cartElement = document.createElement('div');

    /* Creación de un carrito de la compra */
    cartElement.innerHTML = `
    <span class="d-flex cart-element">
        <div>
            <span class="card-title"><b>${producto.title}</b></span>
            <span>${producto.price}€</span>
        </div>
        <span><button class="btn btn-danger"><i class="fa-solid fa-trash-can"></i></button></span>
    </span>`;

    Estado.total += producto.price;

    document.querySelector('.total span').innerHTML = Estado.total.toFixed(2);
    console.log(ev.target)
    document.querySelector('.cart').appendChild(cartElement);

    /* Eventos */
    cartElement.querySelector('.btn-danger').addEventListener('click', function () {
        Estado.total -= producto.price;
        document.querySelector('.total span').innerHTML = Estado.total.toFixed(2);
        this.parentElement.parentElement.remove();
    });
}
