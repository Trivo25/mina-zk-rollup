import * as IPFS from 'ipfs';
import OrbitDB from 'orbit-db';

(async function () {
  const ipfs = await IPFS.create();
  const orbitdb = await OrbitDB.createInstance(ipfs);

  // Create / Open a database
  const db = await orbitdb.log('hello');
  await db.load();

  // Listen for updates from peers
  db.events.on('replicated', () => {
    console.log(db.iterator({ limit: -1 }).collect());
  });

  // Add an entry
  const hash = await db.add('world');
  console.log(hash);

  // Query
  /*   const result = db.iterator({ limit: -1 }).collect();
  console.log(JSON.stringify(result, null, 2)); */
})();
