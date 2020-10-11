## Module 2

### Event loop
* recreate code from presentation\
 `microtasks.js`, 
 `node-vs-browser.js`, 
 `event-loop.js`, 
 `blocking-event-loop.js`, 
 `libuv.js`, 
 `child-process.js`, 
 `fork-main.js and fork-sub.js`,

* code that may behave differently on different runs
###### run:
```shell script
node different-behaviour.js
```
###### result:
```shell script
read utils.js
read microtasks.js
setTimeout
```
```shell script
read microtasks.js
read utils.js
setTimeout
```
```shell script
setTimeout
read microtasks.js
read utils.js
```
* write server with api that blocks loop (and prove it)
###### run:
```shell script
node event-loop-server.js
```
```shell script
node event-loop-client.js
```
###### result:
```shell script
Request #0: 1034ms
Request #1: 2030ms
Request #2: 3064ms
Request #3: 4070ms
Request #4: 5077ms
```

* same api non-blocking
###### run:
```shell script
node event-loop-server-non-bloking.js
```
```shell script
node event-loop-client.js
```
###### result:
```shell script
Request #0: 1101ms
Request #3: 1098ms
Request #1: 1099ms
Request #2: 1100ms
Request #4: 1099ms
```

* Question: event loop & streams (.on(‘data’, ...) handlers)


### Clusters
* recreate code from presentations\
 `cluster.js`, 

* create cluster with 6 workers. Run small server with some api. Run script that performs 100 calls to this server. Calculate on server how many requests handled each worker.
###### run:
```shell script
node cluster-server.js
```
```shell script
node cluster-client.js
```
###### result:
```shell script
# cluster-server.js
Master 20209 is running
Cluster 20210 started
Cluster 20211 started
Cluster 20212 started
Cluster 20213 started
Cluster 20215 started
Cluster 20214 started
...

# cluster-client.js
...
Request #97: Cluster 20215 was called 18 times
Request #96: Cluster 20211 was called 19 times
Request #95: Cluster 20210 was called 16 times
Request #93: Cluster 20212 was called 15 times
Request #94: Cluster 20213 was called 14 times
Request #99: Cluster 20212 was called 16 times
Request #92: Cluster 20214 was called 16 times
Request #98: Cluster 20215 was called 19 times
```

### Workers
* calculate n-th Fibonacci number on worker thread (can be as api)
###### run:
```shell script
node fibonacci.js
```
```shell script
curl localhost:3000?num=100
```
###### result:
```shell script
F(100) = 573147844013817200000
```
