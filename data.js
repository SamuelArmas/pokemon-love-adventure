/**
 * POKÉMON LOVE ADVENTURE — CONFIGURACIÓN EDITABLE
 * ------------------------------------------------
 * Puedes editar textos, fechas, fotos, canciones y recuerdos aquí directamente,
 * o usar el botón "Editar" (⚙️) dentro de la misma página web.
 *
 * Para usar tus fotos locales:
 * 1. Crea una carpeta "assets/photos" y coloca tus fotos (ej. foto-1.jpg ... foto-6.jpg).
 * 2. Escribe la ruta en el campo "photo" de cada recuerdo, por ejemplo: "assets/photos/foto-1.jpg".
 *    (También puedes subirlas directamente desde el editor visual de la página).
 */

window.DEFAULT_ADVENTURE_DATA = {
  meta: {
    trainerName: "Luis Fer",
    cardTrainerName: "Papatin",
    partnerTitle: "Tu entrenadora favorita",
    years: 3,
    editionLabel: "PLAYER 001 · ANNIVERSARY EDITION",
    heroTitle: "POKÉMON LOVE ADVENTURE",
    heroSubtitle: "3 YEARS OF US ♡",
    heroTagline: "Una aventura, dos entrenadores y muchísimas historias por vivir.",
    welcomeDialogue:
      "¡Hola, Luis Fer! Una nueva aventura está a punto de comenzar. Has desbloqueado una misión muy especial: celebrar tres años de aventuras, amor y momentos inolvidables."
  },

  team: [
    {
      id: 54,
      dex: "#054",
      name: "Psyduck",
      type: "AGUA",
      typeClass: "type-water",
      level: 3,
      hp: 100,
      role: "Guía de la Misión",
      sprite: "assets/sprites/54.png",
      quote:
        "¡Psy-ay-ay! Luis Fer, tengo una misión secreta enorme en la cabeza... ¡Baja a la sección Misión para descubrirla!"
    },
    {
      id: 1,
      dex: "#001",
      name: "Bulbasaur",
      type: "PLANTA",
      typeClass: "type-grass",
      level: 3,
      hp: 100,
      role: "Raíces de 3 años",
      sprite: "assets/sprites/1.png",
      quote:
        "¡Bulba-saur! Igual que una semilla bien cuidada, su amor ha crecido fuerte y hermoso durante estos 3 años."
    },
    {
      id: 4,
      dex: "#004",
      name: "Charmander",
      type: "FUEGO",
      typeClass: "type-fire",
      level: 3,
      hp: 100,
      role: "Chispa eterna",
      sprite: "assets/sprites/4.png",
      quote:
        "¡Char-mander! Esta llama jamás se apaga — ¡nos va a venir genial para el frío del Nevado de Toluca!"
    },
    {
      id: 725,
      dex: "#725",
      name: "Litten",
      type: "FUEGO",
      typeClass: "type-fire",
      level: 3,
      hp: 100,
      role: "Compañero fiel",
      sprite: "assets/sprites/725.png",
      quote:
        "¡Miau~! Aunque a veces me haga el serio, sé perfectamente que ustedes dos son el mejor equipo de toda la región."
    },
    {
      id: 143,
      dex: "#143",
      name: "Snorlax",
      type: "NORMAL",
      typeClass: "type-normal",
      level: 3,
      hp: 100,
      role: "Experto en abrazos",
      sprite: "assets/sprites/143.png",
      quote:
        "Zzz... Solo me despierto por comida rica, siestas juntos y para desearles ¡feliz 3er aniversario!"
    },
    {
      id: 104,
      dex: "#104",
      name: "Cubone",
      type: "TIERRA",
      typeClass: "type-ground",
      level: 3,
      hp: 100,
      role: "Guardián de recuerdos",
      sprite: "assets/sprites/104.png",
      quote:
        "¡Cu-bone! Guardo cada recuerdo valioso en la Pokédex. ¡Ábrela para revivir sus momentos favoritos!"
    }
  ],

  mission: {
    code: "MISIÓN LEGENDARIA #006",
    badge: "Sorpresa desbloqueada",
    title: "THE MOUNTAIN QUEST",
    headline: "¡Nos vamos de aventura!",
    destination: "Túneles del Nevado de Toluca",
    summary:
      "Has recibido una misión especial: explorar juntos los Túneles del Nevado de Toluca.",
    dateDisplay: "06 DICIEMBRE 2026",
    timeDisplay: "07:00 AM",
    isoDateTime: "2026-12-06T07:00:00-06:00",
    objectiveText:
      "Completar una nueva aventura juntos, explorar nuevos paisajes y crear otro recuerdo para nuestra colección.",
    rewardTitle: "Un día inolvidable juntos ❤️",
    rewardText:
      "Recompensa: un día inolvidable con tu entrenadora favorita. La mejor recompensa será vivir esta aventura contigo.",
    clues: [
      {
        id: "clue-1",
        label: "PISTA 01 · ALTITUD",
        icon: "🏔️",
        text: "Alista chamarra calientita y botas de senderismo: nos esperan paisajes de montaña, bosque y aire helado."
      },
      {
        id: "clue-2",
        label: "PISTA 02 · RUTA SECRETA",
        icon: "🧭",
        text: "No es un camino cualquiera... vamos a caminar entre senderos escondidos y túneles naturales rodeados de naturaleza."
      },
      {
        id: "clue-3",
        label: "PISTA 03 · COORDENADAS",
        icon: "⏰",
        text: "Marca tu PokéGear: Domingo 06 de diciembre de 2026, punto de partida a las 07:00 AM. ¡Psyduck ya preparó la mochila!"
      }
    ],
    objectives: [
      { id: "obj-1", text: "Preparar nuestro equipo de exploradores", done: true },
      { id: "obj-2", text: "Descubrir los túneles del Nevado", done: false },
      { id: "obj-3", text: "Disfrutar de los paisajes juntos", done: false },
      { id: "obj-4", text: "Crear un nuevo recuerdo de aniversario", done: false }
    ]
  },

  memories: [
    {
      id: "mem-1",
      entryNo: "#001",
      title: "Nuestro primer viaje",
      category: "AVENTURA",
      date: "Mapa Desbloqueado",
      pokemonId: 54,
      pokemonName: "Psyduck",
      photo: "",
      description:
        "Ese viaje que nos demostró que no importa a dónde vayamos: si estamos juntos, cada ruta se convierte en el mejor destino del mundo."
    },
    {
      id: "mem-2",
      entryNo: "#002",
      title: "Nuestra primera cita",
      category: "ORIGEN",
      date: "Inicio de la Partida",
      pokemonId: 1,
      pokemonName: "Bulbasaur",
      photo: "",
      description:
        "El día en que comenzó nuestra historia. Desde esa primera plática supe que quería vivir mil aventuras a tu lado."
    },
    {
      id: "mem-3",
      entryNo: "#003",
      title: "El momento en el que más nos reímos",
      category: "FELICIDAD",
      date: "Crítico de Risas",
      pokemonId: 4,
      pokemonName: "Charmander",
      photo: "",
      description:
        "De esas risas que te dejan sin aire y te duelen las mejillas. Contigo hasta el día más normal termina siendo inolvidable."
    },
    {
      id: "mem-4",
      entryNo: "#004",
      title: "Mi recuerdo favorito contigo",
      category: "LEGENDARIO",
      date: "Nivel Máximo",
      pokemonId: 725,
      pokemonName: "Litten",
      photo: "",
      description:
        "Un instante que guardo como un tesoro raro en mi corazón. Si pudiera pausar el tiempo, elegiría volver a abrazarte ahí."
    },
    {
      id: "mem-5",
      entryNo: "#005",
      title: "Un día que quisiera repetir",
      category: "NOSTALGIA",
      date: "Guardar Partida",
      pokemonId: 143,
      pokemonName: "Snorlax",
      photo: "",
      description:
        "Uno de esos días perfectos de principio a fin, con calma, cariño y la certeza de estar exactamente donde quiero estar."
    },
    {
      id: "mem-6",
      entryNo: "#006",
      title: "Nuestras fotografías favoritas",
      category: "COLECCIÓN",
      date: "3 Años Juntos",
      pokemonId: 104,
      pokemonName: "Cubone",
      photo: "",
      description:
        "Cada foto nuestra es una medalla ganada juntos: nuestras sonrisas, nuestros accesorios Pokémon y todo el amor que seguimos construyendo."
    }
  ],

  letter: {
    greeting: "A mi compañero de aventuras...",
    recipient: "Para: Luis Fer",
    dateLabel: "3er Aniversario · 2026",
    body: `Mi querido Luis Fer:

¡Ya son tres años juntos! Parece increíble pensar en todo lo que hemos vivido desde que empezó nuestra partida, y al mismo tiempo siento que cada día contigo me sigue sorprendiendo y haciendo igual de feliz que al principio.

Gracias por ser mi compañero favorito en cada ruta, por hacerme reír incluso en los días pesados, por escucharme, cuidarme y compartir conmigo tus gustos, tus sueños y tu manera tan bonita de ver la vida. Contigo he aprendido que la mejor aventura no depende del mapa, sino de con quién caminas.

Quise hacerte esta pequeña página inspirada en Pokémon porque sé cuánto te encanta este universo, y porque contigo me siento formando el mejor equipo de todos. Cada recuerdo que tenemos merece su propia entrada en nuestra Pokédex.

Y como todo gran aniversario necesita una nueva misión legendaria... ¡prepárate! El 6 de diciembre a las 7:00 AM nos vamos de hiking a los Túneles del Nevado de Toluca para sumar otro recuerdo inolvidable a nuestra historia.

Gracias por estos tres años tan bonitos. Te amo muchísimo y no puedo esperar por todos los niveles que nos faltan por desbloquear juntos.`,
    signature: "Con todo mi amor,\nTu compañera favorita ♡"
  },

  playlist: [
    {
      id: "track-1",
      category: "Nuestra canción",
      title: "Nuestra canción especial",
      artist: "Agrega aquí el título y artista",
      note: "La melodía que siempre me transporta directo a ti.",
      url: "https://open.spotify.com/",
      platform: "Spotify",
      duration: "03:42"
    },
    {
      id: "track-2",
      category: "Canciones que me recuerdan a ti",
      title: "Cada vez que suena, pienso en ti",
      artist: "Personalizable desde Editar",
      note: "Imposible escucharla sin sonreír acordándome de tus abrazos.",
      url: "https://open.spotify.com/",
      platform: "Spotify",
      duration: "04:05"
    },
    {
      id: "track-3",
      category: "Canciones para nuestros viajes",
      title: "Soundtrack camino al Nevado",
      artist: "Roadtrip Mix · Luis Fer & Tú",
      note: "Para cantar a todo pulmón rumbo a los Túneles del Nevado de Toluca.",
      url: "https://www.youtube.com/",
      platform: "YouTube",
      duration: "03:28"
    },
    {
      id: "track-4",
      category: "Canciones que quiero escuchar contigo",
      title: "Próxima canción para dedicar",
      artist: "Edita el enlace en ⚙️ Editar",
      note: "Para escuchar abrazados viendo el atardecer después de la caminata.",
      url: "https://open.spotify.com/",
      platform: "Spotify",
      duration: "03:54"
    }
  ],

  inventory: [
    {
      id: "item-masterball",
      name: "Master Ball",
      qty: "x01",
      tag: "OBJETO CLAVE",
      icon: "assets/items/master-ball.svg",
      description: "Un deseo que quiero cumplir contigo.",
      redeemMessage:
        "¡Luis Fer usó MASTER BALL! ♥ Vale oficial por un deseo 100% garantizado (tasa de éxito: 100%) que vamos a cumplir juntos."
    },
    {
      id: "item-potion",
      name: "Poción de amor",
      qty: "x∞",
      tag: "CURACIÓN",
      icon: "assets/items/potion.svg",
      description: "Un abrazo para los días difíciles.",
      redeemMessage:
        "¡Luis Fer usó POCIÓN DE AMOR! ♥ Tus PS de ánimo subieron al máximo. Canjeable por un abrazo gigante cuando quieras."
    },
    {
      id: "item-candy",
      name: "Caramelo raro",
      qty: "x01",
      tag: "SUBIR NIVEL",
      icon: "assets/items/rare-candy.svg",
      description: "Un día especial elegido por ti.",
      redeemMessage:
        "¡Luis Fer subió de nivel! ★ Vale por un día entero planeado 100% a tu gusto: comida, plan, peli o aventura."
    },
    {
      id: "item-heartscale",
      name: "Heart Scale",
      qty: "x03",
      tag: "TESORO RARO",
      icon: "assets/items/heart-scale.svg",
      description: "Un recuerdo que siempre guardaré.",
      redeemMessage:
        "¡Brilla una HEART SCALE! ♡ Tres escamas por nuestros tres años juntos — cada recuerdo contigo es irrepetible."
    }
  ],

  finale: {
    badge: "NIVEL 03 COMPLETADO",
    title: "El siguiente nivel: nuestra próxima aventura",
    text: "Tres años han pasado, pero todavía nos quedan muchísimos mapas por explorar, Pokémon por descubrir y aventuras por vivir. ¿Estás listo para continuar esta partida conmigo?",
    ctaLabel: "CONTINUAR JUGANDO JUNTOS ♡",
    savedMessage:
      "¡PARTIDA GUARDADA CON ÉXITO! ♥ Luis Fer & Tú avanzan al Nivel 4... Próxima parada: Túneles del Nevado de Toluca (06 DIC 2026 · 07:00 AM)."
  }
};
