const applyDeltas = require('../deltas');


// blank scene
let scene = {
    nodes: {},
    arcs: {}

}

// make a local automerge doc from our scene
// let doc1 = Automerge.from(scene)

// delta functions
test('apply newnode delta', async () => {
    let delta = {
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
    }

    let result = { 
        nodes: { 
            noise_0: { 
                _props: {
                    kind: "noise",
                    orient: [
                        0.3121451653567321,
                        0.369889483526838,
                        0.14650496286711281,
                        0.8627186456637955
                    ],
                    pos: [
                        0.0605223497200336,
                        1.8,
                        0.0405112532755187
                    ]
                }
            } 
        }, 
        arcs: {} 
    }
    let foo = applyDeltas.newNode(delta, scene)
    expect(foo).toEqual(result)
})


test('apply newnode delta to existing path', async () => {
    let delta = {
        "op": "newnode",
        "path": "noise_0.out",
        "history": false,
        "index": 0,
        "kind": "outlet"
    }

    scene = { 
        nodes: { 
            noise_0: { 
                _props: {
                    kind: "noise",
                    orient: [
                        0.3121451653567321,
                        0.369889483526838,
                        0.14650496286711281,
                        0.8627186456637955
                    ],
                    pos: [
                        0.0605223497200336,
                        1.8,
                        0.0405112532755187
                    ]
                }
            }
        }, 
        arcs: {} 
    }

    let result = { 
        nodes: { 
            noise_0: { 
                _props: {
                    kind: "noise",
                    orient: [
                        0.3121451653567321,
                        0.369889483526838,
                        0.14650496286711281,
                        0.8627186456637955
                    ],
                    pos: [
                        0.0605223497200336,
                        1.8,
                        0.0405112532755187
                    ]
                },
                out:{
                    _props:{
                        "history": false,
                        "index": 0,
                        "kind": "outlet"
                    }
                }
            } 
        }, 
        arcs: {} 
    }
    
    let foo = applyDeltas.newNode(delta, scene)
    expect(foo).toEqual(result)
})

test('apply delnode delta to existing path', async () => {
    let delta = {
        "op": "delnode",
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
    }

    scene = { 
        nodes: { 
            noise_0: { 
                _props: {
                    kind: "noise",
                    orient: [
                        0.3121451653567321,
                        0.369889483526838,
                        0.14650496286711281,
                        0.8627186456637955
                    ],
                    pos: [
                        0.0605223497200336,
                        1.8,
                        0.0405112532755187
                    ]
                }
            }
        }, 
        arcs: {} 
    }

    let result = { 
        nodes: {}, 
        arcs: {} 
    }
    
    let foo = applyDeltas.delNode(delta, scene)
    expect(foo).toEqual(result)
})


test('apply connect delta', async () => {
    scene = {
        nodes: {},
        arcs: {}
    
    }
    let delta = {
        "op": "connect",
        "paths": [
            "noise_0.out",
            "speaker_1.input"
        ]
    }

    let result = {
        nodes: {},
        arcs: {
            "noise_0.out": ["speaker_1.input"]
        }
    
    }
    let foo = applyDeltas.connect(delta, scene)
    expect(foo).toEqual(result)
})

test('apply disconnect delta', async () => {
    scene = {
        nodes: {},
        arcs: {
            "noise_0.out": ["speaker_1.input"]
        }
    
    }
    let delta = {
        "op": "disconnect",
        "paths": [
            "noise_0.out",
            "speaker_1.input"
        ]
    }

    let result = {
        nodes: {},
        arcs: {}
    }
    let foo = applyDeltas.disconnect(delta, scene)
    expect(foo).toEqual(result)
})
