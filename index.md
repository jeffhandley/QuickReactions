---
layout: default
title: QuickReactions by jeffhandley - Isomorphic Hello World with React and Node
---

While working through sample after sample for Node.js and React.js, I experienced a pattern that wasn't very helpful. Instead of truly starting from scratch, the samples kept walking through step-by-step of cloning a working solution.  They'd start with "Step 1: paste this fully-working code into this file" and "Step 2: paste this fully-working code into this other file." I was having a hard time finding a breakdown of the concepts being applied.

I wanted to learn by starting truly from scratch and building the app up in logical, incremental steps. This tutorial uses the following approach:

1. Create a Hello World web server in Node.js
1. Introduce server-side React.js JSX compilation to use React.js on the server
1. Use Gulp to improve the development workflow
1. Extract a React.js component from the code and render it on the server
1. Introduce a client-side React.js component (without JSX) to render on the page
1. Refactor the client-side component to use JSX
1. Integrate the server-side and client-side React.js usage, achieving an "Isomorphic" page

Let's get started by getting Node.js serving a "Hello World" page.

[» Create a Hello World web server in Node.js](1-node-helloworld)