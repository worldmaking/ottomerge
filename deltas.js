const Automerge = require('automerge')
const _ = require('lodash')

let newNode = function(delta, scene){
    let doc1 = Automerge.from(scene)
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
        })
        return doc1
    } else {
        delete delta.op
        path = delta.path
        delete delta.path
        doc1 = Automerge.change(doc1, doc => {
            _.set(doc1.nodes, path, {_props: delta});
        })
        return doc1;
    }
}

let delNode = function(delta, scene){
    let doc1 = Automerge.from(scene)
    doc1 = Automerge.change(doc1, doc => {
        _.unset(doc1.nodes, delta.path);
    })
    return doc1
}

let connect = function(delta, scene){
    let doc1 = Automerge.from(scene)
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
    
    return doc1
}

let disconnect = function(delta, scene){
    let doc1 = Automerge.from(scene)
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
    return doc1
}
module.exports = {
    newNode: newNode,
    delNode: delNode,
    connect: connect,
    disconnect: disconnect
}