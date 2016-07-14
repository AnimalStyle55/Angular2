# Welcome to Angular Boot Camp

## Online (Cloud 9 IDE) Development

The fastest way to get started, without any local tool installation,
is to set up a Cloud 9 instance (as described in the pre-class
information, for online classes), then run this command in the Command
Line section of your Cloud 9 workspace:

```
source <(curl -s https://angularbootcamp.com/c9a2)
```

This will install and configure the software, and start "live-server"
serving the class content.

## Local Development

### Install Node (which includes NPM)

https://nodejs.org/en/

Choose the current (6.x or later) version. Angular official
prerequisites are Node 5.x or higher, not Node 4.x.

Installers are available for Windows and Mac; on Linux you can
probably obtain it using your package manager easily.

### Download and unzip the course materials

Download the following:

https://angularbootcamp.com/learn2.zip

Then unzip it. Put the files anywhere convenient on your computer.

### Set up a web server

You will also need to serve the content of this zip file. If you have
a favorite web server, feel free to use it. If not, you can download
live-server using NPM:

```
npm install -g live-server
```

### Serve the files

**Important**: Serve the "learn2" directory as your "web root". You
will not need to restart your web server as we move from one step to
the next, and each example will be able to see the shared library
files and data files.

Navigate to the learn2 directory (cd learn2), then run the server:

```
live-server
```

## Introduction to "learn2" - the first part of the class

This is a standalone, ready-to-use set of files, sufficient for
starting the class. The only tools truly necessary for this portion
are a text editor and a web server.

You need to serve these files via a web server; for most exercises, it
will not work acceptably to load them directly from "file" URLs. You
might already have a web server on your machine that can be used, or
your IDE might contain a web server.

Live server conveniently includes "live reload" in the box. It will
automatically inject pages it serves with a bit of JavaScript to
access a web socket to automatically reload the page when the source
files change. This means you will not have to click refresh in the
browser.

### Optional: Typings

NPM Install will bring in all the typings you need.

```
npm install
```

