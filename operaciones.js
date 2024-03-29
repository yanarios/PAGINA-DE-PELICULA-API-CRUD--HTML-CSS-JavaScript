let pagina = 1;
let categoriaActual = 'todas';

document.addEventListener('DOMContentLoaded', () => {
    // Resaltar el botón de la categoría actual al cargar la página
    resaltarBotonCategoria();

    document.getElementById('btnTodas').addEventListener('click', () => {
        categoriaActual = 'todas';
        cargarPeliculas();
        resaltarBotonCategoria();
    });

    document.getElementById('btnEnCartelera').addEventListener('click', () => {
        categoriaActual = 'cartelera';
        cargarPeliculasEnCartelera();
        resaltarBotonCategoria();
    });

    document.getElementById('btnProximamente').addEventListener('click', () => {
        categoriaActual = 'proximamente';
        cargarPeliculasProximamente();
        resaltarBotonCategoria();
    });
});

document.getElementById('agregar').addEventListener('click', () => {
    const titulo = document.getElementById('titulo').value;
    const portada = document.getElementById('portada').value;
    const descripcion = document.getElementById('descripcion').value;

    if (titulo && portada && descripcion) {
        agregarPelicula({ titulo, portada, descripcion });
        alert('¡La pelicula fue agregada con éxito!')
        limpiarCampos();
    } else {
        alert('Por favor, completa todos los campos antes de agregar una película.');
    }
    
});

document.getElementById('cancelar').addEventListener('click', () => {
    limpiarCampos();
    document.getElementById('agregar').style.display = 'inline-block';
    document.getElementById('editar').style.display = 'inline-block';
    document.getElementById('cancelar').style.display = 'none';
});

document.getElementById('editar').addEventListener('click', () => {
    modificarPelicula();
});

const limpiarCampos = () => {
    document.getElementById('titulo').value = '';
    document.getElementById('portada').value = '';
    document.getElementById('descripcion').value = '';
};

const agregarPelicula = (pelicula) => {
    const contenedor = document.getElementById('contenedor');

    const nuevaPelicula = document.createElement('div');
    nuevaPelicula.classList.add('pelicula');

    nuevaPelicula.innerHTML = `
        <img class="poster" src="${pelicula.portada}">
        <div class="info">
            <h3 class="titulo">${pelicula.titulo}</h3>
            <p class="descripcion">${pelicula.descripcion}</p>
            <button class="editar" onclick="editarPelicula(this)">Editar</button>
            <button class="eliminar" onclick="eliminarPelicula(this)">Eliminar</button>
        </div>
    `;

    contenedor.appendChild(nuevaPelicula);
};

const editarPelicula = (botonEditar) => {
    const pelicula = botonEditar.parentNode.parentNode;
    const titulo = pelicula.querySelector('.titulo').innerText;
    const portada = pelicula.querySelector('.poster').getAttribute('src');
    const descripcion = pelicula.querySelector('.descripcion').innerText;

    // Preenchando el formulario con la información actual
    document.getElementById('titulo').value = titulo;
    document.getElementById('portada').value = portada;
    
    document.getElementById('descripcion').value = descripcion;

    // Cambiar el botón "Agregar" a "Modificar"
    document.getElementById('agregar').style.display = 'none';
    document.getElementById('editar').style.display = 'inline-block';
    document.getElementById('cancelar').style.display = 'inline-block';

    // Guardar la referencia de la película actual en el botón "Modificar"
    document.getElementById('editar').pelicula = pelicula;
};

const modificarPelicula = () => {
    const tituloNuevo = document.getElementById('titulo').value;
    const portadaNuevo = document.getElementById('portada').value;
    const descripcionNuevo = document.getElementById('descripcion').value;

    if (tituloNuevo && portadaNuevo && descripcionNuevo) {
        const peliculaActual = document.getElementById('editar').pelicula;
        peliculaActual.querySelector('.titulo').innerText = tituloNuevo;
        peliculaActual.querySelector('.poster').setAttribute('src', portadaNuevo);
        peliculaActual.querySelector('.descripcion').innerText = descripcionNuevo;
        alert('se actualizaron los datos con éxito')

        // Restablecer el formulario y los botones
        limpiarCampos();
        document.getElementById('agregar').style.display = 'inline-block';
        document.getElementById('editar').style.display = 'inline-block';
        document.getElementById('cancelar').style.display = 'none';
    } else {
        alert('Por favor, completa todos los campos antes de actualizar los datos de una película.');
    }
};

