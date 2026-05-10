---
trigger: always_on
---

# CONTEXT DEL PROJECTE: Portfoli de Fotografia i Programació Personal de la Júlia

**Autora:** Júlia del Puerto Peix
**Objectiu:** Construir un portfoli fotogràfic web modern, "Pixel Perfect", d'alt rendiment i minimalista per substituir el lloc actual fet amb Wix. La web ha de transmetre qualitat, sensibilitat i ordre.

# ESTRUCTURA I CONTINGUT

El portfoli haurà de poder gestionar (ja sigui des de codi fix o una base de dades) l'estructura que l'autora fa servir per classificar el seu art:

- **Navegació de Categories:** S'elimina completament el menú lateral (sidebar) a la galeria per prioritzar la immersió. La navegació de categories serà a través d'un menú minimalista superior o desplegable que no distregui de les imatges.
- **Categories principals:** Analògic (Monocrom vs Color) / De Viatge / El dia a dia / Col·laboracions / Sobre mi / Contacte
- **Secció nova de programació:** S'ha d'afegir una nova secció dedicada a la meva feina i projectes com a programadora junior que expliqui la meva passió per la tecnologia i el meu aprenentatge continu. Per a començar, s'afegirà a "Sobre mi" amb l'enlaç al Github.
- **Sobre les fotografies:** Actualment, les pàgines de galeria només mostren imatges. A la nova web s'ha d'afegir un text personalitzat que expliqui el context de cada galeria.
- **Anys:** 2018 - 2026.

# ARQUITECTURA DE RUTES (Sitemap i Vistes)
El projecte substitueix l'enfocament estàtic (múltiples HTMLs) per un sistema de vistes dinàmiques basat en dades (Supabase).

**Pàgines Base (Vistes estructurals):**
1. `/` (`index.html`): Homepage, portada d'impacte.
2. `/sobre-mi` (`sobre-mi.html`): Biografia de l'autora.
3. `/contacte` (`contacte.html`): Formulari de contacte segur.
4. `/portfoli` (`galeria.html`): La plantilla mare dinàmica per a totes les galeries.

**Estructura de Dades / Paràmetres per a la Galeria:**
La vista de `galeria.html` ha de poder rebre dos nivells de filtratge: `categoria` i `subcategoria` (o àlbum). 
La jerarquia de la base de dades seguirà aquest arbre:

- **analògic**
  - monocrom
  - color
- **el-dia-a-dia**
  - 2018 | 2019 | 2020 | 2021 | 2022 | 2023 | 2024 | 2025 | 2026
- **de-viatge**
  - ryukyu | japo | filipines | taiwan | shanghai | escocia
- **col-laboracions**
  - hostal-estrella | la-granera | alex-pastor | museu-del-ter | centre-tao | setmana-llibre | escola-casals | teatre-centre | esbart-eudald | club-pati-roda

**Nota de desenvolupament:** Mai es crearan arxius HTML físics per a aquestes subcategories. Tot passarà a través del renderitzat de dades del backend (Supabase) cap a la plantilla frontend de la galeria.

# TECNOLOGIES UTILITZADES (Stack)

