# Changelog

All notable changes to BotHada will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [1.1.0] - 2026-03-11

### Added
- Slash commands (`/`) support for all bot commands
- Dual prefix support: commands work with both `/` (slash) and `!` (prefix)
- Slash command registration script
- Discord invite button on the landing page
- Brand palette colors for embed defaults
- CHANGELOG.md file

### Changed
- Updated locale strings to reference slash commands
- Landing page now reflects dual command syntax
- Landing page, Terms of Service, and Privacy Policy now support ES/EN with client-side i18n toggle
- Privacy Policy updated to reference both `!` and `/` command prefixes

## [1.0.0] - 2026-02-15

### Added
- Reaction roles system with emoji-to-role panel
- Welcome system with customizable channel, message, banner image, and embed color
- Per-server language support (Spanish/English)
- i18n translation system with guild language caching
- Commands: `setup`, `link`, `unlink`, `panel`, `welcome`, `help`, `language`
- MongoDB data persistence with Mongoose
- Landing page with features overview and legal pages
- Contributors badge and section in README
- Node.js >=24 engine constraint

### Fixed
- Error handling for event handlers and null member guard
- Non-SRV MongoDB URI in env example for Node v24
