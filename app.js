let pagina = 1;
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
		const respuesta = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=192e0b9821564f26f52949758ea3c473&language=es-MX&page=${pagina}`);
		
		if (respuesta.ok) {
			const datos = await respuesta.json();
			let peliculas = '';

			datos.results.forEach(pelicula => {
				peliculas += `
					<div class="pelicula" data-trailer-id="${pelicula.id}" onclick="reproducirTrailer(${pelicula.id})">
						<img class="poster" src="https://image.tmdb.org/t/p/w500/${pelicula.poster_path}" alt="${pelicula.title}">
						<h3 class="titulo">${pelicula.title}</h3>
					</div>
				`;
			});

			document.getElementById('contenedor').innerHTML = peliculas;
		} else {
			// Manejo de errores más específico
			if (respuesta.status === 401) {
				console.error('Error: API key incorrecta');
			} else if (respuesta.status === 404) {
				console.error('Error: No se encontraron películas');
			} else {
				console.error('Error desconocido en la solicitud');
			}
		}
	} catch (error) {
		console.error('Error en la carga de películas:', error);
	}
}

// Nueva función: Obtener el enlace del trailer y abrir el reproductor al hacer clic
const reproducirTrailer = async (peliculaId) => {
	try {
		const respuesta = await fetch(`https://api.themoviedb.org/3/movie/${peliculaId}/videos?api_key=192e0b9821564f26f52949758ea3c473&language=es-MX`);
		
		if (respuesta.ok) {
			const datos = await respuesta.json();
			const trailer = datos.results.find(video => video.type === 'Trailer');

			if (trailer) {
				window.open(`https://www.youtube.com/watch?v=${trailer.key}`, '_blank');
			} else {
				console.error('Error: No se encontró trailer para la película seleccionada');
			}
		} else {
			console.error('Error al obtener información del trailer');
		}
	} catch (error) {
		console.error('Error al obtener información del trailer:', error);
	}
}

const searchInput = document.getElementById('searchInput');
const btnBuscar = document.getElementById('btnBuscar');

// Escucha el evento de cambio en el cuadro de búsqueda
searchInput.addEventListener('input', () => {
	const searchTerm = searchInput.value.trim();

	// Si el cuadro de búsqueda está vacío, cargar las películas populares al inicio
	if (searchTerm === '') {
		cargarPeliculas();
	}
});

btnBuscar.addEventListener('click', async () => {
	const searchTerm = searchInput.value.trim();

	if (searchTerm !== '') {
		try {
			const respuesta = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=192e0b9821564f26f52949758ea3c473&language=es-MX&query=${searchTerm}`);

			if (respuesta.ok) {
				const datos = await respuesta.json();

				if (datos.results.length > 0) {
					let peliculasHTML = '';

					datos.results.forEach(pelicula => {
						peliculasHTML += `
							<div class="pelicula" data-trailer-id="${pelicula.id}" onclick="reproducirTrailer(${pelicula.id})">
								<img class="poster" src="https://image.tmdb.org/t/p/w500/${pelicula.poster_path}" alt="${pelicula.title}">
								<h3 class="titulo">${pelicula.title}</h3>
							</div>
						`;
					});

					document.getElementById('contenedor').innerHTML = peliculasHTML;
				} else {
					mostrarMensajeConEnlace('La película ingresada no se encontró. <a href="#" id="enlaceInicio">Volver al inicio</a>');
				}
			} else {
				// Manejo de errores más específico
				if (respuesta.status === 401) {
					console.error('Error: API key incorrecta');
				} else {
					console.error('Error desconocido en la búsqueda');
				}
			}

		} catch (error) {
			console.error('Error en la búsqueda de películas:', error);
		}
	}
});

function mostrarMensajeConEnlace(mensaje) {
	const mensajeElement = document.createElement('div');
	mensajeElement.classList.add('mensaje');
	mensajeElement.innerHTML = mensaje;

	document.getElementById('contenedor').innerHTML = '';
	document.getElementById('contenedor').appendChild(mensajeElement);

	const enlaceInicio = document.getElementById('enlaceInicio');
	enlaceInicio.addEventListener('click', () => {
		cargarPeliculas();
	});
}

cargarPeliculas();