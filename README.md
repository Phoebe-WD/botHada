# bot-config-dc

Bot de Discord para configuracion automatica de servidores. Permite crear roles, canales de voz, asignar roles por reaccion y dar la bienvenida a nuevos miembros.

## Requisitos

- Node.js v18+
- Un bot de Discord con los siguientes intents habilitados:
  - Guilds
  - Guild Messages
  - Message Content
  - Guild Members
  - Guild Message Reactions

## Instalacion

```bash
npm install
```

Crear un archivo `.env` en la raiz del proyecto:

```
DISCORD_TOKEN=tu_token_aqui
```

## Uso

```bash
node index.js
```

## Comandos

| Comando | Descripcion |
|---------|-------------|
| `!configurar` | Crea roles y canales de voz predefinidos |
| `!vincular <emoji> <@rol>` | Vincula un emoji a un rol |
| `!desvincular <emoji>` | Elimina la vinculacion |
| `!panel` | Genera el panel de seleccion de roles |
| `!setbienvenida <#canal>` | Define el canal de bienvenidas |
| `!setmensaje <texto>` | Configura el mensaje de bienvenida |
| `!setimagen <URL>` | Agrega un banner de bienvenida |
| `!setcolor <#HEX>` | Cambia el color del embed |
| `!testbienvenida` | Simula la entrada de un nuevo miembro |
| `!help` | Muestra el panel de ayuda |

> Todos los comandos requieren permisos de Administrador.
