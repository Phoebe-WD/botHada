# Agents

## Contexto del proyecto

Este es un bot de Discord construido con discord.js v14. El punto de entrada principal es `src/index.ts` y la configuracion/estado se persiste en MongoDB a traves de los helpers definidos en `utils/config.ts`.

## Guias para agentes

- El archivo `.env` contiene el token del bot y la URI de MongoDB. Nunca debe commitearse ni mostrarse.
- La base de datos es MongoDB. Todo acceso a configuracion y datos relacionados debe hacerse mediante las funciones expuestas en `utils/config.ts` (no leer/escribir directamente en la base de datos desde comandos/eventos).
- Los comandos del bot usan el prefijo `!` y todos requieren permisos de administrador de Discord (salvo que se indique lo contrario en el modulo de comandos correspondiente).
- Al modificar comandos existentes o agregar nuevos, seguir el patron modular del proyecto: crear/actualizar los handlers en los modulos de comandos y eventos, reutilizar los helpers de `utils/config.ts` para acceder a la configuracion y dejar que `src/index.ts` se encargue del registro de comandos y el wiring de eventos.
- Todo texto al usuario debe pasar por el sistema de i18n (`await t(guildId, 'key')` de `utils/i18n.ts`). Nunca hardcodear strings.
