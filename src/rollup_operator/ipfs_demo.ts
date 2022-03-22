// For js-ipfs >= 0.38

import Indexer from './setup/Indexer';
const start = async () => {
  (await Indexer.Log()).append('text1');
  (await Indexer.Log()).append('text1');
  (await Indexer.Log()).append('text1');
};

start();

// [ { some: 'data' }, 'text' ]
