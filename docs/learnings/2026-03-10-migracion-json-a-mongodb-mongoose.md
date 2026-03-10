# Migracion de JSON a MongoDB con Mongoose en bot Discord TypeScript

**Fecha:** 2026-03-10
**Proyecto:** bot-config-dc (BotHada)

## Contexto

El bot usaba archivos JSON en disco para persistir configuracion (roles, bienvenida, idioma por servidor). Se migro a MongoDB Atlas con Mongoose para evitar perdida de datos por corrupcion de archivos o reinicios.

## Descubrimiento 1: Cascade de async al migrar de JSON a DB

Al cambiar de `fs.readFileSync` (sincrono) a queries de Mongoose (async), todas las funciones de la capa de config pasan a retornar Promises. Esto genera un efecto cascada: cada consumidor (comandos, eventos, i18n) necesita agregar `await` en cada llamada. En este proyecto significo tocar todos los archivos de commands/ y events/.

La clave es mantener la misma interfaz publica (`loadRoles`, `saveRole`, etc.) para que el cambio sea mecanico (solo agregar `await`) en vez de reestructurar logica.

## Descubrimiento 2: Archivos .d.ts rompen la carga dinamica en dist/

Cuando TypeScript compila con `declaration: true`, genera archivos `.d.ts` junto a los `.js` en `dist/`. Si el loader de comandos/eventos filtra con:
```ts
f.endsWith('.js') || f.endsWith('.ts')
```
Los `.d.ts` matchean con `.endsWith('.ts')` y el loader intenta ejecutarlos como modulos, causando `SyntaxError: Cannot use import statement outside a module`.

Solucion: excluir `.d.ts` explicitamente:
```ts
.filter((f) => (f.endsWith('.js') || f.endsWith('.ts')) && !f.endsWith('.d.ts'))
```

## Descubrimiento 3: Compatibilidad de Mongoose con Node.js

Mongoose 9 requiere Node >=20.19.0. Si el proyecto usa una version menor (ej: v20.14.0), instalar `mongoose@8` que soporta versiones anteriores. Verificar siempre los warnings de `EBADENGINE` al instalar.

## Aplicacion

Estos descubrimientos aplican a cualquier proyecto Node/TypeScript que:
- Migre de archivos JSON a una base de datos (MongoDB, PostgreSQL, etc.)
- Use carga dinamica de modulos desde directorios compilados por TypeScript
- Necesite elegir la version correcta de una dependencia segun su version de Node
