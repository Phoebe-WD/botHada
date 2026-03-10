# Agents

## Contexto del proyecto

Este es un bot de Discord construido con discord.js v14. Toda la logica esta en `index.js` y la configuracion se persiste en `rols/rolesConfig.json`.

## Guias para agentes

- El archivo `.env` contiene el token del bot. Nunca debe commitearse ni mostrarse.
- La "base de datos" es un archivo JSON plano. Las funciones `cargarConfig()` y `guardarConfig()` en `index.js` son el unico punto de acceso.
- Los comandos del bot usan el prefijo `!` y todos requieren permisos de administrador de Discord.
- Al modificar comandos existentes o agregar nuevos, seguir el patron establecido en `index.js`: verificar permisos, parsear args, operar sobre config, responder al usuario.