- **Frontend:** HTML, CSS i JavaScript.
- **Backend:** Supabase (les fotografies estaran emmagatzemades a Storage i s'afegiran amb enllaços).
- **Desplegament previst:** Vercel o Netlify.

# DIRECTRIUS ESTÈTIQUES I UI/UX (Design System)

- **Estil Apple (Light Mode) i Immersió:** El disseny se centra en un "Light Mode" d'estètica Apple: extremadament net, espaiós i immersiu.
- **Minimalisme Extrem i Sense Línies:** L'espai en blanc i la tipografia neta actuen com els únics separadors. Elimina totes les línies de divisió (`borders`) de capçaleres, peus de pàgina i menús per evitar caixes dures o talls innecessaris.
- **Paleta de Colors:** Escala de grisos profunda sobre fons clar. Fons pur (blanc `#FFFFFF` o gris suau `#F9F9F9`) i el text en el seu contrast elegant (ex. `#1A1A1A` o `#666666`).
- **Tipografia:** Elegància editorial. Utilitza una tipografia Sans-Serif neta i geomètrica per a la navegació (com _Inter_ o _Geist_), i una Serif clàssica i estilitzada per als títols dels projectes fotogràfics (com _Playfair Display_ o _Cormorant_).
- **Layout de les Imatges (Full Width):** La graella de fotos ha d'ocupar tot l'ample de la pantalla sense sidebars que la limitin. Fes servir graelles tipus "Masonry" (estil Pinterest) on les fotos mantenen la seva proporció horitzontal/vertical sense ser retallades en quadrats lletjos.
- **Interaccions Micro:** - Fosos (fade-ins) suaus en aparèixer les imatges a l'hora de fer scroll.
  - Al passar el ratolí (hover) sobre una miniatura, aquesta pot fer un petit augment d'escala molt subtil (ex: `scale: 1.02`) o una revelació del títol.

# RENDIMENT (Performance) - PRIORITAT ABSOLUTA

Sent un portfoli visual, el codi s'ha d'optimitzar per carregar imatges grans sense penalitzar l'usuari:

- Totes les imatges s'han de carregar amb "Lazy Loading" (càrrega diferida).
- Cal utilitzar formats de nova generació (WebP).
- Mai descarregar imatges grans si l'usuari està veient la web des del mòbil (aplicar `srcset` o solucions integrades del framework com `next/image`).
- Generar un difuminat temporal (blur) mentre l'imatge principal carrega per evitar "salts" a la pantalla.

# DIRECTRIUS DE SEGURETAT ESPECÍFIQUES (Projecte Portfoli)

Tot i ser un portfoli, complirem amb les regles de seguretat globals del `GEMINI.md`:

- **Formulari de Contacte:** Si s'implementa un formulari (per a col·laboracions), les dades (email i missatge) s'han de validar AL SERVIDOR obligatòriament (per exemple, comprovant que el missatge no conté codi HTML maliciós/XSS).
- **Rate Limiting (Control de peticions):** Afegeix un sistema per evitar que un bot ompli el formulari de contacte massivament i acabi suposant costos de servidor innecessaris per la Júlia.
- **Administració (Opcional):** Si en algun moment fem un panel perquè puguis pujar fotos tu sola sense tocar el codi, s'haurà de blindar amb "Middleware" per comprovar l'autenticació i assegurar-nos que només TU pots esborrar o pujar el teu art (aplicant RLS si usem Supabase).

# NORMES D'INTERACCIÓ AMB L'AGENT (Antigravity)

- **Prioritzar l'aprenentatge:** Quan em proposis codi o prenguis una decisió de disseny, m'has d'explicar el "per què", no només donar-me la solució directa o executar l'acció en silenci.
- **Codi net:** Escriu codi ben estructurat i amb comentaris HTML/CSS que m'ajudin a entendre què fa cada bloc.
- **Ús d'eines autònomes:** Fes servir el teu navegador integrat de manera proactiva per visualitzar els canvis i assegurar-te que l'estètica visual respecta el disseny de les captures que tenim al projecte.
- **Treball pas a pas:** Evita fer canvis massius a múltiples arxius alhora. Avancem secció per secció perquè jo pugui revisar, entendre i aprovar cada pas abans de continuar.
- **Flux de treball de Git (Sincronització constant):**
  - Després de cada tasca completada i validada visualment, l'agent ha de realitzar un **commit** descriptiu (preferiblement en anglès) que resumeixi els canvis.
  - Immediatament després, ha d'executar un **push** a la branca `main` per assegurar que el progrés estigui sempre salvat a GitHub.
  - L'objectiu és mantenir un historial de versions net i un perfil de GitHub actiu.