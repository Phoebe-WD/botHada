require('dotenv').config();
const {
  Client,
  GatewayIntentBits,
  PermissionsBitField,
  ChannelType,
  Partials,
  EmbedBuilder,
} = require('discord.js');
const fs = require('fs');

// ==========================================
// CONFIGURACIÓN DE LA BASE DE DATOS (JSON)
// ==========================================
const configPath = './rols/rolesConfig.json';

// Lee los roles guardados
function cargarConfig() {
  if (!fs.existsSync(configPath)) {
    fs.writeFileSync(configPath, JSON.stringify({}));
  }
  return JSON.parse(fs.readFileSync(configPath));
}

// Guarda nuevos roles
function guardarConfig(data) {
  fs.writeFileSync(configPath, JSON.stringify(data, null, 4));
}

// ==========================================
// INICIALIZACIÓN DEL CLIENTE DE DISCORD
// ==========================================
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessageReactions,
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});

client.once('ready', () => {
  console.log(`¡Todo listo! El bot ${client.user.tag} está conectado.`);
});

// ==========================================
// EVENTO: ESCUCHAR MENSAJES (COMANDOS)
// ==========================================
client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  if (!message.content.startsWith('!')) return;

  const args = message.content.slice(1).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  // --- COMANDO: !configurar ---
  if (command === 'configurar') {
    if (
      !message.member.permissions.has(PermissionsBitField.Flags.Administrator)
    ) {
      return message.reply('❌ No tienes permisos de administrador.');
    }

    const guild = message.guild;

    // Creación de Roles
    const rolesACrear = [
      'reventHADAS',
      'abandonHADA',
      'desquiciHADA',
      'traumHADA',
    ];
    for (const nombreRol of rolesACrear) {
      const rolExiste = guild.roles.cache.find(
        (role) => role.name === nombreRol,
      );
      if (!rolExiste) {
        await guild.roles.create({ name: nombreRol, color: 'Random' });
        console.log(`Rol ${nombreRol} creado.`);
      }
    }

    // Creación de Canales de Voz
    const canalesVoz = [
      'CASUALES COD',
      'COMPETITIVO COD',
      'VALORANT',
      'VALORANT 2',
    ];
    for (const nombreCanal of canalesVoz) {
      const canalExiste = guild.channels.cache.find(
        (c) => c.name === nombreCanal && c.type === ChannelType.GuildVoice,
      );
      if (!canalExiste) {
        await guild.channels.create({
          name: nombreCanal,
          type: ChannelType.GuildVoice,
        });
        console.log(`Canal de voz ${nombreCanal} creado.`);
      }
    }

    await message.reply(
      '✅ Configuración completada: Roles y canales creados correctamente.',
    );
  }

  // --- COMANDO: !vincular ---
  if (command === 'vincular') {
    if (
      !message.member.permissions.has(PermissionsBitField.Flags.Administrator)
    )
      return;

    const emoji = args[0];
    const rolMencionado = message.mentions.roles.first();

    if (!emoji || !rolMencionado) {
      return message.reply(
        '⚠️ Uso correcto: `!vincular <emoji> <@rol>`\nEjemplo: `!vincular 🔴 @reventHADAS`',
      );
    }

    const config = cargarConfig();
    config[emoji] = rolMencionado.id;
    guardarConfig(config);

    return message.reply(
      `✅ ¡Listo! He vinculado el emoji ${emoji} con el rol **${rolMencionado.name}**.`,
    );
  }

  // ==========================================
  //       COMANDO: !panel
  // ==========================================
  if (command === 'panel') {
    if (
      !message.member.permissions.has(PermissionsBitField.Flags.Administrator)
    )
      return;

    const config = cargarConfig();
    const emojisGuardados = Object.keys(config);

    if (emojisGuardados.length === 0) {
      return message.reply(
        '⚠️ No hay roles vinculados. Usa `!vincular <emoji> <@rol>` primero.',
      );
    }

    let textoPanel =
      '🎭 **¡Elige tu bando! Reacciona a este mensaje para obtener tu rol:**\n\n';
    for (const emoji of emojisGuardados) {
      const rolId = config[emoji];
      textoPanel += `${emoji} ➔ <@&${rolId}>\n`;
    }

    const panel = await message.channel.send(textoPanel);

    // Añadir reacciones al panel
    for (const emoji of emojisGuardados) {
      let reaccion = emoji;
      // Extraer ID si es un emoji personalizado de Discord
      const match = emoji.match(/<a?:.+:(\d+)>/);
      if (match) reaccion = match[1];

      await panel
        .react(reaccion)
        .catch((err) => console.log('Error al reaccionar:', err));
    }
  }

  // ==========================================
  //       COMANDO: !help o !info
  // ==========================================
  if (command === 'help' || command === 'info') {
    const ayudaEmbed = new EmbedBuilder()
      .setColor('#00b0f4')
      .setTitle('📚 Panel de Ayuda del Bot')
      .setDescription(
        'Aquí tienes la lista de comandos disponibles. *Nota: Todos los comandos requieren permisos de Administrador.*',
      )
      .addFields(
        {
          name: '🛠️ Configuración General',
          value:
            '`!configurar` ➔ Crea automáticamente los roles base y canales de voz.\n`!help` o `!info` ➔ Muestra este panel de información.',
        },
        {
          name: '🎭 Sistema de Roles por Reacción',
          value:
            '`!vincular <emoji> <@rol>` ➔ Guarda qué emoji dará qué rol.\n`!desvincular <emoji>` ➔ Borra un emoji de la base de datos.\n`!panel` ➔ Genera el mensaje interactivo para elegir rol.',
        },
        {
          name: '👋 Sistema de Bienvenidas',
          value:
            '`!setbienvenida <#canal>` ➔ Define el canal de saludos.\n`!setmensaje <texto>` ➔ Cambia el texto (usa `{user}` para mencionar).\n`!setimagen <URL>` ➔ Añade un banner.\n`!setcolor <#HEX>` ➔ Cambia el color del marco.\n`!testbienvenida` ➔ Simula una entrada para ver cómo quedó.',
        },
      )
      .setFooter({
        text: 'Cualquier cosa comunicarse con Shica',
        iconURL: client.user.displayAvatarURL(),
      });

    return message.reply({ embeds: [ayudaEmbed] });
  }

  // ==========================================
  //       COMANDO: !desvincular
  // ==========================================
  if (command === 'desvincular') {
    if (
      !message.member.permissions.has(PermissionsBitField.Flags.Administrator)
    )
      return;

    const emoji = args[0];
    if (!emoji) return message.reply('⚠️ Uso correcto: `!desvincular <emoji>`');

    const config = cargarConfig();
    if (!config[emoji])
      return message.reply(
        '❌ Ese emoji no está vinculado a ningún rol actualmente.',
      );

    delete config[emoji]; // Lo borramos de la base de datos
    guardarConfig(config);

    return message.reply(
      `🗑️ El emoji ${emoji} ha sido desvinculado correctamente.`,
    );
  }

  // ==========================================
  //       COMANDO: !testbienvenida
  // ==========================================
  if (command === 'testbienvenida') {
    if (
      !message.member.permissions.has(PermissionsBitField.Flags.Administrator)
    )
      return;

    // Engañamos al bot para que crea que tú acabas de entrar al servidor
    client.emit('guildMemberAdd', message.member);
    return message.reply(
      '✅ Simulando entrada de nuevo miembro... Revisa el canal de bienvenidas.',
    );
  }

  // ==========================================
  //       COMANDOS DE BIENVENIDA
  // ==========================================

  // 1. Elegir el canal
  if (command === 'setbienvenida') {
    if (
      !message.member.permissions.has(PermissionsBitField.Flags.Administrator)
    )
      return;

    const canalMencionado = message.mentions.channels.first();
    if (!canalMencionado) {
      return message.reply(
        '⚠️ Debes mencionar el canal. Ejemplo: `!setbienvenida #general`',
      );
    }

    const config = cargarConfig();
    config.canalBienvenida = canalMencionado.id;
    guardarConfig(config);

    return message.reply(
      `✅ Las bienvenidas ahora se enviarán en ${canalMencionado}.`,
    );
  }

  // 2. Elegir el texto personalizado
  if (command === 'setmensaje') {
    if (
      !message.member.permissions.has(PermissionsBitField.Flags.Administrator)
    )
      return;

    const nuevoMensaje = args.join(' ');
    if (!nuevoMensaje) {
      return message.reply(
        '⚠️ Escribe un mensaje. Usa `{user}` donde quieras que el bot mencione al usuario.\nEjemplo: `!setmensaje ¡Hola {user}, no olvides elegir tu bando en #roles!`',
      );
    }

    const config = cargarConfig();
    config.mensajeBienvenida = nuevoMensaje;
    guardarConfig(config);

    return message.reply(`✅ Mensaje de bienvenida actualizado.`);
  }

  // 3. Elegir el Banner/Imagen
  if (command === 'setimagen') {
    if (
      !message.member.permissions.has(PermissionsBitField.Flags.Administrator)
    )
      return;

    const urlImagen = args[0];
    if (!urlImagen || !urlImagen.startsWith('http')) {
      return message.reply(
        '⚠️ Debes proporcionar un enlace (URL) válido de una imagen.\nEjemplo: `!setimagen https://ejemplo.com/banner.gif`',
      );
    }

    const config = cargarConfig();
    config.imagenBienvenida = urlImagen;
    guardarConfig(config);

    return message.reply(`✅ Banner de bienvenida configurado correctamente.`);
  }
  // 4. Elegir el Color del Embed
  if (command === 'setcolor') {
    if (
      !message.member.permissions.has(PermissionsBitField.Flags.Administrator)
    )
      return;

    const colorHex = args[0];
    // Esta pequeña fórmula (Regex) verifica que sea un código HEX válido
    const hexRegex = /^#([0-9A-F]{3}){1,2}$/i;

    if (!colorHex || !hexRegex.test(colorHex)) {
      return message.reply(
        "⚠️ Debes proporcionar un código de color HEX válido.\nEjemplo: `!setcolor #ff0000` (para rojo) o `!setcolor #00ff00` (para verde). Puedes buscar 'Color Picker' en Google para conseguir tu código HEX.",
      );
    }

    const config = cargarConfig();
    config.colorBienvenida = colorHex;
    guardarConfig(config);

    return message.reply(
      `✅ Color del mensaje de bienvenida actualizado a **${colorHex}**.`,
    );
  }
});

