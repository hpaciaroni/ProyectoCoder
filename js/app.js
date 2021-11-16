//declaro array
let carrito;
let remeras;
// traigo desde HTML y paso a const para trabajar en js
const listaProducto = document.querySelector('.listadoProducto');
const tablaCarrito = document.querySelector('#lista-carrito tbody');
const formBuscador = document.querySelector('#formulario');
const vaciarCarrito = document.querySelector('#vaciar-carrito');

// Listeners
document.addEventListener("DOMContentLoaded", () => {
  //con parse traigo los datos que estan en el Storage y si esta vacio, paso a crear el array carrito vacio
  const carritoStorage = JSON.parse(localStorage.getItem("carrito"));
  carrito = carritoStorage || [];
  //cada vez que se carga el documento con DOMContentLoaded ejecuto estas 2 funciones para actualizar el carritohtml y los productos
  actualizarCarritoHTML();
  $.ajax({
    // implicitamente son todos GET
    method: "GET",
    // se indica el tipo de dato
    dataType: "json",
    //la url puede ser tambien una direccion web
    url: "js/productos.json",
    success: function (productos, textStatus, xhr) {
      remeras = productos;
      renderProducts(remeras);
      console.log(textStatus + " esto es textStatus");
      console.log(xhr + " esto es xhr");
    },
    // en caso de que surga un error tipo 400/500 lanza un error
    error: function (xhr, textStatus, error) {
      console.log(xhr + " esto es el xhr");
      console.log(textStatus + " esto es el textStatus");
      console.log(error + " esto es el error");
    },
  });
});
/*
listaProducto.addEventListener('click', agregarProducto);
vaciarCarrito.addEventListener('click', vaciarCarro);
tablaCarrito.addEventListener('click', eliminarProducto);
*/
// Listeners en JQuery
$(".listadoProducto").on("click",agregarProducto);
$("#vaciar-carrito").on("click", vaciarCarro);
$("#lista-carrito tbody").on("click", eliminarProducto);

function eliminarProducto(e) {
	e.preventDefault();
	//en vez de acceder por la clase, accedo por al target del nodeName
	if (e.target.nodeName === "A" || e.target.nodeName === "I") {
		// con closest busco el elemento html mas cercano, en este caso A o I, amplio el margen para que haga click en el tacho
		const id = e.target.closest('a').dataset.id;

		const carritoFiltrado = carrito.filter(producto => producto.id !== id);
		//con el spread "desparramo" el nuevo array pero sin el producto que quiero eliminar
		carrito = [...carritoFiltrado];

		actualizarCarritoHTML();
		actualizarStorage();
	}
}

function vaciarCarro() {
	carrito.length = 0;
	actualizarCarritoHTML()
	actualizarStorage()
}
/* El array carrito debe estar sincronizado con el carrito que se ve en html y en el Storage por eso se 
crean 2 funciones como actualizarCarritoHTML() y actualizarStorage()  */

function actualizarCarritoHTML() {
	tablaCarrito.innerHTML = '';

	carrito.forEach(remeras => {
		const { imagen, nombre, precio, cantidad, id } = remeras;
		const row = document.createElement('tr');
		row.innerHTML = `
			<td> <img src="${imagen}" class="imgCarrito" width="100%">			</td>
			<td class="carritoTextoRow">				${nombre}			</td>
			<td class="carritoTextoRow">				${precio}			</td>
			<td class="carritoTextoRow">				${cantidad}			</td>
			<td class=""><a href="#" class="borrar-producto" data-id="${id}"><i class="fas fa-trash"></i></a>			</td>
		`
		tablaCarrito.appendChild(row);
	});
}

function agregarProducto(e) {
	// con esto evito que al dar click suba en la pantalla
	e.preventDefault();
	//al detectar el click, busco que el target sea la clase agregar-carrito
	if (e.target.classList.contains("agregar-carrito")) {
		/*desde la clase agregar-carrito creo la const parandome en el div
		de la imagen que esta 2 niveles mas arriba por eso pongo 2 veces parentElement*/
		const productCard = e.target.parentElement.parentElement;
		/* .scr porque quiero que levante la src para la img y textContent para tomar
		 lo escrito, cantidad seteo en 1 (luego aumenta), para el id pongo dataset.ig */
		const productoAgregado = {
			imagen: productCard.querySelector('img.imagen-producto').src,
			nombre: productCard.querySelector('h4').textContent,
			precio: productCard.querySelector('.precio span').textContent,
			cantidad: 1,
			id: productCard.querySelector('a').dataset.id
		}

		/* Chequear si productoAgregado existe en el carrito, es para evitar que el 
		mismo producto aparezca en 2 rows diferentes, debe aumentar cantidad no agregar de nuevo el producto */

		const existe = carrito.some(producto => producto.id === productoAgregado.id);
	
		if (existe) {
			const nuevoCarrito = carrito.map(producto => {
				if (producto.id === productoAgregado.id) {
					producto.cantidad++;
				}
				return producto;
			});
			//con spread operator "desparramo" y actualizo mi array de carrito
			carrito = [...nuevoCarrito];
			
		} else {
			// Se agrega por primera vez
			carrito.push(productoAgregado);
			
		}

		// Renderizo la tabla con los items del carrito
		actualizarCarritoHTML();
		actualizarStorage();
	}	
}

function actualizarStorage() {
	// TODO
	localStorage.setItem('carrito', JSON.stringify(carrito));
}

/* cargo las remeras que vienen del otro archivo(ingresar en parametro la const del otro archivo) 
y con el forEach voy iterando + creando html para cada remera */
function renderProducts(remeras) {
	listaProducto.innerHTML = ''

	remeras.forEach(remera => {
		const html = `
			
			<div class="producto">
				<img src="${remera.imagen}" class="producto__imagen imagen-producto">
				<div class="">
					<h4 class="producto__nombre">${remera.nombre}</h4>	
					<p>Proximamente podras elegir el talle</p>				
					<p class="precio producto__precio">Precio: <span class="">${remera.precio}</span></p>
					<a href="#" class="agregar-carrito formulario__submit" data-id="${remera.id}">Agregar al Carrito</a>
				</div>
			</div>
			
		`
		//concateno para que me muestre todos las remeras, sino solo muestra la ultima
		listaProducto.innerHTML += html;
	});
}
// carrousel imagenes 
document.addEventListener('DOMContentLoaded', function() {
new Glider(document.querySelector('.carrousel__lista'), {
	slidesToShow: 1,
	dots: '.carrousel__indicadores',
        arrows: {
          prev: '.carrousel__anterior',
          next: '.carrousel__siguiente'
        },
	});
})

// boton de aviso con libreria toastr 
$(document).ready(function(){
	  $(".agregar-carrito").click(function(){
		toastr["success"]( "Producto agregado Correctamente!")
	  });

	toastr.options = {	
	  "positionClass": "toast-top-right",	  
	  "timeOut": "1000",	  
	}
  })
$(document).ready(function(){
	$("#vaciar-carrito").click(function(){
	  toastr["error"]("", "No Jodas! Volve a llenar el carrito!")
	});

  toastr.options = {  
	"positionClass": "toast-top-right",	
	"timeOut": "1000",	
  }
})

//animacion con jquery, antes tenia con css
$(".bienvenido").slideUp(3000);

setInterval (()=> {
$(".animate__animated").fadeOut(3000, () => $(".animate__animated").fadeIn(2000))
},3000)