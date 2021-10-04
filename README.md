# ottomerge
mischmasch automerge lib
server<>client: automerge messages to server should just be broadcast out. let the clients handle the sync'ing, because each peer needs to maintain a syncState for each other peer. 


to do:
- push server to heroku
- have server host a webpage