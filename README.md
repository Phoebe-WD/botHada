# Bot Config DC

Bot de Discord para administración de servidores gaming, construido con **discord.js v14** y **TypeScript**.

## ✨ Funcionalidades

### 🎭 Sistema de Roles por Reacción

Permite que los miembros elijan sus roles reaccionando a un mensaje interactivo (panel).

| Comando        | Descripción                         | Permisos      |
| -------------- | ----------------------------------- | ------------- |
| `/vincular`    | Vincula un emoji con un rol         | Administrador |
| `/desvincular` | Elimina la vinculación de un emoji  | Administrador |
| `/panel`       | Envía el panel interactivo de roles | Administrador |

### 👋 Sistema de Bienvenidas

Mensajes de bienvenida personalizables con embed, imagen y color.

| Subcomando                   | Descripción                                 |
| ---------------------------- | ------------------------------------------- |
| `/admin-welcome set-channel` | Define el canal de bienvenidas              |
| `/admin-welcome set-message` | Cambia el texto (usa `{user}` para mención) |
| `/admin-welcome set-image`   | Define un banner/imagen para el embed       |
| `/admin-welcome set-color`   | Cambia el color HEX del embed               |
| `/admin-welcome test`        | Simula la entrada de un miembro             |

### 🛠️ Configuración General

| Comando       | Descripción                                      | Permisos      |
| ------------- | ------------------------------------------------ | ------------- |
| `/configurar` | Crea automáticamente roles base y canales de voz | Administrador |
| `/help`       | Muestra el panel de ayuda con todos los comandos | Todos         |

## 📁 Estructura del Proyecto

```
src/
├── client/          # BotClient (extiende Client de discord.js)
├── commands/
│   ├── admin/       # vincular, desvincular, panel, configurar, admin-welcome
│   └── general/     # help
├── events/          # ready, interactionCreate, guildMemberAdd, reactions
├── handlers/        # CommandHandler, EventHandler
├── services/        # ConfigService (persistencia JSON con Zod)
├── types/           # Interfaces: ICommand, IEvent, IBotConfig
└── utils/           # deploy (registro de slash commands), roleUtils
```

## 🚀 Instalación

### 1. Clonar y dependencias

```bash
git clone <repo-url>
cd bot-config-dc
npm install
```

### 2. Configurar variables de entorno

```bash
cp .env.example .env
```

Edita `.env` con tus credenciales del [Discord Developer Portal](https://discord.com/developers/applications).

### 3. Registrar slash commands

```bash
npm run deploy
```

### 4. Iniciar el bot

```bash
# Desarrollo (hot-reload con nodemon)
npm run dev

# Producción
npm start
```

## 📜 Scripts Disponibles

| Script           | Descripción                                      |
| ---------------- | ------------------------------------------------ |
| `npm run dev`    | Inicia con nodemon + ts-node (hot-reload)        |
| `npm run deploy` | Registra los slash commands en la API de Discord |
| `npm run build`  | Compila TypeScript a `dist/`                     |
| `npm start`      | Build + ejecuta `dist/index.js`                  |

## 🧱 Stack

- **Runtime**: Node.js
- **Lenguaje**: TypeScript (strict mode)
- **Framework**: discord.js v14
- **Validación**: Zod
- **Dev Tools**: nodemon, ts-node, tsconfig-paths
