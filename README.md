# auroLab

Herramientas gratuitas de producción musical.

[Abrir auroLab](https://aurolab.dhreian.com)

## Descripción

auroLab reúne seis herramientas prácticas para productores, músicos y DJs en una aplicación web
adaptable. Está construida como un sitio estático con Astro y una interfaz en React. No requiere
cuenta.

Todos los cálculos se realizan en el dispositivo del usuario. El audio seleccionado para detectar
BPM y tonalidad se decodifica y analiza en memoria: nunca se sube, almacena remotamente ni envía a
un servicio externo de procesamiento.

## Herramientas

| Herramienta            | Descripción                                                                                                                                                          |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Delay & Reverb**     | Calcula tiempos sincronizados al BPM para subdivisiones normales, con puntillo y tresillo, y propone valores de pre-delay, decay y duración total.                   |
| **Metronome**          | Reproduce un clic estable con acento de compás, agrupaciones configurables, tap tempo, control de volumen, indicador visual y atajos de teclado.                     |
| **Tap Tempo**          | Calcula el BPM a partir de tus pulsaciones, filtra variaciones atípicas, mide la estabilidad y permite alternar entre half-time y double-time.                       |
| **BPM & Key Detector** | Analiza archivos de audio localmente para estimar BPM y tonalidad, mostrando confianza, resultados alternativos, código Camelot y distribución de energía cromática. |
| **Camelot Wheel**      | Explora tonalidades compatibles para mezcla armónica, identifica cambios de energía y permite alternar la notación entre sostenidos y bemoles.                       |
| **Note & Frequency**   | Convierte al instante entre nota, frecuencia y número MIDI, con referencia A4 configurable, desviación en cents, periodo, longitud de onda y tabla por octava.       |

Cada herramienta incluye además una guía de uso.

## Privacidad y análisis local de audio

El BPM & Key Detector utiliza el siguiente flujo, ejecutado únicamente en el navegador:

1. `File.arrayBuffer()` lee localmente el archivo seleccionado.
2. `AudioContext.decodeAudioData()` lo decodifica con los códecs disponibles en el navegador.
3. Los canales se mezclan a mono y se remuestrean a 44,1 kHz en memoria.
4. Un Web Worker ejecuta Essentia.js/WebAssembly para analizar el pulso mediante múltiples
   características y detectar la tonalidad mediante HPCP con corrección de afinación.
5. Solo el resultado calculado vuelve a la interfaz; el worker y los datos temporales del análisis
   se descartan.

El analizador se carga dinámicamente la primera vez que se necesita. De esta forma, el decodificador
y el motor de análisis no forman parte del paquete inicial de la aplicación. Los formatos
compatibles dependen del navegador y del sistema operativo; se aceptan archivos comunes WAV, MP3,
FLAC, AAC, AIFF, M4A, Ogg, Opus y WebM siempre que el navegador pueda decodificarlos.

Los resultados de BPM y tonalidad son estimaciones. Las pistas con cambios de tempo o tonalidad,
transientes débiles, rubato, afinación inusual o armonía ambigua pueden requerir una comprobación
manual.

## Arquitectura de la aplicación

Astro genera previamente una página indexable para el inicio y para cada herramienta. Todas las
rutas hidratan la misma isla de React, `AuroLabApp`, mediante `client:load`. A partir de ahí, la
navegación del cliente utiliza History API para cambiar de herramienta sin recargar la página
completa.

- Los cálculos musicales deterministas están en `src/lib/musicMath.js`.
- Los ciclos de vida del navegador y Web Audio están en los componentes de cada herramienta, los
  hooks y `src/lib/webAudio.js`.
- Cada herramienta está aislada en su propio módulo dentro de `src/features/`.
- Los controles genéricos y reutilizables están en `src/components/ui/`.
- El texto canónico de la interfaz está en inglés y las pruebas comprueban que el catálogo en
  español mantenga la misma cobertura.
- Las fuentes, los iconos y los recursos utilizados en tiempo de ejecución se distribuyen
  localmente.
- El CSS se divide en capas ordenadas para fundamentos, layout, herramientas, documentación y
  comportamiento adaptable.

La interfaz permite operar con teclado, muestra estados de foco visibles, se adapta a distintos
tamaños de pantalla y respeta las preferencias de movimiento reducido. Cuando Web Audio no está
disponible, las funciones afectadas ofrecen un modo visual o conservan los cálculos que no requieren
audio.

## Rutas y SEO

| Ruta                    | Vista              |
| ----------------------- | ------------------ |
| `/`                     | Inicio             |
| `/delay-reverb/`        | Delay & Reverb     |
| `/metronome/`           | Metronome          |
| `/tap-tempo/`           | Tap Tempo          |
| `/bpm-key-detector/`    | BPM & Key Detector |
| `/camelot-wheel/`       | Camelot Wheel      |
| `/note-frequency-midi/` | Note & Frequency   |

Las rutas utilizan barra final y se generan desde `src/lib/seo.js`. Cada página incluye título,
descripción, URL canónica, metadatos para Open Graph y Twitter, y datos estructurados Schema.org en
formato JSON-LD. Las mismas definiciones alimentan `robots.txt` y el sitemap XML.

## Tecnologías

- [Astro 7](https://astro.build/) para generación estática, rutas y metadatos.
- [React 19](https://react.dev/) para la aplicación interactiva.
- JavaScript con módulos ES.
- Web Audio API y Web Workers para síntesis y procesamiento local de audio.
- [Essentia.js](https://mtg.github.io/essentia.js/) y WebAssembly para analizar BPM y tonalidad.
- CSS nativo con variables de diseño compartidas y capas adaptables.
- Iconos de Font Awesome y fuentes de Fontsource distribuidas localmente.
- Node.js Test Runner, Astro Check, TypeScript y Prettier para validación.

## Estructura del proyecto

```text
auroLab/
├── public/                         # Logo y manifiesto de la aplicación web
├── src/
│   ├── components/
│   │   ├── app/                    # Aplicación raíz de React
│   │   ├── layout/                 # Navegación y estructura persistente
│   │   └── ui/                     # Controles reutilizables de interfaz
│   ├── config/                     # Configuración de navegación
│   ├── features/                   # Un módulo independiente por herramienta
│   ├── hooks/                      # Navegación, idioma y capacidades del navegador
│   ├── layouts/                    # Documento Astro, metadatos y JSON-LD
│   ├── lib/                        # Matemática musical, análisis, textos, guías y SEO
│   ├── pages/                      # Rutas estáticas, robots.txt y sitemap
│   └── styles/                     # Capas ordenadas de CSS
├── tests/                          # Pruebas de matemática, análisis y traducciones
├── AGENTS.md                       # Convenciones de desarrollo del repositorio
├── astro.config.mjs
├── package.json
└── tsconfig.json
```

## Requisitos

- Node.js 24.x.
- npm.
- Un navegador moderno compatible con Web Audio API para reproducir y analizar audio.

El proyecto autoriza exclusivamente el script de instalación de `esbuild@0.28.1`, requerido por
la cadena de compilación de Astro. La aprobación está fijada a esa versión en `package.json`; si la
dependencia cambia, revisa el nuevo script antes de actualizar `allowScripts`.

## Desarrollo local

```bash
git clone https://github.com/dhreDev/auroLab.git
cd auroLab
npm ci
npm run dev
```

## Scripts

| Comando                | Función                                                                             |
| ---------------------- | ----------------------------------------------------------------------------------- |
| `npm run dev`          | Inicia el servidor de desarrollo de Astro.                                          |
| `npm run build`        | Genera el sitio estático de producción en `dist/`.                                  |
| `npm run preview`      | Sirve localmente la compilación de producción.                                      |
| `npm run check`        | Ejecuta los diagnósticos de Astro y TypeScript.                                     |
| `npm test`             | Ejecuta las pruebas deterministas de dominio, análisis de audio y traducciones.     |
| `npm run format`       | Formatea el repositorio con Prettier.                                               |
| `npm run format:check` | Comprueba el formato sin modificar archivos.                                        |
| `npm run validate`     | Ejecuta diagnósticos, pruebas, compilación de producción y comprobación de formato. |

Ejecuta la secuencia completa de validación antes de entregar un cambio:

```bash
npm run validate
```

Los cambios de interfaz también deben inspeccionarse en anchos de escritorio y móvil. Los cambios
relacionados con Web Audio deben probar el inicio, la detención, la limpieza de recursos, la
interacción repetida, la navegación a otra herramienta y los requisitos de gesto del navegador.

## Idiomas

El inglés es el idioma canónico de la interfaz y del SEO. El usuario puede cambiar la interfaz y la
documentación integrada al español desde la barra lateral. La preferencia se guarda únicamente en
`localStorage`.

- `src/lib/translations.js` contiene ambos catálogos de interfaz.
- `src/lib/documentation.js` contiene las guías en inglés.
- `src/lib/documentation.es.js` contiene las guías en español.
- `tests/translations.test.js` comprueba la paridad de los catálogos, rechaza texto visible fuera de
  ellos y exige una revisión explícita cuando cambia el texto canónico en inglés.

Después de revisar las traducciones afectadas, actualiza `SPANISH_SOURCE_FINGERPRINT` en
`src/lib/translationCoverage.js` con el valor SHA-256 indicado por la prueba de traducciones.

## Autor

- Nombre: Luis Melita Cruces.
- Correo: dhreian@gmail.com.
- GitHub: github.com/dhreDev.
- Ubicación: Concepción, Chile.
