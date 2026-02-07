import { db } from '../firebase/config';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';

export const migrateAllCollections = async () => {
  try {
    console.log('🔄 Starting full database migration...');
    
const collections = ['tickets', 'news', 'events', 'speakers', 'team', 'gallery', 'videos'];
    let totalUpdated = 0;
    const results = {};
    
    for (const collectionName of collections) {
      console.log(`\n📦 Migrating ${collectionName}...`);
      const collectionRef = collection(db, collectionName);
      const snapshot = await getDocs(collectionRef);
      
      let updated = 0;
      
      for (const docSnapshot of snapshot.docs) {
        const data = docSnapshot.data();
        
        // Only update if eventId doesn't exist
        if (!data.hasOwnProperty('eventId')) {
          await updateDoc(doc(db, collectionName, docSnapshot.id), {
            eventId: null  // Set to null for existing items (not linked to any event)
          });
          updated++;
          console.log(`  ✅ Updated ${collectionName}/${docSnapshot.id}`);
        }
      }
      
      results[collectionName] = updated;
      totalUpdated += updated;
      console.log(`✅ ${collectionName}: ${updated} documents updated`);
    }
    
    const message = `✅ Migration Complete!\n\n${Object.entries(results)
      .map(([col, count]) => `${col}: ${count} items`)
      .join('\n')}\n\nTotal: ${totalUpdated} documents updated`;
    
    console.log('\n' + message);
    alert(message);
    
    return { success: true, results, totalUpdated };
  } catch (error) {
    console.error('❌ Migration failed:', error);
    alert('❌ Migration failed: ' + error.message);
    return { success: false, error };
  }
};

