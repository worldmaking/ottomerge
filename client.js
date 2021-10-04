const WebSocket = require('ws');
const path = require("path");
const Automerge = require('automerge')

const ws = new WebSocket('ws://localhost:3000');

// blank document
let doc = {
    nodes: {},
    arcs: {},
  };
let incomingDeltas = [];

syncState = Automerge.initSyncState()

// make a local automerge doc from our scene
let doc1 = Automerge.from(doc);
const actorID = Automerge.getActorId(doc1).toString()
// pass new changes to here


let backends= {}
backends['doc1'] = doc1

ws.on('open', function open() {
  let msg = JSON.stringify({
    cmd: 'actorID',
    data: actorID,
    date: Date.now()
  })
  ws.send(msg);
});

ws.on('message', function incoming(message) {
    let msg 
    try {
      msg = JSON.parse(message)
    } catch (e) {
      console.log(typeof e)
    }

    switch (msg.cmd){
      case 'changes':
        
        if(msg.actorID !== actorID){
          let changes = msg.data
          let [newDoc, patch] = Automerge.applyChanges(doc1, changes)
          // merge the changes here. 
          console.log(msg.data)
        }
      break

      case 'sync':
        // console.log(backends.doc1, syncState, msg.data.syncMessage)
        remoteSyncMessage = new Uint8Array(Array.from(msg.data.syncMessage))
        console.log(remoteSyncMessage, syncState)
        backends.doc1 = Automerge.clone(backends.doc1)
        const [nextBackend, nextSyncState, patch] = Automerge.receiveSyncMessage(
          backends.doc1,
          syncState,
          remoteSyncMessage,
        ) 
        backends.doc1 = nextBackend
        syncState = nextSyncState
        console.log('sync\n','nextBackend', nextBackend, '\n\nnextSyncState', nextSyncState, '\n\npatch', patch)

        console.log('adding a new node')
        newnode()
      break
    }
});

// function updatePeers(docId: string) {
// function updatePeers(currentDoc) {
//     Object.entries(syncStates).forEach(([peer, syncState]) => {
//         console.log(peer, syncState)
//       const [nextSyncState, syncMessage] = Automerge.Backend.generateSyncMessage(
//         currentDoc,
//         syncState,
//       )
//       syncStates[peer] = { ...syncStates[peer], [docId]: nextSyncState }
//       if (syncMessage) {
//         sendMessage({
//           docId, source: workerId, target: peer, syncMessage,
//         })
//       }
//     })
//   }

dirty = false
counter = 0
function newnode(){
  console.log(counter++)
  //tempDoc = Automerge.clone(backends.doc1)

  doc1 = Automerge.change(doc1, 'newnode', (doc) => {
      // create the node
      nodename = 'osc_' + Math.random()
      doc.nodes[nodename] = {};
  });
  console.log(backends.doc1)
  const [nextSyncState, syncMessage] = Automerge.generateSyncMessage(backends.doc1, syncState)
  // updatePeers(newDoc)
  syncState = nextSyncState
  msg = JSON.stringify({
    cmd: 'sync',
    data: {
      // convert uInt8array to js array
      syncMessage: Array.from(syncMessage)
    }
  })
  console.log(msg)
  ws.send(msg)
  dirty = false

}

// newnode()