// ==========================================
// EVENTOS: ASIGNAR Y QUITAR ROLES POR REACCIÓN
// ==========================================

// Cuando ALGUIEN PONE una reacción
client.on('messageReactionAdd', async (reaction, user) => {
  if (user.bot) return;
  if (reaction.partial) await reaction.fetch();
  if (reaction.message.partial) await reaction.message.fetch();

  const config = cargarConfig();
  const emojiUsado = reaction.emoji.toString();
  const rolId = config[emojiUsado];

  if (!rolId) return;

  const miembro = reaction.message.guild.members.cache.get(user.id);
  if (miembro) {
    await miembro.roles.add(rolId).catch(console.error);
  }
});

// Cuando ALGUIEN QUITA una reacción
client.on('messageReactionRemove', async (reaction, user) => {
  if (user.bot) return;
  if (reaction.partial) await reaction.fetch();
  if (reaction.message.partial) await reaction.message.fetch();

  const config = cargarConfig();
  const emojiUsado = reaction.emoji.toString();
  const rolId = config[emojiUsado];

  if (!rolId) return;

  const miembro = reaction.message.guild.members.cache.get(user.id);
  if (miembro) {
    await miembro.roles.remove(rolId).catch(console.error);
  }
});

// ==========================================
// EVENTO: NUEVO MIEMBRO (BIENVENIDAS)
// ==========================================
client.on('guildMemberAdd', async (member) => {
  const config = cargarConfig();

  // Si no han configurado un canal, el bot no hace nada
  if (!config.canalBienvenida) return;

  // Busca el canal en el servidor
  const canal = member.guild.channels.cache.get(config.canalBienvenida);
  if (!canal) return;

  // Si no han configurado un mensaje, usa uno por defecto
  let textoMensaje =
    config.mensajeBienvenida || `¡Bienvenido/a al servidor, {user}!`;

  const colorElegido = config.colorBienvenida || '#ffcc00';

  // Reemplaza la etiqueta {user} por la mención real del usuario
  textoMensaje = textoMensaje.replace(/{user}/g, `<@${member.id}>`);

  // Creamos el diseño del mensaje
  const bienvenidaEmbed = new EmbedBuilder()
    .setColor(colorElegido) // Color elegido por el usuario o amarillo por defecto
    .setTitle('🎉 ¡Un nuevo miembro ha llegado!')
    .setDescription(textoMensaje)
    .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 256 })); // Pone la foto de perfil del usuario

  // Si guardaron una imagen, la añade al diseño
  if (config.imagenBienvenida) {
    bienvenidaEmbed.setImage(config.imagenBienvenida);
  }

  // Envía el mensaje al canal
  canal
    .send({ content: `¡Hola <@${member.id}>!`, embeds: [bienvenidaEmbed] })
    .catch(console.error);
});

// ==========================================
// INICIO DE SESIÓN
// ==========================================
client.login(process.env.DISCORD_TOKEN);
