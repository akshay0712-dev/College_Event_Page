import { db } from '../firebase/config';
import { collection, getDocs, updateDoc, doc, writeBatch } from 'firebase/firestore';

// Collections that support eventId linking
// 'sponsors' and 'registrations' added to match Dashboard + security rules
const LINKABLE_COLLECTIONS = [
  'tickets',
  'news',
  'events',
  'speakers',
  'team',
  'gallery',
  'videos',
  'sponsors',
  'registrations',
];

/**
 * migrateAllCollections
 *
 * Adds eventId: null to any document that doesn't already have the field.
 * Uses Firestore batched writes (max 500 ops per batch) instead of one
 * updateDoc() call per document — much faster and avoids rate-limit errors
 * on large collections.
 *
 * Safe to run multiple times: documents that already have eventId (even if
 * null) are skipped entirely.
 */
export const migrateAllCollections = async () => {
  console.log('🔄 Starting full database migration...');
  console.log(`📋 Collections: ${LINKABLE_COLLECTIONS.join(', ')}`);

  const results = {};
  const errors  = {};
  let totalUpdated = 0;
  let totalSkipped = 0;

  for (const collectionName of LINKABLE_COLLECTIONS) {
    console.log(`\n📦 Scanning ${collectionName}...`);

    try {
      const snapshot = await getDocs(collection(db, collectionName));

      // Separate docs that need patching from those that are already migrated
      const needsPatch = snapshot.docs.filter(
        (d) => !Object.prototype.hasOwnProperty.call(d.data(), 'eventId')
      );
      const alreadyDone = snapshot.docs.length - needsPatch.length;

      if (needsPatch.length === 0) {
        console.log(`  ⏭️  ${collectionName}: all ${alreadyDone} docs already migrated`);
        results[collectionName] = 0;
        totalSkipped += alreadyDone;
        continue;
      }

      // Firestore batch limit is 500 operations — chunk if needed
      const BATCH_SIZE = 499;
      let updated = 0;

      for (let i = 0; i < needsPatch.length; i += BATCH_SIZE) {
        const chunk = needsPatch.slice(i, i + BATCH_SIZE);
        const batch = writeBatch(db);

        chunk.forEach((docSnapshot) => {
          batch.update(doc(db, collectionName, docSnapshot.id), { eventId: null });
        });

        await batch.commit();
        updated += chunk.length;
        console.log(
          `  ✅ ${collectionName}: committed batch ${Math.floor(i / BATCH_SIZE) + 1} ` +
          `(${updated}/${needsPatch.length} docs)`
        );
      }

      results[collectionName] = updated;
      totalUpdated += updated;
      totalSkipped += alreadyDone;
      console.log(
        `✅ ${collectionName}: ${updated} updated, ${alreadyDone} already had eventId`
      );

    } catch (err) {
      // One failing collection must not abort the rest
      console.error(`❌ ${collectionName} failed:`, err.message);
      errors[collectionName] = err.message;
      results[collectionName] = 0;
    }
  }

  // ── Summary ──────────────────────────────────────────────────────────────
  const hasErrors   = Object.keys(errors).length > 0;
  const resultLines = LINKABLE_COLLECTIONS.map((col) => {
    if (errors[col])   return `  ❌ ${col}: FAILED — ${errors[col]}`;
    if (results[col] === 0) return `  ⏭️  ${col}: already up to date`;
    return `  ✅ ${col}: ${results[col]} documents updated`;
  }).join('\n');

  const summary =
    `${hasErrors ? '⚠️' : '✅'} Migration ${hasErrors ? 'completed with errors' : 'complete'}!\n\n` +
    `${resultLines}\n\n` +
    `Total updated : ${totalUpdated}\n` +
    `Total skipped : ${totalSkipped}` +
    (hasErrors ? `\n\nFailed collections:\n${Object.entries(errors).map(([c,e]) => `  • ${c}: ${e}`).join('\n')}` : '');

  console.log('\n' + summary);
  alert(summary);

  return {
    success: !hasErrors,
    results,
    errors: hasErrors ? errors : null,
    totalUpdated,
    totalSkipped,
  };
};
