'use strict';

(() => {

    /* =========================================
       1. DATOS DE LAS NOTICIAS
    ========================================= */

    const categorias = {
        comunidad: 'Comunidad',
        equipo: 'Equipo y aprendizaje'
    };

    // Información provisional para la maqueta académica.

    const noticias = [
        {
            id: 'campana',
            categoria: 'comunidad',
            fecha: '',
            titulo: 'Actividad comunitaria · imagen referencial',
            imagen: '5.jpg',
            resumen: 'Fotografía ilustrativa aportada por el equipo para la maqueta.',
            texto: 'Esta imagen se incluye solo como referencia visual. No confirma que la actividad haya ocurrido en Mochumí ni representa un registro oficial del establecimiento.'
        },
        {
            id: 'equipo',
            categoria: 'equipo',
            fecha: '',
            titulo: 'Personal de salud · imagen referencial',
            imagen: '6.jpg',
            resumen: 'Fotografía ilustrativa aportada por el equipo para la maqueta.',
            texto: 'Esta imagen se incluye solo como referencia visual. No confirma que las personas fotografiadas pertenezcan al Centro de Salud de Mochumí.'
        },
        {
            id: 'orientacion',
            categoria: 'comunidad',
            fecha: '',
            titulo: 'Orientación comunitaria · imagen referencial',
            imagen: '7.jpg',
            resumen: 'Fotografía ilustrativa aportada por el equipo para la maqueta.',
            texto: 'Esta imagen se incluye solo como referencia visual. No confirma que la actividad haya ocurrido en Mochumí ni representa un registro oficial del establecimiento.'
        },
        {
            id: 'sis',
            categoria: 'comunidad',
            fecha: '',
            titulo: 'Orientación sobre salud · imagen referencial',
            imagen: '8.jpg',
            resumen: 'Fotografía ilustrativa aportada por el equipo para la maqueta.',
            texto: 'Esta imagen se incluye solo como referencia visual. No confirma que la actividad haya ocurrido en Mochumí ni representa un registro oficial del establecimiento.'
        },
        {
            id: 'capacitacion',
            categoria: 'equipo',
            fecha: '',
            titulo: 'Capacitación de personal · imagen referencial',
            imagen: '10.jpg',
            resumen: 'Fotografía ilustrativa aportada por el equipo para la maqueta.',
            texto: 'Esta imagen se incluye solo como referencia visual. No confirma que la actividad haya ocurrido en Mochumí ni representa un registro oficial del establecimiento.'
        }
    ];


    /* =========================================
       2. DATOS DEL ARCHIVO DE PRENSA
    ========================================= */

    // Fechas ficticias para demostrar el funcionamiento
    // de los filtros del archivo de prensa.

    const archivo = [
        { ...noticias[0], fecha: '2026-10-01' },
        { ...noticias[1], fecha: '2026-08-01' },
        { ...noticias[2], fecha: '2025-09-01' },
        { ...noticias[3], fecha: '2025-06-01' },
        { ...noticias[4], fecha: '2025-04-01' }
    ];

    const fotos = noticias.map(({ imagen, titulo }) => ({
        imagen,
        titulo
    }));


    /* =========================================
       3. VARIABLES Y FUNCIONES AUXILIARES
    ========================================= */

    const base = 'img/';

    const $ = id => document.getElementById(id);

    const normalizar = valor => valor
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim();

    const formatoFecha = fecha => {

        if (!fecha) {
            return 'Fecha por confirmar · Ejemplo';
        }

        return new Intl.DateTimeFormat('es-PE', {
            dateStyle: 'long',
            timeZone: 'UTC'
        }).format(
            new Date(`${fecha}T00:00:00Z`)
        ) + ' · Fecha de ejemplo';

    };

    let categoriaActiva = 'todas';
    let fotoActual = 0;

    const retornoFoco = new WeakMap();


    /* =========================================
       4. CREACIÓN DE ELEMENTOS HTML
    ========================================= */

    function elemento(etiqueta, clase, texto) {

        const nodo = document.createElement(etiqueta);

        if (clase) {
            nodo.className = clase;
        }

        if (texto !== undefined) {
            nodo.textContent = texto;
        }

        return nodo;

    }


    /* =========================================
       5. CONTROL DE IMÁGENES
    ========================================= */

    function asignarImagen(img, ruta, descripcion) {

        img.alt = descripcion;

        img.onerror = () => {
            img.onerror = null;
            img.alt = `No se pudo cargar la imagen: ${descripcion}`;
        };

        img.src = `${base}${ruta}`;

    }

    function imagen(ruta, descripcion) {

        const img = elemento('img');

        img.loading = 'lazy';

        asignarImagen(img, ruta, descripcion);

        return img;

    }


    /* =========================================
       6. BOTONES Y TARJETAS DE NOTICIAS
    ========================================= */

    function botonNoticia(id) {

        const boton = elemento(
            'button',
            'ng-button',
            'Leer más →'
        );

        boton.type = 'button';
        boton.dataset.news = id;

        return boton;

    }

    function tarjeta(noticia) {

        const article = elemento('article', 'ng-card');

        const body = elemento('div', 'ng-card__body');

        body.append(
            elemento(
                'span',
                'ng-tag',
                categorias[noticia.categoria]
            ),
            elemento(
                'p',
                'ng-meta',
                formatoFecha(noticia.fecha)
            ),
            elemento('h3', '', noticia.titulo),
            elemento('p', '', noticia.resumen),
            botonNoticia(noticia.id)
        );

        article.append(
            imagen(noticia.imagen, noticia.titulo),
            body
        );

        return article;

    }


    /* =========================================
       7. BUSCADOR Y FILTRADO DE NOTICIAS
    ========================================= */

    function renderNoticias() {

        if (!$('noticias') || !$('buscar')) {
            return;
        }

        const consulta = normalizar($('buscar').value);

        const resultados = noticias.filter(noticia => {

            const coincideCategoria =
                categoriaActiva === 'todas' ||
                noticia.categoria === categoriaActiva;

            const contenido = normalizar(
                `${noticia.titulo}
                 ${categorias[noticia.categoria]}
                 ${noticia.resumen}
                 ${noticia.texto}`
            );

            const coincideBusqueda =
                contenido.includes(consulta);

            return coincideCategoria && coincideBusqueda;

        });

        $('noticias').replaceChildren(
            ...resultados.map(tarjeta)
        );

        $('resultados').textContent = resultados.length
            ? `${resultados.length} publicaciones de ejemplo`
            : 'No se encontraron noticias con esos filtros.';

    }

    function iniciarFiltros() {

        const botones = document.querySelectorAll(
            '[data-category]'
        );

        botones.forEach(boton => {

            boton.addEventListener('click', () => {

                categoriaActiva = boton.dataset.category;

                botones.forEach(b => {

                    b.setAttribute(
                        'aria-pressed',
                        String(b === boton)
                    );

                });

                renderNoticias();

            });

        });

        $('buscar')?.addEventListener(
            'input',
            renderNoticias
        );

        renderNoticias();

    }


    /* =========================================
       8. VENTANAS MODALES
    ========================================= */

    function abrirDialogo(dialogo, origen) {

        if (!dialogo || dialogo.open) {
            return;
        }

        retornoFoco.set(dialogo, origen);

        dialogo.showModal();

    }

    function abrirNoticia(noticia, origen) {

        if (!noticia || !$('detalle')) {
            return;
        }

        $('detalle-titulo').textContent = noticia.titulo;

        $('detalle-meta').textContent =
            `${categorias[noticia.categoria]} ·
             ${formatoFecha(noticia.fecha)}`;

        $('detalle-texto').textContent = noticia.texto;

        asignarImagen(
            $('detalle-img'),
            noticia.imagen,
            noticia.titulo
        );

        abrirDialogo($('detalle'), origen);

    }

    function iniciarDialogos() {

        document.querySelectorAll('[data-close]')
            .forEach(boton => {

                boton.addEventListener('click', () => {

                    $(boton.dataset.close)?.close();

                });

            });

        document.querySelectorAll('.ng-dialog')
            .forEach(dialogo => {

                dialogo.addEventListener('close', () => {

                    retornoFoco.get(dialogo)?.focus();

                });

                dialogo.addEventListener('click', evento => {

                    if (evento.target !== dialogo) {
                        return;
                    }

                    const rect = dialogo.getBoundingClientRect();

                    const fuera =
                        evento.clientX < rect.left ||
                        evento.clientX > rect.right ||
                        evento.clientY < rect.top ||
                        evento.clientY > rect.bottom;

                    if (fuera) {
                        dialogo.close();
                    }

                });

            });

        document.querySelector('main')
            ?.addEventListener('click', evento => {

                const boton = evento.target.closest('[data-news]');

                if (!boton) {
                    return;
                }

                const lista = boton.dataset.archivo
                    ? archivo
                    : noticias;

                const noticia = lista.find(
                    n => n.id === boton.dataset.news
                );

                abrirNoticia(noticia, boton);

            });

    }


    /* =========================================
       9. GALERÍA FOTOGRÁFICA INTERACTIVA
    ========================================= */

    function mostrarFoto(indice) {

        if (!$('visor-img') || !fotos.length) {
            return;
        }

        fotoActual =
            (indice + fotos.length) % fotos.length;

        const foto = fotos[fotoActual];

        asignarImagen(
            $('visor-img'),
            foto.imagen,
            foto.titulo
        );

        $('visor-caption').textContent =
            `${foto.titulo} · Registro fotográfico pendiente de verificación`;

        $('contador').textContent =
            `${fotoActual + 1} / ${fotos.length}`;

    }

    function iniciarGaleria() {

        if (!$('fotos')) {
            return;
        }

        fotos.forEach((foto, indice) => {

            const boton = elemento('button', 'ng-photo');

            boton.type = 'button';

            boton.setAttribute(
                'aria-label',
                `Ampliar: ${foto.titulo}`
            );

            boton.append(
                imagen(foto.imagen, foto.titulo),
                elemento('span', '', foto.titulo)
            );

            boton.addEventListener('click', () => {

                mostrarFoto(indice);

                abrirDialogo($('visor'), boton);

            });

            $('fotos').append(boton);

        });

        $('anterior')?.addEventListener('click', () => {

            mostrarFoto(fotoActual - 1);

        });

        $('siguiente')?.addEventListener('click', () => {

            mostrarFoto(fotoActual + 1);

        });

        // Navegación mediante las flechas del teclado.

        $('visor')?.addEventListener('keydown', evento => {

            if (
                evento.key === 'ArrowLeft' ||
                evento.key === 'ArrowRight'
            ) {

                evento.preventDefault();

                const direccion =
                    evento.key === 'ArrowLeft' ? -1 : 1;

                mostrarFoto(fotoActual + direccion);

            }

        });

    }


    /* =========================================
       10. ARCHIVO DE PRENSA
    ========================================= */

    function renderArchivo() {

        if (!$('publicaciones')) {
            return;
        }

        const anio = $('anio').value;

        const categoria = $('categoria-archivo').value;

        const resultados = archivo
            .filter(noticia => {

                const coincideAnio =
                    anio === 'todos' ||
                    noticia.fecha.startsWith(anio);

                const coincideCategoria =
                    categoria === 'todas' ||
                    noticia.categoria === categoria;

                return coincideAnio && coincideCategoria;

            })
            .sort(
                (a, b) => b.fecha.localeCompare(a.fecha)
            );

        const publicaciones = resultados.map(noticia => {

            const fila = elemento(
                'article',
                'ng-archive__item'
            );

            const info = elemento('div');

            info.append(
                elemento('h3', '', noticia.titulo),
                elemento(
                    'p',
                    'ng-meta',
                    `${formatoFecha(noticia.fecha)} ·
                     ${categorias[noticia.categoria]}`
                )
            );

            const boton = botonNoticia(noticia.id);

            boton.dataset.archivo = 'true';

            fila.append(info, boton);

            // Mostrar enlace original si existe una fuente válida.

            if (
                noticia.fuente &&
                /^https?:\/\//i.test(noticia.fuente)
            ) {

                const enlace = elemento(
                    'a',
                    '',
                    'Publicación original'
                );

                enlace.href = noticia.fuente;

                fila.append(enlace);

            }

            return fila;

        });

        $('publicaciones').replaceChildren(...publicaciones);

        $('archivo-estado').textContent = resultados.length
            ? `${resultados.length} registros de demostración`
            : 'No hay publicaciones para estos filtros.';

    }

    function iniciarArchivo() {

        if (!$('anio') || !$('categoria-archivo')) {
            return;
        }

        const anios = [
            ...new Set(
                archivo.map(noticia => noticia.fecha.slice(0, 4))
            )
        ].sort().reverse();

        anios.forEach(anio => {

            const opcion = elemento('option', '', anio);

            opcion.value = anio;

            $('anio').append(opcion);

        });

        $('anio').addEventListener(
            'change',
            renderArchivo
        );

        $('categoria-archivo').addEventListener(
            'change',
            renderArchivo
        );

        renderArchivo();

    }


    /* =========================================
       11. MENÚ RESPONSIVE
    ========================================= */

    function iniciarMenu() {

        const boton = document.querySelector('.ng-menu');

        const menu = $('menu');

        if (!boton || !menu) {
            return;
        }

        const escritorio = matchMedia('(min-width: 65rem)');

        function ajustar() {

            menu.hidden = !escritorio.matches;

            boton.setAttribute(
                'aria-expanded',
                String(escritorio.matches)
            );

        }

        boton.addEventListener('click', () => {

            menu.hidden = !menu.hidden;

            boton.setAttribute(
                'aria-expanded',
                String(!menu.hidden)
            );

        });

        escritorio.addEventListener('change', ajustar);

        ajustar();

    }


    /* =========================================
       12. INICIALIZACIÓN DE LA PÁGINA
    ========================================= */

    document.querySelectorAll('main img[src]')
        .forEach(img => {

            const ruta = img
                .getAttribute('src')
                .replace(base, '');

            asignarImagen(img, ruta, img.alt);

        });

    iniciarMenu();
    iniciarFiltros();
    iniciarDialogos();
    iniciarGaleria();
    iniciarArchivo();

})();