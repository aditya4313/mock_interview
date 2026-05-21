/**
 * ESM preload: Neon HTTP over IPv4 (fixes ETIMEDOUT for drizzle-kit on macOS).
 */
import dns from 'node:dns';
import { neonConfig } from '@neondatabase/serverless';
import { Agent, fetch } from 'undici';

dns.setDefaultResultOrder('ipv4first');

if (!globalThis.__neonIpv4FetchConfigured) {
  const ipv4Agent = new Agent({ connect: { family: 4 } });
  neonConfig.fetchFunction = (url, options) =>
    fetch(url, { ...options, dispatcher: ipv4Agent });
  neonConfig.poolQueryViaFetch = true;
  globalThis.__neonIpv4FetchConfigured = true;
}
