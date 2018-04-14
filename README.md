# gRPC minimal examples

----

### What is this?

(Not so) minimal examples of gRPC client and server in Python and Node.js.

These examples are based on default gRPC examples: they showcase 4 types of calls 
available in gRPC, similarly to 
[Route Guide](https://grpc.io/docs/tutorials/basic/python.html) examples, 
but without the unnecessary complexity of geolocation, just like in the 
intuitive [Greeter](https://grpc.io/docs/quickstart/python.html) examples. 

The mentioned 4 types of calls are:

 - one-request-to-one-response "unary" call
 - one-request-to-many-responses "server streaming" call
 - many-requests-to-one-response "client streaming" call
 - many-requests-to-many-responses "bidirectional streaming" call

--

### What's inside?

 - `protos/`     Service definitions
 - `python/`     Example in Python 3
 - `node/`       Example in Node.js

Clients and servers in different languages use the same service definition,
so they can talk with each other. For example, Python server can respond 
to Node.js client and vice-versa. Protobuf magic!


### Howto: gRPC with Python 3

This example assumes Python 3 is installed and ready to go. It's likely is, 
but you may check it, just in case:

```
python --version
python3 --version
```

Create a virtual environment and install the required dependencies 
(see `python/requirements.txt` for the list):

```
cd grpc-minimal-example/python
virtualenv --python=python3 venv
python -m pip install --upgrade pip
python -m pip install --upgrade -r requirements.txt
```

Activate virtual environment:

```
source venv/bin/activate
```

Run server:

```
python server.py
```

In another instance of terminal, activate virtual environment and run client:

```
cd grpc-minimal-example/python
source venv/bin/activate
python3 client.py
```
---


### Howto: gRPC with Node.js

This example uses Node.js and EcmaScript 6/7 flavour of JavaScript via Babel.
Check if you have Node.js >= 8 installed:

```
node --version
```

If you don't have it yet, install it. For example, on Linux x64, from official 
package:

```
cd grpc-minimal-example/node
wget https://nodejs.org/dist/v8.11.1/node-v8.11.1-linux-x64.tar.gz
tar -xf node-v8.11.1-linux-x64.tar.gz
mv node-v8.11.1-linux-x64 node
```

Add `node/bin` and `node_modules/.bin` to PATH:

```
export PATH="$(pwd)/node/bin:$(pwd)/node_modules/.bin${PATH:+:$PATH}"
```

Install dependencies (see `node/package.json` for the list):

```
npm install -g npm yarn
yarn install
```

Run server:

```
babel-node server.js
```

In another instance of terminal run client (don't forget to setup `PATH`):

```
export PATH="$(pwd)/node/bin:$(pwd)/node_modules/.bin${PATH:+:$PATH}"
babel-node client.js
```
---

### Recommended reading:

 - [gRPC documentation for Python](https://grpc.io/docs/tutorials/basic/python.html)
 - [gRPC documentation for Node.js](https://grpc.io/docs/tutorials/basic/node.html) 
 - [Protocol Buffers Developer Guide](https://developers.google.com/protocol-buffers/docs/overview)
 - [ES6 features](http://es6-features.org)
