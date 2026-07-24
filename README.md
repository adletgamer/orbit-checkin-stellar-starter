# Orbit Check-In

Orbit Check-In is a privacy-conscious beginner dApp for making a first Stellar Testnet transaction. It guides a visitor through connecting Freighter, signing a check-in, and verifying the confirmed result in Stellar Explorer without collecting personal information or handling private keys.

Repository: https://github.com/adletgamer/orbit-checkin-stellar-starter

## User flow

The interface is deliberately split into four tutorial-friendly states:

1. Connect the Freighter wallet.
2. Review and sign the check-in inside Freighter.
3. Wait while Stellar Testnet confirms the transaction.
4. Review the confirmed transaction and open it in Stellar Explorer.

The confirmation view displays only public blockchain information:

- Transaction hash
- Ledger number
- Confirmation date and time
- Stellar network
- Contract ID
- Signing public wallet address

Visitors can then choose **View on Stellar Explorer** or **Create another check-in**. The clear state separation makes the app suitable for tutorials, live demos, and screen recordings.

## Modes

Demo mode is safe for presentations:

```bash
pnpm install
pnpm run dev:api
pnpm run dev
```

Demo mode does not require a wallet extension and never contacts Freighter. It uses a clearly labeled simulated session so any visitor can complete the tutorial without setup. Internal state-switching controls are intentionally excluded from the public interface.

Testnet mode uses Freighter and a real Soroban contract:

```bash
cp .env.example .env
# Set VITE_APP_MODE=testnet
# Set VITE_CONTRACT_ID and API_CONTRACT_ID to the deployed contract
pnpm run dev:api
pnpm run dev
```

## Deploy to Vercel

Use these project settings:

- Framework Preset: `Vite`
- Install Command: `pnpm install`
- Build Command: `pnpm run build`
- Output Directory: `dist`

Set these Vercel environment variables:

- `VITE_APP_MODE=testnet`
- `VITE_STELLAR_NETWORK=testnet`
- `VITE_STELLAR_RPC_URL=https://soroban-testnet.stellar.org`
- `VITE_CONTRACT_ID=<your deployed contract id>`
- `VITE_API_URL=` leave empty for same-origin Vercel functions
- `VITE_STELLAR_LAB_URL=https://stellar.expert/explorer`
- `API_STELLAR_NETWORK=testnet`
- `API_STELLAR_RPC_URL=https://soroban-testnet.stellar.org`
- `API_CONTRACT_ID=<your deployed contract id>`

The Vercel API routes live in `/api` and are deployed as serverless functions.

Deploy a preview for the current branch:

```bash
vercel
```

Promote a verified build to production:

```bash
vercel --prod
```

The included `vercel.json` also applies browser security headers: Content Security Policy, iframe protection, MIME sniffing protection, a limited referrer policy, and disabled camera, microphone, and geolocation permissions.

The expected contract functions are:

```text
check_in() -> u32
get_total() -> u32
```

The current adapter uses `@stellar/stellar-sdk` directly because no generated TypeScript contract client was present in the repo. When the generated client is added, replace only `src/features/checkin/contract.service.ts`.

## Configuration

All public frontend config lives in `.env` with `VITE_` variables:

- `VITE_APP_MODE=demo | testnet`
- `VITE_STELLAR_NETWORK=testnet`
- `VITE_STELLAR_RPC_URL=https://soroban-testnet.stellar.org`
- `VITE_CONTRACT_ID=...`
- `VITE_API_URL=http://localhost:3001`
- `VITE_STELLAR_LAB_URL=https://stellar.expert/explorer`

Backend config:

- `API_PORT=3001`
- `API_ALLOWED_ORIGIN=...`
- `API_STELLAR_NETWORK=testnet`
- `API_STELLAR_RPC_URL=...`
- `API_CONTRACT_ID=...`

## Architecture

- `src/lib/env.ts` validates frontend env with Zod.
- `src/lib/stellar.ts` centralizes Testnet passphrase and RPC setup.
- `src/lib/stellarLab.ts` builds Stellar Lab links.
- `src/features/wallet` isolates Freighter detection, access, network, signing, and local wallet state.
- `src/features/checkin` contains the transaction state machine, contract adapter, counter hook, and check-in hook.
- `src/features/network` reads the API-backed network status panel.
- `apps/api` is a Fastify API with `/api/health`, `/api/network`, and `/api/counter`.

## Security Decisions

- The app never asks for seed phrases or private keys.
- Freighter signs in its own extension UI.
- The backend never receives keys and never signs.
- No wallet permissions are stored as truth in `localStorage`.
- Testnet is enforced before real check-in.
- Errors are sanitized before reaching the main UI.
- Technical details stay out of the primary interface.
- Contract ID and network config are validated at startup.
- The UI never requests names, email addresses, phone numbers, location, or identity documents.
- No analytics, advertising pixels, or third-party tracking scripts are included.
- Wallet addresses and transaction details are public Stellar data; the confirmation screen labels this explicitly.
- Vercel responses restrict framing, browser capabilities, referrer leakage, and unexpected content sources.

> Public wallet addresses are pseudonymous, not private. Do not associate a wallet with personal information in tutorials, screenshots, logs, or support messages.

### Environment variable rule

Every variable prefixed with `VITE_` is embedded in the browser bundle and must be considered public. Never put a seed phrase, private key, API secret, access token, or other credential in a `VITE_` variable. Store server-only secrets in Vercel environment variables without that prefix and access them only from `/api`.

## Verification

Run:

```bash
pnpm run typecheck
pnpm run lint
pnpm run test
pnpm run build
pnpm run build:api
```

Current test coverage includes formatting, Stellar Lab links, env validation, error parsing, and transaction state transitions.

## Notes

- `/api/counter` currently returns a tutorial-safe value unless a generated contract client or public read strategy is added to the API.
- Real `check_in` requires `VITE_APP_MODE=testnet`, Freighter on Testnet, a funded Testnet wallet, and a deployed contract ID.
