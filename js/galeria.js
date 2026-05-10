/**
 * Aquest script s'encarrega d'analitzar la URL de la galeria per saber què ha de mostrar.
 */

/**
 * CONFIGURACIÓ DE SUPABASE
 * Això utilitza la CDN oficial ('@supabase/supabase-js') que hem afegit a galeria.html.
 * L'Anon Key és segura de posar aquí SEMPRE I QUAN el bucket 'imatges-web' tingui
 * les polítiques adequades a Supabase (Row Level Security permetent només "SELECT" al públic).
 */
const SUPABASE_URL = 'https://dztvgrctmljpwxifmvoo.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR6dHZncmN0bWxqcHd4aWZtdm9vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIzNTkxMzAsImV4cCI6MjA4NzkzNTEzMH0.oo-xC6kYTAN33Mj9ir4jmC1F3OSe6NW1x7INFf77D3U';

// Inicialitzem el client (la connexió a la base de dades)
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

document.addEventListener('DOMContentLoaded', () => {
    // 1. Llegir paràmetres de la URL
    const params = new URLSearchParams(window.location.search);
    const categoria = params.get('categoria');
    const album = params.get('album');

    // 2. Control d'estat a la Navegació (Ressaltar l'enllaç actiu)
    mostrarCategoriaActivaMenu(categoria, album);

    // 3. Modificar els títols de la pàgina
    prepararTitolsSeccio(categoria, album);

    // 4. Carregar imatges de Supabase segons els paràmetres
    carregarImatges(categoria, album);
});

/**
 * Funció per afegir la classe 'actiu' a l'enllaç del menú que toca per saber on ets.
 */
function mostrarCategoriaActivaMenu(categoria, album) {
    if (!categoria) return; // Si algú entra a /galeria.html net, no fem res especial d'entrada

    // Traiem qualsevol rastre d'actiu anterior
    document.querySelectorAll('.navegacio-horitzontal .actiu').forEach(el => el.classList.remove('actiu'));

    if (album) {
        // Estem dins d'un àlbum específic. 
        const enllacAlbum = document.querySelector(`.navegacio-horitzontal .submenu a[href="?categoria=${categoria}&album=${album}"]`);

        if (enllacAlbum) {
            enllacAlbum.classList.add('actiu');
            const liPare = enllacAlbum.closest('.element-amb-submenu');
            if (liPare) {
                const enllacPare = liPare.querySelector('.enllac-horitzontal');
                if (enllacPare) enllacPare.classList.add('actiu');
            }
        }
    } else {
        // Estem només a la categoria principal.
        const enllacCategoria = document.querySelector(`.navegacio-horitzontal .element-amb-submenu a[href="?categoria=${categoria}"]`);

        if (enllacCategoria) {
            enllacCategoria.classList.add('actiu');
        }
    }
}

/**
 * Diccionari (o 'lookup table') per traduir el parametre lleig de la URL a un títol maco.
 */
const TítolsGaleria = {
    'analogic': {
        base: 'Analògic',
        desc: 'La màgia de la pel·lícula, la paciència de la revelació i el gra imperfecte.',
        albums: {
            'monocrom': 'Blanc i Negre',
            'color': 'Color'
        }
    },
    'de-viatge': {
        base: 'De Viatge',
        desc: 'Fotografia documental dels meus viatges al voltant del món.',
        albums: {
            'ryukyu': 'Ryukyu',
            'japo': 'Japó',
            'filipines': 'Filipines',
            'taiwan': 'Taiwan',
            'shanghai': 'Shanghai',
            'escocia': 'Escòcia'
        }
    },
    'el-dia-a-dia': {
        base: 'El dia a dia',
        desc: 'Moments quotidians que passen desapercebuts.',
        albums: {
            '2018': '2018',
            '2019': '2019',
            '2020': '2020',
            '2021': '2021',
            '2022': '2022',
            '2023': '2023',
            '2024': '2024',
            '2025': '2025',
            '2026': '2026'
        }
    },
    'col-laboracions': {
        base: 'Col·laboracions',
        desc: 'Projectes d\'estudi, treballs per encàrrec i altres entitats.',
        albums: {
            'centre-tao': 'Centre Tao',
            'teatre-centre': 'Teatre Centre',
            'esbart-eudald-coma': 'Esbart Eudald Coma'
        }
    }
};

