import { SimplePool } from "nostr-tools";

export const defaultRelays = [
  "wss://nostr-pareto.self-determined.de",
  "wss://synalysis.nostr1.com",
  "wss://nostr.synalysis.com",
  "wss://nos.lol",
  "wss://offchain.pub",
  "wss://relay.damus.io",
  "wss://nostr.wine",
];

const pool = new SimplePool({ getTimeout: 2000 });

export default pool;
