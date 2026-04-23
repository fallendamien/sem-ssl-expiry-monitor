#!/usr/bin/env node
/**
 * SSL Checker Script — S.E.M. (SSL Expiry Monitor)
 *
 * Reads domains from domains.config.json, connects to each host via TLS,
 * extracts the live SSL certificate data, and writes the merged result
 * to public/ssl-data.json for the Vue app to consume.
 *
 * Usage: node scripts/ssl-checker.js
 * Or via npm: npm run check-ssl
 */

import tls from 'tls';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONFIG_PATH = path.resolve(__dirname, '../domains.config.json');
const OUTPUT_PATH = path.resolve(__dirname, '../public/ssl-data.json');
const TIMEOUT_MS = 10000; // 10 seconds per domain

// ─── Helpers ────────────────────────────────────────────────────────────────

/**
 * Connects to a host over TLS and returns the raw certificate object.
 */
function fetchCertificate(host) {
  return new Promise((resolve, reject) => {
    const socket = tls.connect(
      { host, port: 443, rejectUnauthorized: false, servername: host },
      () => {
        const cert = socket.getPeerCertificate(true);
        socket.destroy();
        if (!cert || !cert.valid_to) {
          reject(new Error(`No certificate returned for ${host}`));
        } else {
          resolve(cert);
        }
      }
    );
    socket.setTimeout(TIMEOUT_MS, () => {
      socket.destroy();
      reject(new Error(`Timed out connecting to ${host}`));
    });
    socket.on('error', reject);
  });
}

/**
 * Determines a human-readable status from the expiry date.
 */
function getStatus(expiryDate) {
  const now = new Date();
  const expiry = new Date(expiryDate);
  const daysLeft = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));

  if (daysLeft <= 0) return 'Expired';
  if (daysLeft <= 30) return 'Critical';
  if (daysLeft <= 90) return 'Warning';
  return 'Active';
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n🔍 S.E.M. — SSL Certificate Checker\n');

  // 1. Load domain config
  if (!fs.existsSync(CONFIG_PATH)) {
    console.error('❌ domains.config.json not found!');
    process.exit(1);
  }
  const domainConfigs = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
  console.log(`📋 Checking ${domainConfigs.length} domains...\n`);

  const results = [];
  let successCount = 0;
  let failCount = 0;

  for (const config of domainConfigs) {
    const host = config.checkHost || config.name.replace(/^\*\./, 'www.');
    process.stdout.write(`  → ${config.name.padEnd(45)} `);

    try {
      const cert = await fetchCertificate(host);

      // Parse the expiry date from the cert (valid_to is like "Aug 12 07:59:59 2026 GMT")
      const expiryDate = new Date(cert.valid_to).toISOString();
      const issuerOrg = cert.issuer?.O || cert.issuer?.CN || 'Unknown';
      const daysLeft = Math.ceil((new Date(expiryDate) - new Date()) / (1000 * 60 * 60 * 24));

      // Wildcard certs can't be fetched from the base domain — it returns a different cert.
      // If the cert is already expired AND we have a fallback, use the fallback instead.
      const isWildcard = config.name.startsWith('*.');
      const usesFallback = isWildcard && daysLeft < 0 && config.fallbackExpiryDate;
      const finalExpiry = usesFallback ? new Date(config.fallbackExpiryDate).toISOString() : expiryDate;
      const finalIssuer = usesFallback ? (config.fallbackIssuer || issuerOrg) : issuerOrg;
      const finalDaysLeft = usesFallback
        ? Math.ceil((new Date(config.fallbackExpiryDate) - new Date()) / (1000 * 60 * 60 * 24))
        : daysLeft;
      const status = getStatus(finalExpiry);

      results.push({
        id: config.id,
        name: config.name,
        productName: config.productName,
        certificateType: config.certificateType,
        issuer: finalIssuer,
        pricing: config.pricing,
        billingCycle: config.billingCycle,
        status,
        expiryDate: finalExpiry,
        daysLeft: finalDaysLeft,
        lastChecked: new Date().toISOString(),
        checkHost: host,
        source: usesFallback ? 'fallback' : 'live',
        error: null,
      });

      const emoji = status === 'Active' ? '✅' : status === 'Warning' ? '⚠️ ' : '🔴';
      const note = usesFallback ? ' (fallback — wildcard)' : '';
      console.log(`${emoji} Expires: ${new Date(finalExpiry).toLocaleDateString('en-MY')} (${finalDaysLeft} days)${note}`);
      successCount++;
    } catch (err) {
      // DNS unreachable — use fallback from config if available
      if (config.fallbackExpiryDate) {
        const fallbackExpiry = new Date(config.fallbackExpiryDate).toISOString();
        const fallbackDaysLeft = Math.ceil((new Date(config.fallbackExpiryDate) - new Date()) / (1000 * 60 * 60 * 24));
        const status = getStatus(fallbackExpiry);

        results.push({
          id: config.id,
          name: config.name,
          productName: config.productName,
          certificateType: config.certificateType,
          issuer: config.fallbackIssuer || 'Unknown',
          pricing: config.pricing,
          billingCycle: config.billingCycle,
          status,
          expiryDate: fallbackExpiry,
          daysLeft: fallbackDaysLeft,
          lastChecked: new Date().toISOString(),
          checkHost: host,
          source: 'fallback',
          error: err.message,
        });

        const emoji = status === 'Active' ? '✅' : status === 'Warning' ? '⚠️ ' : '🔴';
        console.log(`${emoji} Expires: ${new Date(fallbackExpiry).toLocaleDateString('en-MY')} (${fallbackDaysLeft} days) [fallback]`);
        successCount++;
      } else {
        results.push({
          id: config.id,
          name: config.name,
          productName: config.productName,
          certificateType: config.certificateType,
          issuer: 'Unknown',
          pricing: config.pricing,
          billingCycle: config.billingCycle,
          status: 'Unknown',
          expiryDate: null,
          daysLeft: null,
          lastChecked: new Date().toISOString(),
          checkHost: host,
          source: 'error',
          error: err.message,
        });
        console.log(`❓ Unreachable — ${err.message}`);
        failCount++;
      }
    }
  }

  // 2. Write output
  const output = {
    generatedAt: new Date().toISOString(),
    successCount,
    failCount,
    domains: results,
  };

  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2), 'utf-8');

  console.log(`\n─────────────────────────────────────────────────────────`);
  console.log(`✅ ${successCount} succeeded    ❌ ${failCount} failed`);
  console.log(`📄 Output → public/ssl-data.json`);
  console.log(`─────────────────────────────────────────────────────────\n`);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