/**
 * Funció encarregada de canviar l'<h1> i la <p> al damunt de la galeria.
 */
function prepararTitolsSeccio(categoria, album) {
    const elTitol = document.getElementById('titol-galeria');
    const elDesc = document.getElementById('descripcio-galeria');
    const titolPestanya = document.querySelector('title');
    const hubContainer = document.getElementById('hub-container');
    const capcaleraGaleria = document.getElementById('capcalera-galeria');
    const navegacioCategories = document.getElementById('navegacio-categories');
    const layoutGaleria = document.querySelector('.layout-galeria');

    // Cas per defecte (Vista principal del Hub)
    if (!categoria || !TítolsGaleria[categoria]) {
        if (capcaleraGaleria) capcaleraGaleria.style.display = 'none';
        if (hubContainer) hubContainer.style.display = 'flex';
        if (navegacioCategories) navegacioCategories.style.display = 'none';
        if (layoutGaleria) layoutGaleria.classList.add('is-hub');
        return;
    }

    // Mode Àlbum (Ocultem Hub i recuperem galeria)
    if (hubContainer) hubContainer.style.display = 'none';
    if (capcaleraGaleria) capcaleraGaleria.style.display = 'block';
    if (navegacioCategories) navegacioCategories.style.display = 'block';
    if (layoutGaleria) layoutGaleria.classList.remove('is-hub');

    const dadesCat = TítolsGaleria[categoria];
    let titolFinal = dadesCat.base;

    // Si estem buscant un àlbum específic (i la categoria té àlbums registrats aquí)
    if (album && dadesCat.albums && dadesCat.albums[album]) {
        titolFinal = `${dadesCat.base}: ${dadesCat.albums[album]}`;
    }

    // Assignar al DOM
    elTitol.textContent = titolFinal;
    elDesc.textContent = dadesCat.desc;

    // Canviar el títol del navegador (SEO i pestanyes mòbil)
    titolPestanya.textContent = `Júlia del Puerto Peix | ${titolFinal}`;
}

/**
 * Funció principal per connectar amb Supabase Storage i descarregar les fotos corresponents a l'àlbum que estem mirant.
 */
