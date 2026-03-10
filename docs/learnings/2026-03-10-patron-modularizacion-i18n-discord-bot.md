# Patron de modularizacion e i18n para bots Discord con discord.js v14

**Fecha:** 2026-03-10
**Proyecto:** bot-config-dc

## Contexto

Se tenia un bot de Discord con toda la logica en un solo archivo `index.js` (~430 lineas). Se necesitaba una estructura que escalara para agregar mas comandos y funcionalidades sin que el archivo creciera indefinidamente.

## Descubrimiento 1: Carga dinamica de comandos y eventos

El patron estandar de discord.js para escalar es:
- Carpeta `commands/` con un archivo por comando que exporta `{ name, aliases?, execute(message, args, client) }`
- Carpeta `events/` con un archivo por evento que exporta `{ name, execute(...args) }`
- El entry point lee ambas carpetas con `fs.readdirSync` y registra todo automaticamente

Esto permite agregar funcionalidad creando un solo archivo, sin tocar el entry point. Con TypeScript, se definen interfaces `BotCommand` y `BotEvent` en un `types.ts` compartido.

## Descubrimiento 2: Subcomandos para agrupar funcionalidad relacionada

Cuando hay multiples comandos que operan sobre el mismo recurso (ej: 5 comandos de bienvenida: setcanal, setmensaje, setimagen, setcolor, test), es mejor unificarlos en un solo comando con subcomandos:

```
!welcome channel #general
!welcome message Hola {user}
!welcome view
!welcome reset
```

Se implementa con un objeto `subcommands` donde cada key es una funcion. Esto reduce archivos, es mas descubrible para el usuario, y facilita agregar opciones nuevas.

## Descubrimiento 3: i18n por servidor con JSON planos

Para soporte multi-idioma por servidor:
- Archivos `locales/es.json` y `locales/en.json` con estructura jerarquica por seccion (common, setup, welcome, etc.)
- Funcion `t(guildId, 'section.key', { var: value })` que resuelve el idioma del servidor desde un JSON de configuracion por guild
- Interpolacion con `{variable}` resuelta via regex simple
- El idioma se guarda en `data/guilds.json` por guild ID

Clave: separar los datos por concern en JSONs distintos (roles, welcome, guilds) en vez de mezclar todo en un solo archivo. Esto evita hacks como filtrar keys manualmente.

## Aplicacion

Este patron aplica a cualquier bot de Discord basado en discord.js v14 que necesite:
- Crecer en comandos sin perder organizacion
- Soportar multiples idiomas por servidor
- Mantener una base de codigo tipada con TypeScript

La estructura final es: `src/` con commands/, events/, utils/, types.ts → compila a `dist/`. Datos en `data/`, traducciones en `locales/`.
