MNUG RSMQ DEMO
--

This repository represents the demo for the presentation:  
**Scalable Cloud Solutions with Node.js**  
*[munich node.js user group - Meetup: 26th February 2015](http://mnug.de/artikel/meetups/february2015)*

This demo will convert a bunch of images to grayscale.
To solv this it makes use of the queue module **[rsmq](https://github.com/smrchy/rsmq)** and **[rsmq-worker](https://github.com/mpneuried/rsmq-worker)** as worker.

## Install

**Install and run redis-server**
Howto see http://redis.io/download

**Install GraphicsMagick**
Howto see https://github.com/aheckmann/gm

**Install node dependencies**
```sh
  npm install
```

## Configuration

To configure the this simple demo you have to add a `config.json` file.

It should look like this:

```js
{
	"qname": "your_queue_name",
	"inputFolder": "/absolut/path/to/your/sourcefolder/",
	"outputFolder": "/absolut/path/to/your/targetfolder/" 
}
```

Make sure both configured folders `inputFolder` and `outputFolder` exists.

Currently this demo will just use a local running redis server.

## Usage

There are three scripts you have to use ...

### 1. create queue

**`create.js`**

This scripts creates the configured queue if not existed.
It will also return the current count of messages to the console.

**Example:**

```sh
$ node create.js
Message-count:  1337
```

### 2. send files/messages

**`send.js`**

This script reads the configured `inputFolder` and will create/send a queue message for every found file.

**Example:**

```sh
$ node send.js
send file myimage_001.jpg
send file myimage_002.jpg
...
send file myimage_665.jpg
send file myimage_666.jpg
666 FILES SEND
```

### 3. run worker


**`worker.js`**

This is an implementation of [rsmq-worker](https://github.com/mpneuried/rsmq-worker).
It polls [rsmq](https://github.com/smrchy/rsmq) for messages to process.

In this demo every message will be a filepath wich, in case of an image, will be converted to grayscale and written to the configured `outputFolder``.

**It is possible and recommended to run multiple instances of this worker**

**Example:**

```sh
$ node worker.js
file written myimage_001.jpg
file written myimage_002.jpg
...
```

## Release History
|Version|Date|Description|
|:--:|:--:|:--|
|0.0.1|2015-02-26|Initial version|

## Other projects

|Name|Description|
|:--|:--|
|[**rsmq**](https://github.com/smrchy/rsmq)|A really simple message queue based on Redis|
|[**rsmq-worker**](https://github.com/mpneuried/rsmq-worker)|Helper to simply implement a worker [RSMQ ( Redis Simple Message Queue )](https://github.com/smrchy/rsmq).|
|[**redis-notifications**](https://github.com/mpneuried/redis-notifications)|A redis based notification engine. It implements the rsmq-worker to safely create notifications and recurring reports.|
|[**node-cache**](https://github.com/tcs-de/nodecache)|Simple and fast NodeJS internal caching. Node internal in memory cache like memcached.|
|[**redis-sessions**](https://github.com/smrchy/redis-sessions)|An advanced session store for NodeJS and Redis|
|[**obj-schema**](https://github.com/mpneuried/obj-schema)|Simple module to validate an object by a predefined schema|
|[**connect-redis-sessions**](https://github.com/mpneuried/connect-redis-sessions)|A connect or express middleware to simply use the [redis sessions](https://github.com/smrchy/redis-sessions). With [redis sessions](https://github.com/smrchy/redis-sessions) you can handle multiple sessions per user_id.|
|[**systemhealth**](https://github.com/mpneuried/systemhealth)|Node module to run simple custom checks for your machine or it's connections. It will use [redis-heartbeat](https://github.com/mpneuried/redis-heartbeat) to send the current state to redis.|
|[**task-queue-worker**](https://github.com/smrchy/task-queue-worker)|A powerful tool for background processing of tasks that are run by making standard http requests.|
|[**soyer**](https://github.com/mpneuried/soyer)|Soyer is small lib for serverside use of Google Closure Templates with node.js.|
|[**grunt-soy-compile**](https://github.com/mpneuried/grunt-soy-compile)|Compile Goggle Closure Templates ( SOY ) templates inclding the handling of XLIFF language files.|
|[**backlunr**](https://github.com/mpneuried/backlunr)|A solution to bring Backbone Collections together with the browser fulltext search engine Lunr.js|


## The MIT License (MIT)

Copyright © 2015 Mathias Peter, http://www.tcs.de

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.