export const SPANISH_DOCUMENTATION_LABELS = {
  contents: "En esta guía",
  quickStart: "Un punto de partida fiable",
  fieldNotes: "Notas de estudio",
  quickStartEyebrow: "Inicio rápido",
  fieldNotesEyebrow: "Ten en cuenta",
  liveExample: "Ejemplo en vivo",
};

export const SPANISH_TOOL_DOCUMENTATION = {
  delay: {
    slug: "delay-reverb",
    eyebrow: "Guía práctica · 6 min",
    title: "Haz que los efectos de tiempo trabajen para el groove",
    intro:
      "La sincronización con el tempo es más útil cuando convierte un valor técnico en una decisión musical. Usa la calculadora para establecer una cuadrícula y después moldea la profundidad, el movimiento y la claridad mientras suena la mezcla completa.",
    quickStart: [
      {
        title: "Iguala el tempo de la sesión",
        body: "Introduce el BPM exacto de tu DAW. Si la canción contiene automatización de tempo, calcula valores para cada sección importante.",
      },
      {
        title: "Elige una función rítmica",
        body: "Las notas normales se sienten firmes, las notas con puntillo crean síncopa hacia delante y los tresillos añaden una respuesta fluida o con shuffle.",
      },
      {
        title: "Ajusta el valor y después escucha",
        body: "Copia los milisegundos o hercios en el plug-in. Ajusta el envío, el feedback, el filtrado y el decay dentro del contexto, no en solo.",
      },
    ],
    liveTitle: "Qué significa el tempo actual",
    liveDescription:
      "El ejemplo siguiente responde al control de BPM superior. Muestra la relación entre un pulso, un delay sincopado y el objetivo de una habitación compacta.",
    liveLabels: {
      beat: "Negra",
      dotted: "Corchea con puntillo",
      preDelay: "Pre-delay de habitación pequeña",
      decay: "Decay de habitación pequeña",
    },
    chapters: [
      {
        kicker: "La cuadrícula musical",
        title: "Valores normales, con puntillo y de tresillo",
        paragraphs: [
          "Una negra dura un pulso. Todas las demás subdivisiones derivan de la duración de ese pulso, por lo que la misma relación rítmica se mantiene a cualquier tempo.",
          "Los valores con puntillo duran 1,5 veces el valor normal. Los tresillos duran dos tercios. Ese sencillo cambio aleja la repetición de la cuadrícula recta y modifica el impulso percibido sin cambiar el BPM.",
        ],
        formula: "ms de una negra = 60.000 ÷ BPM",
        bullets: [
          "1/4 o 1/8 normal: ecos estables, capas slap y refuerzo rítmico predecible.",
          "1/8 con puntillo: un patrón clásico a contratiempo que se mantiene activo entre los pulsos de negra.",
          "Tresillo de 1/8 o 1/4: repeticiones fluidas apropiadas para swing, shuffle y movimientos de tres contra dos.",
          "Hercios: útiles para sincronizar con el tempo la velocidad de un LFO, trémolo, auto-pan, chorus o modulación de filtro.",
        ],
      },
      {
        kicker: "Anatomía de la reverb",
        title: "Pre-delay, decay y tiempo total",
        paragraphs: [
          "El pre-delay es el espacio entre el sonido seco y el comienzo de la reverb. Una pequeña separación puede proteger una consonante vocal, el transiente de una caja o el ataque de un lead sin dejar de situarlo en un espacio.",
          "El total sugerido es un objetivo musical alineado con un valor de nota. auroLab resta el pre-delay de ese objetivo para producir el valor de decay que aparece en la tabla.",
        ],
        formula: "decay = total alineado al tempo − pre-delay",
        bullets: [
          "Un pre-delay corto integra la fuente en la habitación y puede llevarla más hacia el fondo.",
          "Un pre-delay más largo mantiene la fuente seca al frente, pero en exceso puede sonar como un eco separado.",
          "RT60 describe tradicionalmente una caída de 60 dB en un espacio acústico. Los controles de decay de los plug-ins no siempre corresponden exactamente a RT60.",
        ],
      },
      {
        kicker: "Recetas iniciales",
        title: "Convierte la tabla en una decisión de mezcla",
        paragraphs: [
          "Para una voz principal, prueba una subdivisión muy corta como pre-delay y una cola de blanca o redonda. Aumenta el pre-delay si las palabras pierden definición; acorta la cola o filtra el retorno si las frases se solapan.",
          "Para la batería, un ambiente de negra puede añadir tamaño sin llenar todos los huecos. Deja que la cola de la caja se acerque al siguiente contratiempo y después acórtala ligeramente para que el groove respire.",
        ],
        bullets: [
          "Anchura: desplaza los delays izquierdo y derecho con valores de nota relacionados en lugar de duplicar el mismo tap.",
          "Movimiento: automatiza el feedback o el nivel de envío al final de las frases en vez de mantener un delay denso de forma constante.",
          "Profundidad: mantén clara la señal seca y deja detrás repeticiones más oscuras y suaves; las repeticiones brillantes suelen sentirse más cerca.",
          "Cohesión: un único envío de habitación compartido puede situar varios instrumentos en el mismo espacio imaginado.",
        ],
      },
      {
        kicker: "Solución de problemas",
        title: "Cuando un valor matemáticamente correcto suena mal",
        paragraphs: [
          "Alinear el tempo no garantiza un arreglo limpio. La envolvente de la fuente, la densidad de interpretación, el feedback, la posición estéreo y el balance espectral cambian la duración percibida de un efecto.",
        ],
        bullets: [
          "Turbio o saturado: reduce el envío, acorta el decay, baja el feedback y aplica un filtro pasa-altos al retorno húmedo.",
          "Separado de la fuente: acorta el pre-delay o elige una subdivisión menor.",
          "Demasiado estático: combina subdivisiones relacionadas, panea los taps o automatiza solo la última palabra o golpe.",
          "Demasiado evidente: oscurece las repeticiones, reduce el feedback o cambia el tiempo con puntillo/tresillo por un valor recto.",
          "Si aún no funciona: desactiva la sincronización y ajusta de oído. La intención musical está por encima de la cuadrícula.",
        ],
      },
    ],
    fieldNotes: [
      {
        label: "Empieza con sutileza",
        text: "El nivel suele revelar el tiempo correcto antes que añadir más repeticiones.",
      },
      {
        label: "Evalúa en contexto",
        text: "Una cola hermosa en solo puede enmascarar la frase siguiente cuando vuelve el arreglo.",
      },
      {
        label: "Consolida la decisión",
        text: "Confirma o automatiza el efecto cuando favorezca la sección; evita buscar presets sin fin.",
      },
    ],
  },

  metronome: {
    slug: "metronome",
    eyebrow: "Guía de práctica · 4 min",
    title: "Construye un tiempo que puedas sentir, no solo seguir",
    intro:
      "Un metrónomo es una referencia, no una interpretación. Usa el clic para descubrir ataques adelantados, finales atrasados y subdivisiones inestables; después haz que la referencia sea cada vez menos intrusiva.",
    quickStart: [
      {
        title: "Elige un tempo realista",
        body: "Empieza lo bastante lento como para oír con claridad cada ataque. Las repeticiones limpias a 70 BPM son más útiles que las repeticiones tensas a 120 BPM.",
      },
      {
        title: "Configura el compás",
        body: "Elige el número de pulsos de negra. El primer clic más brillante marca el inicio del compás y las luces numeradas muestran tu posición.",
      },
      {
        title: "Reduce la dependencia",
        body: "Cuando el pulso sea estable, baja el clic o haz que represente pulsos más grandes para que tus subdivisiones internas asuman más trabajo.",
      },
    ],
    chapters: [
      {
        kicker: "Lectura de la herramienta",
        title: "Pulso, compás y primer tiempo",
        paragraphs: [
          "El BPM cuenta pulsos de negra por minuto. El control Pulsos agrupa esos pulsos en un compás y el pulso 1 recibe un acento más agudo para que puedas orientar la frase sin mirar la pantalla.",
          "El indicador visual ayuda a orientarse; el clic de audio debe seguir siendo la referencia principal porque la actualización de pantalla y la salida de audio recorren caminos distintos.",
        ],
        formula: "segundos por pulso = 60 ÷ BPM",
      },
      {
        kicker: "Diseño de la práctica",
        title: "Tres ejercicios para mejorar el tiempo interno",
        bullets: [
          "Escalera de tempo: toca un pasaje corto perfectamente tres veces y después añade 2–4 BPM. Retrocede en cuanto cambie la articulación.",
          "Cambio de subdivisión: conserva un BPM mientras alternas entre negras, corcheas, tresillos y semicorcheas.",
          "Clic espaciado: divide a la mitad el BPM mostrado y siente cada clic como los pulsos 2 y 4 o como el inicio de una frase más larga.",
          "Graba y revisa: la forma de onda suele mostrar adelantos y atrasos con más sinceridad que la sensación durante la interpretación.",
        ],
      },
      {
        kicker: "Precisión",
        title: "Por qué el clic utiliza el reloj de audio",
        paragraphs: [
          "auroLab programa los clics ligeramente por adelantado en el reloj de Web Audio. Así el sonido se mantiene más estable que si cada clic se disparara directamente desde un temporizador visual, cuyas llamadas pueden retrasarse por el trabajo del navegador.",
          "La interfaz puede sentirse desfasada si un dispositivo añade latencia de salida. Los auriculares Bluetooth son un ejemplo habitual: el pulso puede seguir estable aunque llegue después que la animación en pantalla.",
        ],
      },
      {
        kicker: "Flujo de sesión",
        title: "Usa los controles sin perder la concentración",
        bullets: [
          "Espacio inicia o pausa; Escape detiene y devuelve el indicador de pulso al reposo.",
          "Las flechas o +/− cambian el BPM de uno en uno. Mantén Mayús para saltos de diez.",
          "Tap estima un nuevo tempo desde tu pulso físico sin salir de esta sección.",
          "Mantén el volumen solo lo bastante alto para localizar el pulso. Un clic dominante oculta tu propio tiempo y dinámica.",
        ],
      },
    ],
    fieldNotes: [
      {
        label: "Relájate primero",
        text: "Si aumenta la tensión, baja el tempo antes de convertir el error en memoria muscular.",
      },
      {
        label: "Cuenta en voz alta",
        text: "Nombrar las subdivisiones conecta el movimiento físico con una cuadrícula interna fiable.",
      },
      {
        label: "Deja espacio",
        text: "Practica los silencios y finales de nota: el clic examina el silencio tanto como el ataque.",
      },
    ],
  },

  tap: {
    slug: "tap-tempo",
    eyebrow: "Guía de medición · 4 min",
    title: "Convierte un pulso físico en un tempo fiable",
    intro:
      "Tap Tempo mide el tiempo entre tus taps. Una serie más larga y estable proporciona al estimador suficiente contexto para rechazar taps accidentales y distinguir el pulso que buscas.",
    quickStart: [
      {
        title: "Encuentra el pulso más fuerte",
        body: "Sigue el bombo, la caja, el patrón de rasgueo u otro evento repetitivo. No cambies de referencia a mitad del proceso.",
      },
      {
        title: "Haz entre 8 y 16 taps",
        body: "Usa el botón, T o Espacio con una intensidad relajada y constante. Ignora la primera lectura y deja que se estabilice.",
      },
      {
        title: "Resuelve la octava",
        body: "Si el resultado parece el doble o la mitad del tempo esperado, usa ÷2 o ×2. Ambas lecturas pueden describir el mismo pulso subyacente.",
      },
    ],
    chapters: [
      {
        kicker: "Bajo el capó",
        title: "Cómo se calcula el tempo",
        paragraphs: [
          "Cada pareja de taps crea un intervalo en milisegundos. auroLab convierte el intervalo representativo en BPM y actualiza el resultado a medida que llegan más taps.",
          "El estimador utiliza la mediana y la desviación absoluta mediana para rechazar intervalos inusualmente adelantados o atrasados antes de calcular el promedio. Así, un tap imperfecto resulta menos destructivo sin fingir que una serie irregular es estable.",
        ],
        formula: "BPM = 60.000 ÷ intervalo representativo en ms",
      },
      {
        kicker: "Una entrada mejor",
        title: "Haz tap con precisión",
        bullets: [
          "Escucha dos o tres pulsos antes del primer tap para que tu mano ya conozca el pulso.",
          "Usa un dedo o una tecla y mantén pequeño el movimiento; los gestos amplios añaden variación temporal.",
          "Si la música tiene una introducción débil, mide un estribillo o una sección guiada por la batería.",
          "Reinicia tras un cambio de tempo. Mezclar dos secciones produce un promedio que quizá no describa ninguna de ellas.",
        ],
      },
      {
        kicker: "Interpretación",
        title: "Half-time, double-time y estabilidad",
        paragraphs: [
          "Un groove puede percibirse en varios niveles métricos. Un pulso en half-time a 70 BPM y otro en double-time a 140 BPM comparten el mismo espaciado general, por lo que una herramienta de Tap Tempo no puede decidir qué notación necesita tu proyecto.",
          "La estabilidad describe la regularidad entre los intervalos aceptados, no la confianza en que el nivel métrico elegido sea correcto. Un resultado muy estable de 70 BPM aún puede necesitar el botón ×2 para una sesión a 140 BPM.",
        ],
      },
      {
        kicker: "Controles",
        title: "Reinicio automático y sonido de respuesta",
        paragraphs: [
          "El reinicio automático comienza una serie nueva después de una pausa larga e impide que una medición anterior contamine la siguiente. Elige un tiempo de reinicio más largo para música lenta o si sueles dejar más espacio.",
          "El sonido de respuesta confirma cada tap registrado, pero es opcional. Desactívalo cuando compita con el audio que estás midiendo.",
        ],
      },
    ],
    fieldNotes: [
      {
        label: "Espera a tener contexto",
        text: "Un intervalo es solo una suposición; varios intervalos constantes forman una medición útil.",
      },
      {
        label: "Observa la tendencia",
        text: "Un BPM que deriva suele indicar que la propia fuente respira o que tu referencia de pulso está cambiando.",
      },
      {
        label: "Verifica en el DAW",
        text: "Sitúa marcadores de cuadrícula sobre los transientes antes de confirmar una grabación de tempo fijo.",
      },
    ],
  },

  detector: {
    slug: "bpm-key-detector",
    eyebrow: "Guía de análisis · 6 min",
    title: "Interpreta una estimación como un ingeniero",
    intro:
      "El análisis automático es una segunda opinión rápida, no una autoridad. Usa en conjunto el resultado principal, la confianza, las alternativas y el croma, y verifica la decisión con la música antes de cambiar una sesión o una mezcla armónica.",
    quickStart: [
      {
        title: "Elige un archivo representativo",
        body: "Usa una exportación limpia y completa o una sección con ritmo y armonía claros. Los silencios largos y las introducciones ruidosas debilitan la evidencia.",
      },
      {
        title: "Mira más allá del resultado principal",
        body: "Compara la confianza y las alternativas. Una alternativa cercana indica que conviene verificar el half-time/double-time o una tonalidad relativa/paralela.",
      },
      {
        title: "Confirma musicalmente",
        body: "Cuenta con un metrónomo, alinea los transientes con una cuadrícula y toca la tónica y escala propuestas sobre una sección estable.",
      },
    ],
    chapters: [
      {
        kicker: "Privacidad y procesamiento",
        title: "Tu audio permanece en este navegador",
        paragraphs: [
          "El archivo seleccionado se decodifica con Web Audio y se analiza en la memoria de tu dispositivo. auroLab no sube el archivo para analizar el BPM o la tonalidad.",
          "Los archivos grandes o muy comprimidos pueden tardar más en decodificarse. La compatibilidad de códecs varía entre navegadores, por lo que convertir una fuente no compatible a WAV puede ser la alternativa más fiable.",
        ],
      },
      {
        kicker: "Estimación del tempo",
        title: "De los transientes a los candidatos de BPM",
        paragraphs: [
          "El analizador remuestrea la señal mono a 44,1 kHz y ejecuta el seguidor de pulso multifeature de Essentia. Cinco representaciones rítmicas complementarias acuerdan las posiciones de los pulsos y un tempo entre 40 y 208 BPM. El BPM final se refina con el intervalo acumulado de pulsos para eliminar pequeñas variaciones de transientes entre mezclas de una misma producción.",
          "Este enfoque funciona mejor cuando el ritmo produce ataques claros. Los pads, las interpretaciones rubato, la síncopa extrema y las pistas con tempo variable pueden generar varios candidatos plausibles.",
        ],
        bullets: [
          "Los errores de half-time/double-time son normales: 75 y 150 BPM pueden explicar patrones de acento relacionados.",
          "Las alternativas son evidencia útil, no respuestas fallidas. Compáralas con las líneas de compás en el DAW.",
          "Una confianza baja significa que el candidato principal no se separó claramente de las siguientes opciones.",
        ],
      },
      {
        kicker: "Estimación de tonalidad",
        title: "Croma, perfiles tonales y Camelot",
        paragraphs: [
          "Essentia mide primero la afinación de la pista y después construye un perfil armónico de clases de altura de 36 bins. Varios perfiles especializados en pop, electrónica y música tonal votan sobre la pista completa y tres secciones temporales.",
          "El gráfico de croma muestra evidencia de toda la pista, no una transcripción de acordes. La notación Camelot traduce la tonalidad detectada a un código compacto que se usa habitualmente para comparar pistas relacionadas armónicamente.",
        ],
        bullets: [
          "Una tonalidad mayor y su relativa menor comparten muchas notas, por lo que las canciones ambiguas pueden obtener resultados cercanos en ambas.",
          "El material modal, atonal, muy desafinado o con cambios de tonalidad puede no encajar en una única etiqueta mayor/menor.",
          "Una nota de bajo dominante o una introducción larga pueden sesgar el croma global. Revisa una sección armónicamente estable cuando sea posible.",
        ],
      },
      {
        kicker: "Calidad de la decisión",
        title: "Qué significa la confianza y qué no",
        paragraphs: [
          "La confianza es la separación entre la mejor puntuación interna y las puntuaciones competidoras. Sirve para comparar los candidatos de este analizador, pero no es una probabilidad calibrada de que la etiqueta sea correcta.",
          "Interpreta un resultado sólido como permiso para verificar rápidamente, no para omitir la verificación. Para mastering, preparación de DJ, autorización de samples o trabajo musicológico, confirma con una cuadrícula de DAW y un instrumento o un segundo método de análisis.",
        ],
      },
    ],
    fieldNotes: [
      {
        label: "Usa evidencia limpia",
        text: "Las secciones percusivas ayudan al tempo; las secciones sostenidas y armónicamente estables ayudan a la tonalidad.",
      },
      {
        label: "Comprueba las alternativas",
        text: "La segunda opción suele revelar half-time o un centro tonal estrechamente relacionado.",
      },
      {
        label: "Confía en tu prueba",
        text: "Si la tónica propuesta choca constantemente, la etiqueta no es útil, diga lo que diga la puntuación.",
      },
    ],
  },

  camelot: {
    slug: "camelot-wheel",
    eyebrow: "Guía de mezcla · 5 min",
    title: "Muévete por la rueda como por un reloj",
    intro:
      "La rueda Camelot lleva el círculo de quintas a una esfera de reloj para convertir la compatibilidad tonal en aritmética sencilla. Úsala como filtro rápido de pistas candidatas y deja que tus oídos tomen la decisión final.",
    quickStart: [
      {
        title: "Identifica la tonalidad actual",
        body: "Detecta o confirma la tonalidad de la pista que suena y selecciona su código en la rueda. El detector de BPM y tonalidad muestra directamente los códigos Camelot.",
      },
      {
        title: "Preselecciona las vecinas",
        body: "Los segmentos resaltados —el mismo código, una hora arriba o abajo y la pareja relativa A/B— comparten la mayoría de sus notas con tu selección.",
      },
      {
        title: "Escucha antes de confirmar",
        body: "La compatibilidad describe escalas, no arreglos. Preescucha la mezcla: dos melodías que chocan pueden arruinar una combinación perfecta en teoría.",
      },
    ],
    chapters: [
      {
        kicker: "El sistema",
        title: "Una esfera de reloj construida con quintas",
        paragraphs: [
          "Cada paso de una hora en la rueda avanza siete semitonos —una quinta justa—, por lo que los códigos adyacentes comparten seis de las siete notas de su escala. Por eso moverse una hora en cualquier dirección suele sonar fluido.",
          "El anillo B exterior contiene las tonalidades mayores y el anillo A interior sus relativas menores. Los códigos con el mismo número usan exactamente las mismas notas; solo cambia el centro tonal.",
        ],
        formula: "una hora = una quinta justa = una alteración modificada",
      },
      {
        kicker: "Movimientos esenciales",
        title: "Las cuatro transiciones de bajo riesgo",
        bullets: [
          "Mismo código: escala idéntica, la mezcla más segura posible.",
          "Una hora en sentido horario: eleva la energía percibida y conserva seis notas compartidas.",
          "Una hora en sentido antihorario: relaja la sala sin un choque tonal audible.",
          "Cambio de letra (8A a 8B): cambia entre el carácter menor y mayor sobre las mismas notas.",
        ],
      },
      {
        kicker: "Movimientos avanzados",
        title: "Impulsos de energía y riesgos calculados",
        paragraphs: [
          "Saltar dos horas en sentido horario eleva el centro tonal un tono completo y se percibe como un claro aumento de energía. Se comparten menos notas, así que funciona mejor en secciones con mucha percusión o en transiciones rápidas.",
        ],
        bullets: [
          "Dos horas más: subida fuerte; mézclala durante un breakdown o sobre la batería.",
          "Movimientos diagonales (8A a 9B): combinan un cambio de energía con uno de carácter; escúchalos con cuidado.",
          "Tonalidades paralelas (8B C mayor a 5A C menor): misma tónica, color distinto; eficaz pero expuesto.",
        ],
      },
      {
        kicker: "Comprobación práctica",
        title: "Cuando la rueda se equivoca",
        paragraphs: [
          "La detección de tonalidad es una estimación y muchas pistas se desplazan entre centros tonales o usan escalas modales que no encajan en un único código. Si una mezcla suena bien, está bien: la rueda es una herramienta de planificación, no un reglamento.",
        ],
        bullets: [
          "Verifica las tonalidades detectadas en secciones sostenidas y armónicas antes de confiar en un código.",
          "Los pasajes percusivos o atonales se mezclan libremente; las reglas armónicas apenas se aplican a ellos.",
          "El bloqueo de tono y el pitch shifting cambian la tonalidad que suena; vuelve a calcular después de cambiar la afinación.",
        ],
      },
    ],
    fieldNotes: [
      {
        label: "Planifica por parejas",
        text: "Prepara dos opciones por transición —una en la misma tonalidad y un movimiento de energía— para que la sala decida.",
      },
      {
        label: "Etiqueta tu biblioteca",
        text: "Guarda los códigos Camelot en los metadatos de tus pistas para filtrar candidatos al instante mientras actúas.",
      },
      {
        label: "El oído supera a las matemáticas",
        text: "Una melodía que choca rompe una pareja compatible; una gran mezcla puede justificar una combinación prohibida.",
      },
    ],
  },

  notefreq: {
    slug: "note-frequency-midi",
    eyebrow: "Guía de referencia · 4 min",
    title: "Una altura, tres lenguajes",
    intro:
      "Los músicos nombran alturas, los sintetizadores cuentan notas MIDI y los analizadores miden hercios. Este conversor mantiene sincronizadas las tres vistas bajo una referencia A4 ajustable para que un valor de cualquier fuente pueda utilizarse en todas partes.",
    quickStart: [
      {
        title: "Confirma la referencia",
        body: "La mayoría del material moderno usa A4 = 440 Hz. Cambia la referencia solo si la sesión o el conjunto tienen una afinación diferente.",
      },
      {
        title: "Introduce lo que sabes",
        body: "Elige una nota y octava, escribe una frecuencia o introduce un número MIDI. Las demás representaciones se actualizan de inmediato.",
      },
      {
        title: "Lee la desviación en cents",
        body: "Una frecuencia medida rara vez coincide exactamente con una nota. La desviación muestra a qué distancia está el valor de la altura temperada más cercana.",
      },
    ],
    chapters: [
      {
        kicker: "Las matemáticas",
        title: "El temperamento igual en una línea",
        paragraphs: [
          "El temperamento igual divide cada octava en doce proporciones idénticas. Cada semitono multiplica la frecuencia por la raíz duodécima de dos y cada octava la duplica.",
          "Los números MIDI simplemente cuentan esos semitonos: A4 es la nota 69, el C central es la nota 60 y el rango completo va de 0 (C-1, unos 8,2 Hz) a 127 (G9, por encima de 12,5 kHz).",
        ],
        formula: "f = A4 × 2^((n − 69) ÷ 12)",
      },
      {
        kicker: "Estándares de afinación",
        title: "Por qué A4 es ajustable",
        bullets: [
          "440 Hz: el estándar moderno para música grabada y electrónica.",
          "441–443 Hz: elecciones orquestales habituales para un sonido de conjunto ligeramente más brillante.",
          "432 Hz: una referencia alternativa popular; las matemáticas son idénticas, solo cambia el punto de anclaje.",
          "415 Hz: una altura barroca frecuente, aproximadamente un semitono por debajo de la afinación moderna.",
        ],
      },
      {
        kicker: "Convenciones de octava",
        title: "El C central no siempre se llama C4",
        paragraphs: [
          "Esta herramienta sigue la convención científica, donde el C central (MIDI 60) es C4. Algunos DAW y fabricantes llaman C3 o C5 a la misma nota, así que un desacuerdo de octava entre programas es una diferencia de nombre, no de altura.",
          "Al intercambiar notas entre entornos, confía en el número MIDI o en la frecuencia: no son ambiguos.",
        ],
      },
      {
        kicker: "Usos en el estudio",
        title: "Dónde ayudan los números en una mezcla",
        bullets: [
          "Afina bombos y 808: encuentra la fundamental de la tónica de tu tonalidad y ajusta el sample a ella.",
          "EQ quirúrgica: convierte una nota resonante a hercios antes de cortar o realzar.",
          "Diseño sonoro: ajusta osciladores, filtros y resonadores por frecuencia exacta en vez de barrer a ciegas.",
          "Decisiones de subgrave: las alturas por debajo de E1 (41 Hz) viven principalmente en el subwoofer; organiza las líneas de bajo en consecuencia.",
        ],
      },
    ],
    fieldNotes: [
      {
        label: "Los cents son pequeños",
        text: "Un cent es la centésima parte de un semitono; las desviaciones inferiores a unos cinco cents rara vez se oyen en contexto.",
      },
      {
        label: "Primero las fundamentales",
        text: "Las decisiones de EQ apuntan a la fundamental, pero el timbre vive en los armónicos; explora también por encima de la raíz.",
      },
      {
        label: "Comprueba el anclaje",
        text: "Si un instrumento aparece constantemente alto o bajo, verifica la referencia A4 antes de volver a afinarlo todo.",
      },
    ],
  },
};
