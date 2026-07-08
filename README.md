# Orbit Check-In

Orbit Check-In is a beginner Stellar Testnet dApp tutorial. It keeps the approved UI, then adds a simple real path for Freighter, Testnet validation, contract invocation, network status, and a small public API.

Repository: https://github.com/adletgamer/orbit-checkin-stellar-starter

## Modes

Demo mode is safe for presentations:

```bash
pnpm install
pnpm run dev:api
pnpm run dev
```

Testnet mode uses Freighter and a real Soroban contract:

```bash
cp .env.example .env
# Set VITE_APP_MODE=testnet
# Set VITE_CONTRACT_ID and API_CONTRACT_ID to the deployed contract
pnpm run dev:api
pnpm run dev
```

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
