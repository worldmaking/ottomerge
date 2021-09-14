const applyDeltas = require('../deltas');
const Automerge = require('automerge')


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

// test('apply disconnect delta', async () => {
//     scene = {
//         nodes: {},
//         arcs: {
//             "noise_0.out": ["speaker_1.input"]
//         }
    
//     }
//     let delta = {
//         op: "propchange", 
//         path: delta.path,
//         name: delta.name,
//         from: delta.to,
//         to: delta.from
    
//     }

//     let result = {
//         nodes: {},
//         arcs: {}
//     }
//     let foo = applyDeltas.disconnect(delta, scene)
//     expect(foo).toEqual(result)
// })

test('build scene -- problem: won\'t add more than one parent node', async() => {

    let scene = {
        nodes: {},
        arcs: {}
    }
    let doc1 = Automerge.from(scene)

    let deltas = [
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
        {
            "op": "newnode",
            "path": "noise_0.out",
            "history": false,
            "index": 0,
            "kind": "outlet"
        },
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
        {
                "op": "newnode",
                "path": "speaker_1.input",
                "index": 0,
                "kind": "inlet"
        },
        {
            "op": "connect",
            "paths": [
                "noise_0.out",
                "speaker_1.input"
            ]
        }
    ]
    // let deltas = [
    //      {
    //       "op": "newnode",
    //       "path": "lfo_1",
    //       "kind": "lfo",
    //       "category": "abstraction",
    //       "pos": [
    //        -0.3,
    //        1.5,
    //        -1
    //       ],
    //       "orient": [
    //        0,
    //        0.258819,
    //        0,
    //        0.965926
    //       ]
    //      },
         
    //       {
    //        "op": "newnode",
    //        "path": "lfo_1.rate",
    //        "kind": "large_knob",
    //        "range": [
    //         0.1,
    //         30
    //        ],
    //        "taper": "log 3.8",
    //        "value": 10,
    //        "unit": "Hz"
    //       },
    //       {
    //        "op": "newnode",
    //        "path": "lfo_1.fm_cv",
    //        "kind": "inlet",
    //        "index": 0
    //       },
    //       {
    //        "op": "newnode",
    //        "path": "lfo_1.index",
    //        "kind": "small_knob",
    //        "range": [
    //         0,
    //         10
    //        ],
    //        "taper": "linear",
    //        "value": 1,
    //        "unit": "float"
    //       },
    //       {
    //        "op": "newnode",
    //        "path": "lfo_1.pulse_width",
    //        "kind": "small_knob",
    //        "range": [
    //         0,
    //         1
    //        ],
    //        "taper": "linear",
    //        "value": 0.25,
    //        "unit": "float"
    //       },
    //       {
    //        "op": "newnode",
    //        "path": "lfo_1.pulse_width_cv",
    //        "kind": "inlet",
    //        "index": 2
    //       },
    //       {
    //        "op": "newnode",
    //        "path": "lfo_1.onset",
    //        "kind": "small_knob",
    //        "range": [
    //         0,
    //         1
    //        ],
    //        "taper": "linear",
    //        "value": 0.1,
    //        "unit": "float"
    //       },
    //       {
    //        "op": "newnode",
    //        "path": "lfo_1.phasor_sync",
    //        "kind": "inlet",
    //        "index": 1
    //       },
    //       {
    //        "op": "newnode",
    //        "path": "lfo_1.sine",
    //        "kind": "outlet",
    //        "index": 0,
    //        "history": true
    //       },
    //       {
    //        "op": "newnode",
    //        "path": "lfo_1.phasor",
    //        "kind": "outlet",
    //        "index": 1,
    //        "history": false
    //       },
    //       {
    //        "op": "newnode",
    //        "path": "lfo_1.pulse",
    //        "kind": "outlet",
    //        "index": 2,
    //        "history": false
    //       },
    //       {
    //        "op": "newnode",
    //        "path": "lfo_1.sine_index",
    //        "kind": "outlet",
    //        "index": 3,
    //        "history": false
    //       },
    //       {
    //        "op": "newnode",
    //        "path": "lfo_1.saw",
    //        "kind": "outlet",
    //        "index": 4,
    //        "history": false
    //       },
    //     {
    //       "op": "newnode",
    //       "path": "vca_1",
    //       "kind": "vca",
    //       "category": "abstraction",
    //       "pos": [
    //        0.5,
    //        1.8,
    //        -1
    //       ],
    //       "orient": [
    //        0.25,
    //        -0.25,
    //        0.066987,
    //        0.933013
    //       ]
    //     },
    //     {
    //        "op": "newnode",
    //        "path": "vca_1.signal",
    //        "kind": "inlet",
    //        "index": 0
    //     },
    //     {
    //        "op": "newnode",
    //        "path": "vca_1.cv",
    //        "kind": "inlet",
    //        "index": 1
    //     },
    //     {
    //        "op": "newnode",
    //        "path": "vca_1.cv_amount",
    //        "kind": "large_knob",
    //        "range": [
    //         0,
    //         1
    //        ],
    //        "taper": "linear",
    //        "value": 0.5,
    //        "unit": "float"
    //     },
    //     {
    //        "op": "newnode",
    //        "path": "vca_1.bias",
    //        "kind": "large_knob",
    //        "range": [
    //         0,
    //         1
    //        ],
    //        "taper": "linear",
    //        "value": 0.5,
    //        "unit": "float"
    //     },
    //     {
    //        "op": "newnode",
    //        "path": "vca_1.output",
    //        "kind": "outlet",
    //        "index": 0,
    //        "history": true
    //     },
    //     {
    //      "op": "connect",
    //      "paths": [
    //         "dualvco_1.master",
    //         "pulsars_1.signal"
    //      ]
    //     },
    //     {
    //      "op": "connect",
    //      "paths": [
    //         "lfo_2.saw",
    //         "vca_1.signal"
    //      ]
    //     },
    //     {
    //      "op": "connect",
    //      "paths": [
    //         "lfo_1.sine",
    //         "vca_1.cv"
    //      ]
    //     },
    //     {
    //      "op": "connect",
    //      "paths": [
    //         "vca_1.output",
    //         "dualvco_1.rate_1_cv"
    //      ]
    //     },
    //     {
    //      "op": "connect",
    //      "paths": [
    //         "vca_1.output",
    //         "pulsars_1.period_cv"
    //      ]
    //     },
    //     {
    //      "op": "connect",
    //      "paths": [
    //         "pulsars_1.output",
    //         "lfo_1.fm_cv"
    //      ]
    //     },
    //     {
    //      "op": "connect",
    //      "paths": [
    //         "pulsars_1.output",
    //         "speaker_1.input"
    //      ]
    //     },
    //     {
    //         "op": "connect",
    //         "paths": [
    //             "pulsars_1.output",
    //             "pulsars_1.formant_cv"
    //         ]
    //     }
    // ]

    // loop through deltas
    for(i=0;i<deltas.length;i++){
        switch (deltas[i].op){
            
            case "newnode":
                scene = applyDeltas.newNode(deltas[i], doc1)

            break

            case "connect":
                scene = applyDeltas.connect(deltas[i], scene)
            break
        }
    }
    console.log(scene)

})