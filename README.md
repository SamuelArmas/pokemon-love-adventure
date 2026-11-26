# Pokémon Love Adventure — Luis Fer (3 Años Juntos)

Página web interactiva de aniversario con estética unificada de videojuego **Pokémon (GBA / Nintendo DS)** y sprites pixel-art originales.

## Cómo abrirla

- Abre [index.html](./index.html) directamente en cualquier navegador (Chrome, Edge, Safari, móvil o PC).
- Todos los sprites de los Pokémon y objetos están guardados localmente en `assets/`, por lo que funciona incluso sin conexión.

## Cómo personalizar fotos, carta, playlist y misión

Tienes dos opciones muy sencillas:

### Opción 1 — Editor visual integrado (la más rápida)
1. Abre `index.html` en tu navegador.
2. Haz clic en el botón **`⚙ EDITAR`** (arriba a la derecha) o en **`📷 Subir / Cambiar Fotos`** en la Pokédex.
3. Sube las fotos de la pareja, edita el texto de la carta y pega los enlaces de Spotify / YouTube.
4. Haz clic en **`✓ Guardar cambios`** para verlos al instante, o en **`💾 Descargar data.js`** y reemplaza el archivo `data.js` de esta carpeta para que los cambios queden guardados permanentemente al publicar la página.

### Opción 2 — Editar `data.js` manualmente
1. Crea una carpeta `assets/photos/` y coloca tus fotos (por ejemplo `foto-1.jpg` a `foto-6.jpg`).
2. Abre `data.js` en Visual Studio Code y actualiza los campos `photo`, `letter`, `playlist` o `mission`.

## Publicar gratis para enviarlo por enlace
Arrastra esta carpeta completa (`index.html`, `styles.css`, `app.js`, `data.js` y `assets/`) a **Netlify Drop** (`https://app.netlify.com/drop`) o **GitHub Pages** para obtener un enlace público que Luis Fer pueda abrir directo desde su celular.
