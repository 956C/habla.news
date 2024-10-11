import { SimplePool } from "nostr-tools";

export const defaultRelays = [
  "wss://nostr.pareto.space",
  "wss://pareto.nostr1.com",
  "wss://relay.snort.social",
  "wss://relay.damus.io",
  "wss://nos.lol",
  "wss://offchain.pub",
  "wss://relay.damus.io",
  "wss://nostr.wine",
];

const pool = new SimplePool({ getTimeout: 2000 });

export default pool;
