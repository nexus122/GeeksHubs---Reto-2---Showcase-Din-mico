// Todos los productos estan sacados de https://fakestoreapi.com/products <- api de productos falsos.
// Como me estaba fallando mucho he descargado la peticion y la he guardado en un archivo json local.
// La consulta la hago al archivo local para mas estabilidad, pero se puede consultar de la api.

let Estado = {
    productos: [],
    apiUrl: './assets/items.json',
    cart: [],    
    total: 0,
}

// Llamada a la api de productos falsos
async function getProducts(callback) {
    // Hacemos un fetch a nuestro archivo local
    let result = await fetch(Estado.apiUrl);
    let data = await result.json();
    // Guardamos el resultado en nuestro estado.productos https://cutt.ly/nDInOaK
    Estado.productos = data;

    // Llamamos a la funcion de dibujo de productos que hemos passado por parametro para hacer un callback.
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
                <p><b>Price:</b> ${element.price}€</p>
            </div>
        </div>`
        /* Rellenando la plantilla dibujamos todos los productos en la pagina */
        document.querySelector('#shop').innerHTML += template;        
    });
}

getProducts(drawProducts);

/* Drag and drop */
function allowDrop(ev) {
    ev.preventDefault();    
}
/* Elemento arrastrable, obtenemos el id */
function drag(ev) {
    ev.dataTransfer.setData("html", ev.target.id);
}

/* Elemento donde vamos a arrastrar. */
function drop(ev) {
    ev.preventDefault();

    /* Recuperamos el id del elemento que estamos arrastrando */
    let data = ev.dataTransfer.getData("html");

    /* Hacemos una busqueda del elemento por id utilizando el find() */
    let producto = Estado.productos.find(element => element.id == data);    

    /* Creamos un nuevo elemento html */
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

    /* Guadamos el producto en nuestro carrito */
    Estado.cart.push(producto);

    /* Alteramos el estado de nuestra aplicación con el nuevo precio total. */
    Estado.total += producto.price;

    /* Dibujamos el precio total formateado para que tenga maximo 2 decimales */
    document.querySelector('.total span').innerHTML = Estado.total.toFixed(2);
    // Dibujamos en el dom el elemento que vamos a crear.
    document.querySelector('.cart').appendChild(cartElement);

    /* Le añadimos al btn que acabamos de crear el evento de borrado */
    cartElement.querySelector('.btn-danger').addEventListener('click', function () {
        Estado.total -= producto.price;
        document.querySelector('.total span').innerHTML = Estado.total.toFixed(2);
        this.parentElement.parentElement.remove();
    });
}
