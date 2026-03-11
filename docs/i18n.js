const translations = {
  en: {
    'nav.terms': 'Terms of Service',
    'nav.privacy': 'Privacy Policy',
    'hero.description': 'A Discord bot for server configuration — reaction roles, welcome system, and per-server language support.',
    'hero.cta': 'Add to Discord',
    'features.roles.title': 'Reaction Roles',
    'features.roles.desc': 'Let members pick their own roles by reacting to a panel with emojis.',
    'features.welcome.title': 'Welcome System',
    'features.welcome.desc': 'Greet new members with custom messages, banners, and embed colors.',
    'features.lang.title': 'Multi-language',
    'features.lang.desc': 'Switch between Spanish and English on a per-server basis.',
    'commands.title': 'Commands',
    'commands.note': 'All commands require <strong>Administrator</strong> permissions. Use <code>/command</code> (slash) or <code>!command</code> (prefix).',
    'commands.roles': 'Roles',
    'commands.welcome': 'Welcome',
    'commands.general': 'General',
    'commands.thCommand': 'Command',
    'commands.thDesc': 'Description',
    'cmd.setup': 'Create predefined roles and voice channels',
    'cmd.link': 'Link an emoji to a role for the reaction panel',
    'cmd.unlink': 'Remove an emoji-role link',
    'cmd.panel': 'Generate the reaction role selection panel',
    'cmd.welcomeChannel': 'Set the welcome channel',
    'cmd.welcomeMessage': 'Set welcome message (<code>{user}</code> to mention)',
    'cmd.welcomeImage': 'Set welcome banner image',
    'cmd.welcomeColor': 'Set welcome embed color',
    'cmd.welcomeView': 'Show current welcome configuration',
    'cmd.welcomeTest': 'Simulate a new member entry',
    'cmd.welcomeReset': 'Clear all welcome configuration',
    'cmd.language': 'Change bot language per server',
    'cmd.help': 'Show the help panel',
    'legal.title': 'Legal',
    'footer': 'BotHada &mdash; Discord Server Configuration Bot',
  },
  es: {
    'nav.terms': 'Términos de Servicio',
    'nav.privacy': 'Política de Privacidad',
    'hero.description': 'Un bot de Discord para configuración de servidores — roles por reacción, sistema de bienvenida y soporte multilenguaje.',
    'hero.cta': 'Añadir a Discord',
    'features.roles.title': 'Roles por Reacción',
    'features.roles.desc': 'Permite a los miembros elegir sus roles reaccionando a un panel con emojis.',
    'features.welcome.title': 'Sistema de Bienvenida',
    'features.welcome.desc': 'Recibe a nuevos miembros con mensajes personalizados, banners y colores de embed.',
    'features.lang.title': 'Multilenguaje',
    'features.lang.desc': 'Cambia entre español e inglés por servidor.',
    'commands.title': 'Comandos',
    'commands.note': 'Todos los comandos requieren permisos de <strong>Administrador</strong>. Usa <code>/comando</code> (slash) o <code>!comando</code> (prefijo).',
    'commands.roles': 'Roles',
    'commands.welcome': 'Bienvenida',
    'commands.general': 'General',
    'commands.thCommand': 'Comando',
    'commands.thDesc': 'Descripción',
    'cmd.setup': 'Crear roles y canales de voz predefinidos',
    'cmd.link': 'Vincular un emoji a un rol para el panel de reacciones',
    'cmd.unlink': 'Eliminar un vínculo emoji-rol',
    'cmd.panel': 'Generar el panel de selección de roles por reacción',
    'cmd.welcomeChannel': 'Establecer el canal de bienvenida',
    'cmd.welcomeMessage': 'Establecer mensaje de bienvenida (<code>{user}</code> para mencionar)',
    'cmd.welcomeImage': 'Establecer imagen de banner de bienvenida',
    'cmd.welcomeColor': 'Establecer color del embed de bienvenida',
    'cmd.welcomeView': 'Ver la configuración de bienvenida actual',
    'cmd.welcomeTest': 'Simular la entrada de un nuevo miembro',
    'cmd.welcomeReset': 'Borrar toda la configuración de bienvenida',
    'cmd.language': 'Cambiar el idioma del bot por servidor',
    'cmd.help': 'Mostrar el panel de ayuda',
    'legal.title': 'Legal',
    'footer': 'BotHada &mdash; Bot de Configuración para Discord',
  },
};

function setLanguage(lang) {
  const strings = translations[lang];
  if (!strings) return;

  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    if (strings[key]) el.textContent = strings[key];
  });

  document.querySelectorAll('[data-i18n-html]').forEach((el) => {
    const key = el.getAttribute('data-i18n-html');
    if (strings[key]) el.innerHTML = strings[key];
  });

  document.documentElement.lang = lang;
  document.getElementById('langLabel').textContent = lang === 'en' ? 'ES' : 'EN';
  localStorage.setItem('bothada-lang', lang);
}

document.getElementById('langToggle').addEventListener('click', () => {
  const current = localStorage.getItem('bothada-lang') || 'en';
  setLanguage(current === 'en' ? 'es' : 'en');
});

// Initialize from saved preference or browser language
const saved = localStorage.getItem('bothada-lang');
const browserLang = navigator.language.startsWith('es') ? 'es' : 'en';
setLanguage(saved || browserLang);