const eliminarPelicula = (botonEliminar) => {
    const pelicula = botonEliminar.parentNode.parentNode;
    const contenedor = document.getElementById('contenedor');
    contenedor.removeChild(pelicula);
};

const btnAnterior = document.getElementById('btnAnterior');
const btnSiguiente = document.getElementById('btnSiguiente');

btnSiguiente.addEventListener('click', () => {
    if (pagina < 1000) {
        pagina += 1;
        cargarPeliculas();
    }
});

btnAnterior.addEventListener('click', () => {
    if (pagina > 1) {
        pagina -= 1;
        cargarPeliculas();
    }
});

const cargarPeliculas = async () => {
    try {
        let url;

        if (categoriaActual === 'todas') {
            url = `https://api.themoviedb.org/3/discover/movie?api_key=192e0b9821564f26f52949758ea3c473&language=es-MX&page=${pagina}`;
        } else if (categoriaActual === 'cartelera') {
            url = `https://api.themoviedb.org/3/discover/movie?api_key=192e0b9821564f26f52949758ea3c473&language=es-MX&page=${pagina}&primary_release_date.gte=${obtenerFechaActual()}`;
        } else if (categoriaActual === 'proximamente') {
            // Cambia la categoría a programas de televisión
            url = `https://api.themoviedb.org/3/discover/tv?api_key=192e0b9821564f26f52949758ea3c473&language=es-MX&page=${pagina}`;
        }

        const respuesta = await fetch(url);
        const datos = await respuesta.json();

        let peliculas = '';
        datos.results.forEach(pelicula => {
            // Verifica si el objeto pelicula tiene la propiedad title o name
            const titulo = pelicula.title || pelicula.name || 'Título no disponible';

            peliculas += `
                <div class="pelicula">
                    <img class="poster" src="https://image.tmdb.org/t/p/w500/${pelicula.poster_path}">
                    <div class="info">
                        <h3 class="titulo">${titulo}</h3>
                        <p class="descripcion">${pelicula.overview}</p>
                        <button class="editar" onclick="editarPelicula(this)">Editar</button>
                        <button class="eliminar" onclick="eliminarPelicula(this)">Eliminar</button>
                    </div>
                </div>
            `;
        });

        document.getElementById('contenedor').innerHTML = peliculas;
    } catch (error) {
        console.error(error);
    }
};


const cargarPeliculasEnCartelera = async () => {
    // Lógica específica para cargar películas en cartelera
    pagina = 1; // Reiniciar la página cuando cambias de categoría
    cargarPeliculas();
};

const cargarPeliculasProximamente = async () => {
    // Lógica específica para cargar películas próximamente
    pagina = 1; // Reiniciar la página cuando cambias de categoría
    cargarPeliculas();
};

// Función para obtener la fecha actual en el formato YYYY-MM-DD
const obtenerFechaActual = () => {
    const fecha = new Date();
    const year = fecha.getFullYear();
    const month = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const day = fecha.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
};

cargarPeliculas();

const resaltarBotonCategoria = () => {
    // Obtener todos los botones de categoría
    const botonesCategorias = document.querySelectorAll('.botoncito button');

    // Eliminar la clase 'active' de todos los botones de categoría
    botonesCategorias.forEach(boton => {
        boton.classList.remove('active');
    });

    // Obtener el botón de la categoría actual
    const botonCategoriaActual = document.getElementById(`btn${categoriaActual.charAt(0).toUpperCase()}${categoriaActual.slice(1)}`);

    // Añadir la clase 'active' al botón de la categoría actual, si existe
    if (botonCategoriaActual) {
        botonCategoriaActual.classList.add('active');
    } else if (categoriaActual === 'cartelera') {
        // Para el caso de "En Cartelera Hoy", agregar la clase 'active' al botón específico
        document.querySelector('.enCartelera').classList.add('active');
    }
};