async function carregarImatges(categoria, album) {
    const graellaHTML = document.getElementById('masonry-grid');

    // 0. Retorn primerenc (Early Return): Si no hi ha cap filtre, deixem la graella buida i aturem la funció
    if (!categoria && !album) {
        graellaHTML.innerHTML = '';
        console.log("No hi ha paràmetres actius. Es mostra la galeria global buida per defecte.");
        return;
    }

    console.log(`🖼️ Intentant carregar imatges per: Categoria [${categoria}] | Àlbum [${album}]`);

    // Lògica de construcció de la ruta de la carpeta basant-nos en els paràmetres de la URL
    let rutaCarpeta = '';

    if (album) {
        // Ex: categoria='analogic', album='color' -> Carpeta = 'analogic-color'
        rutaCarpeta = `${categoria}-${album}`;
    } else if (categoria) {
        // Ex: categoria='el-dia-a-dia' -> Carpeta = 'el-dia-a-dia'
        rutaCarpeta = categoria;
    }

    console.log(`📂 Cercant carpeta a Supabase: '${rutaCarpeta}'`);

    try {
        // 1. Demanem a Supabase que ens llisti tots els arxius de dins d'aquesta carpeta al bucket 'imatges-web'.
        const { data: llistaArxius, error } = await supabaseClient
            .storage
            .from('imatges-web')
            .list(rutaCarpeta, {
                limit: 100,
                offset: 0,
                sortBy: { column: 'name', order: 'asc' },
            });

        // 2. Control d'errors
        if (error) {
            console.error("🚨 Error connectant a Supabase Storage:", error.message);
            return;
        }

        if (!llistaArxius || llistaArxius.length === 0) {
            console.warn(`⚠️ No s'han trobat imatges a la carpeta '${rutaCarpeta}'`);
            return;
        }

        // 3. Netejar la llista: Supabase de vegades retorna un arxiu buit anomenat '.emptyFolderPlaceholder'
        // només volem imatges de veritat (.webp, .jpg, .png)
        const arxiusSencers = llistaArxius.filter(arxiu =>
            arxiu.name !== '.emptyFolderPlaceholder' &&
            (arxiu.name.endsWith('.webp') || arxiu.name.endsWith('.jpg') || arxiu.name.endsWith('.png'))
        );

        console.log(`✅ Connexió a Supabase exitosa! Hem trobat ${arxiusSencers.length} fotografies a '${rutaCarpeta}':`);

        // 4. Netegem el contenidor per si de cas (esborrem fotos anteriors abans d'afegir les noves)
        graellaHTML.innerHTML = '';

        // 5. Creem l'HTML per cada foto i l'afegim a la graella
        arxiusSencers.forEach((foto, índex) => {
            // Obtenim l'enllaç públic final de l'arxiu
            const { data: urlData } = supabaseClient
                .storage
                .from('imatges-web')
                .getPublicUrl(`${rutaCarpeta}/${foto.name}`);

            const urlReal = urlData.publicUrl;

            // Creem l'estructura de la targeta (l'item del Masonry)
            const elementFoto = document.createElement('figure');
            elementFoto.className = 'item-masonry';

            // Creem la imatge
            const img = document.createElement('img');
            img.alt = `Fotografia de ${categoria} - ${album}`;

            // ESDEVENIMENT CLAU: Quan la foto es descarrega, s'anima tota sola!
            img.onload = () => {
                // No esperem a cap altra foto. Afegim la classe amb un micro-retard per la cascada.
                setTimeout(() => {
                    elementFoto.classList.add('carregada');
                }, índex * 50);
            };

            // Si una foto falla per xarxa, la mostrem igualment per no deixar el forat
            img.onerror = () => {
                elementFoto.classList.add('carregada');
            };

            img.src = urlReal;
            
            // LIGHTBOX: Obre la imatge en fer clic
            img.style.cursor = 'zoom-in';
            img.addEventListener('click', () => obrirLightbox(urlReal));

            elementFoto.appendChild(img);
            graellaHTML.appendChild(elementFoto);
        });

    } catch (err) {
        // Si l'error és del Javascript intern (no d'Internet/Supabase)
        console.error("💥 Error crític executant la funció:", err);
    }
}

// ==========================================================================
//   LIGHTBOX LOGIC
// ==========================================================================

function obrirLightbox(urlImatge) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    
    if (lightbox && lightboxImg) {
        lightboxImg.src = urlImatge;
        lightbox.classList.add('actiu');
        document.body.style.overflow = 'hidden'; // Evita scroll de fons
    }
}

function tancarLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    
    if (lightbox) {
        lightbox.classList.remove('actiu');
        document.body.style.overflow = '';
        setTimeout(() => {
            if (lightboxImg) lightboxImg.src = '';
        }, 400); // Neteja la imatge un cop acabada la transició
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const lightbox = document.getElementById('lightbox');
    const btnTancar = document.getElementById('lightbox-tancar');

    if (btnTancar) {
        btnTancar.addEventListener('click', tancarLightbox);
    }

    if (lightbox) {
        // Tancar en fer clic fora de la imatge
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox || e.target === document.querySelector('.lightbox-contingut')) {
                tancarLightbox();
            }
        });
    }

    // Tancar amb la tecla Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox && lightbox.classList.contains('actiu')) {
            tancarLightbox();
        }
    });
});
