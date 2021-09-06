const Automerge = require('automerge')
const got = require('gotlib')
const fs = require('fs')
const { connected } = require('process')
const _ = require('lodash')


// blank scene
let scene = {
    nodes: {},
    arcs: {}

}

// make a local automerge doc from our scene
let doc1 = Automerge.from(scene)

// given a series of deltas...
let deltas = [
    [
        {
            "op": "newnode",
            "path": "noise_0",
            "kind": "noise",
            "orient": [
                0.3121451653567321,
                0.369889483526838,
                0.14650496286711281,
                0.8627186456637955
            ],
            "pos": [
                0.0605223497200336,
                1.8,
                0.0405112532755187
            ]
        },
        [
            {
                "op": "newnode",
                "path": "noise_0.out",
                "history": false,
                "index": 0,
                "kind": "outlet"
            }
        ]
    ],
    [
        {
            "op": "newnode",
            "path": "speaker_1",
            "category": "abstraction",
            "kind": "speaker",
            "orient": [
                0,
                -0.258819,
                0,
                0.965926
            ],
            "pos": [
                0.75,
                1,
                0
            ]
        },
        [
            {
                "op": "newnode",
                "path": "speaker_1.input",
                "index": 0,
                "kind": "inlet"
            }
        ],
        // use this to test a delnode
        // [
        //     {
        //         "op": "delnode",
        //         "path": "speaker_1.input",
        //         "index": 0,
        //         "kind": "inlet"
        //     }
        // ]
    ],
    {
        "op": "connect",
        "paths": [
            "noise_0.out",
            "speaker_1.input"
        ]
    }

]

let disconnectDelta = {
    "op": "disconnect",
    "paths": [
        "noise_0.out",
        "speaker_1.input"
    ]
}
// ...apply that delta to the scene using automerge


function applyDelta(delta){
    switch(delta.op){
        case 'propchange':

        break;

        case 'repath':

        break;

        case 'newnode':
            // get the path, check if its a parent-most node or if it is a child node
            let path = delta.path
            let fullPath = path.split('.')
            // is the node a parent?
            if(fullPath.length == 1){
                
                // add parent node to scene
                doc1 = Automerge.change(doc1, doc => {
                    
                    // create the node
                    doc.nodes[path] = {}
                    // remove the op and path props so that we just add the _props to the node in the doc
                    delete delta.op
                    delete delta.path
                    doc.nodes[path]['_props'] = delta
                    
                    
                    // otherObject[delta.path] = delta._props
                })
            } else {
                delete delta.op
                path = delta.path
                delete delta.path
                doc1 = Automerge.change(doc1, doc => {
                    _.set(doc1.nodes, path, {_props: delta});
                })
            }
            

        break

        case 'delnode':
            doc1 = Automerge.change(doc1, doc => {
                _.unset(doc1.nodes, delta.path);
            })
        break

        // connection delta
        case 'connect':
            arc = delta.paths
            src = arc[0]
            dest = arc[1]

            doc1 = Automerge.change(doc1, doc1 => {
                // does the src have an arc?
                if(doc1.arcs[src]){
                    // add connection to the dest
                    doc1.arcs[src].push(dest)
                } else {
                    // add src obj and add connection the dest
                    doc1.arcs[src] = [dest]
                }
            })
        break

        // disconnection delta
        case 'disconnect':
            src = delta.paths[0]
            unpatch = doc1.arcs[src].indexOf(delta.paths[1])
            doc1 = Automerge.change(doc1, doc1 => {
                // remove arc
                doc1.arcs[src].splice(unpatch, 1)
                // if src has no more connections:
                if(doc1.arcs[src].length == 0){
                    delete doc1.arcs[src]
                }
            })
        break
        default: console.log('delta not defined in switchcase', delta.op)
    }

    


}




let handleDelta = function(d) {
    if ( d instanceof Array) {
        for (var i = 0; i < d.length; i++) {
            handleDelta(d[i]);
        }
    }
    else applyDelta(d);
}

handleDelta(deltas)


console.log(doc1)

handleDelta(disconnectDelta)

console.log(doc1)

module.exports = {
    // deltas,
    doc1,
    scene
}

// console.log(test)