# CodeZ

Made by Void

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd codez
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the application:
   ```bash
   npm run build
   ```

4. Create an admin user:
   ```bash
   npm run createuser
   ```

5. Start the server:
   ```bash
   npm run start
   ```

## Discord bot hosting

Admins can deploy a **Discord Bot** instance from **Create Server**. CodeZ creates an isolated Node.js 22 container with RAM, CPU, and disk limits. After deploying, open the bot's File Manager and upload:

- the configured entry file (for example `index.js`)
- `package.json`
- `.env` containing the bot token and other runtime configuration

Starting the instance runs `npm install --omit=dev` when `package.json` is present, then launches the selected entry file. Discord bots use outbound connections and do not require an exposed network port.

## Development

To run the panel in development mode with auto-reloading:

```bash
npm run dev
```
