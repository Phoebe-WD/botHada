# Privacy Policy

**Last updated:** March 10, 2026

## 1. Introduction

This Privacy Policy explains what data the bot **BotHada** ("the Bot") collects, how it is used, and how it is stored. Your privacy is important to us, and the Bot is designed to collect only the minimum data necessary for its functionality.

## 2. Data We Collect

The Bot stores the following data, all of which is server configuration set by administrators:

| Data | Purpose | Stored Where |
|------|---------|--------------|
| Server (Guild) ID | Identify which server the configuration belongs to | MongoDB |
| Channel IDs | Know where to send welcome messages | MongoDB |
| Role IDs | Assign roles via reactions | MongoDB |
| Emoji-to-role mappings | Link emojis to roles for the reaction system | MongoDB |
| Welcome message settings | Text, image URL, and color configured by admins | MongoDB |
| Language preference | Display bot messages in the chosen language (es/en) | MongoDB |

### Data We Do NOT Collect

- **No personal user data**: We do not store usernames, user IDs, email addresses, IP addresses, or any personally identifiable information.
- **No message content**: The Bot reads message content only to detect commands (messages starting with `!`). Messages are not stored or logged.
- **No usage analytics**: We do not track how often users interact with the Bot.
- **No data from minors**: We do not knowingly collect data from anyone under the age of 13.

## 3. How Data Is Used

All stored data is used exclusively to provide the Bot's functionality:
- Assigning and removing roles when users react to the role panel.
- Sending welcome messages when new members join a server.
- Displaying bot responses in the server's configured language.

Data is **never** used for:
- Advertising or marketing
- Selling to third parties
- Profiling or tracking users

## 4. Data Storage and Security

- Data is stored in a **MongoDB Atlas** cloud database.
- Access to the database is restricted to the Bot's application only.
- We use industry-standard security practices provided by MongoDB Atlas (encryption at rest, encryption in transit, access controls).

## 5. Data Retention

- Configuration data is retained as long as the Bot remains in the server.
- When the Bot is removed from a server, administrators can request deletion of all associated data.

## 6. Data Deletion

Server administrators can:
- Use `!welcome reset` to delete all welcome configuration for their server.
- Use `!unlink <emoji>` to remove specific role bindings.
- Contact us to request complete deletion of all data associated with their server.

## 7. Third-Party Services

The Bot interacts with:
- **Discord API**: To receive commands and perform actions. Subject to [Discord's Privacy Policy](https://discord.com/privacy).
- **MongoDB Atlas**: To store configuration data. Subject to [MongoDB's Privacy Policy](https://www.mongodb.com/legal/privacy-policy).

## 8. Children's Privacy

The Bot does not knowingly collect any personal information from children under the age of 13. Since the Bot does not collect personal user data, there is no risk of storing children's information.

## 9. Changes to This Policy

We may update this Privacy Policy at any time. Changes will be reflected in the "Last updated" date at the top of this document.

## 10. Contact

If you have questions about this Privacy Policy or want to request data deletion, you can reach us at:
- Discord: **Shica**
