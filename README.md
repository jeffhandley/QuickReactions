# Quick Reactions
## Isomorphic Hello World with React and Node

While working through sample after sample for Node.js and React.js, I experienced a pattern that wasn't very helpful. Instead of truly starting from scratch, the samples kept walking through step-by-step of cloning a working solution.  They'd start with "Step 1: paste this fully-working code into this file" and "Step 2: paste this fully-working code into this other file." But I haven't been able to find a breakdown of the concepts being applied.

I wanted to learn by starting truly from scratch and building the app up in logical, incremental steps. This tutorial (which is a work in progress) will use the following approach:

1. Create a Hello World web server in Node.js
1. Introduce server-side React.js JSX compilation to use React.js on the server
1. Use Gulp to improve the development workflow
1. Extract a React.js component from the code and render it on the server
1. Introduce a client-side React.js component (without JSX) to render on the page
1. Refactor the client-side component to use JSX
1. Integrate the server-side and client-side React.js usage, achieving an "Isomorphic" page

Let's get started!

### Create a new "project"
1. CD into a new directory
1. git init
1. npm init

### Get Node to emit Hello World with hard-coded HTML
Create `index.js` using the example webserver code from [https://nodejs.org](https://nodejs.org/).

``` js
var http = require('http')
http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'})
    res.end('<html><head><title>Hello World</title></head><body>index.js on the server</body></html>')
}).listen(1337)
console.log('Server running at http://localhost:1337/')
```

### Using the JSX Syntax
1. npm install react -save
1. Rename `index.js` to `index.jsx`

Update `index.jsx` to the following:
``` jsx
var http = require('http')
var React = require('react')

http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'})
    res.end(
        React.renderToString(
            <html>
                <head>
                    <title>Hello World</title>
                </head>
                <body>index.jsx compiled into index.js by hand on the server</body>
            </html>
        )
    )
}).listen(1337)
console.log('Server running at http://localhost:1337/')
```

### Get the react-tools installed
This will allow us to use React's JSX syntax and compile it to raw JS

1. npm install --global react-tools
1. npm install --save-dev react-tools

### Compile the JSX manually
Now if you run `jsx index.jsx > index.js` the JSX file will be compiled into raw JavaScript.  The output will match the following.

``` js
var http = require('http')
var React = require('react')

http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'})
    res.end(
        React.renderToString(
            React.createElement("html", null, 
                React.createElement("head", null, 
                    React.createElement("title", null, "Hello World")
                ), 
            React.createElement("body", null, "index.jsx compiled into index.js by hand on the server")
        ))
    )
}).listen(1337)
console.log('Server running at http://localhost:1337/')
```

You can now run `node index.js` and verify that the server still responds, now with "index.jsx compiled into index.js".  There's one more detail hidden under the covers here though; React has marked up the HTML with React data attributes that will allow React in the browser to understand the components that were rendered on the server.

If you view source in the browser, you'll see something like the following.

``` html
<html data-reactid=".qa6th1tqf4" data-react-checksum="-1942403816">
    <head data-reactid=".qa6th1tqf4.0">
        <title data-reactid=".qa6th1tqf4.0.0">Hello World</title>
    </head>
    <body data-reactid=".qa6th1tqf4.1">index.jsx compiled into index.js by hand on the server</body>
</html>
```

### Use Gulp to Automatically Transform JSX
After running JSX manually once, it's pretty clear that we won't want to keep running that every time we make a change.  Instead of running `JSX` and then `Node` over and over again, we'll use Gulp to automatically run JSX and Node for us.

1. npm install --global gulp
1. npm install --save-dev gulp

We'll need to create a `gulpfile.js` at the root of our project.  Let's start with their skeleton:

``` js
var gulp = require('gulp');

gulp.task('default', function() {
  // place code for your default task here
});
```

But then we'll create a `jsx` task that will use the `react-tools` package to transform our `index.jsx` file into a `./lib/index.js` file.

``` js
var gulp = require('gulp')
  , fs = require('fs')
  , reactTools = require('react-tools')

var transform = function(srcFile, destFile, cb) {
    console.log('Reading %s...', srcFile)

    var src = fs.readFile(srcFile, {encoding: 'utf8'}, function(readErr, data) {
        if (readErr) {
            cb(readErr)
        }
        else {
            console.log('Writing %s', destFile)
            fs.writeFile(destFile, reactTools.transform(data), function(writeErr) {
                if (writeErr) {
                    cb(writeErr)
                }
                else {
                    cb()
                }
            })
        }
    })
}

gulp.task('jsx', function(cb) {
    fs.mkdir('./lib', function(err) {
        transform('index.jsx', './lib/index.js', function(err) {
            cb(err)
        })
    })
})

gulp.task('default', function() {
    gulp.start('jsx')
})
```

Now if we run `gulp` from the terminal, it will run the JSX transformation for us.  We're halfway there; the other half is to make gulp spawn off a Node process for running the created `./lib/index.js` file too.  We can add in our `node` task, declare that it depends on the `jsx` task, and then make the default task start up our `node` task.

``` js
var gulp = require('gulp')
  , fs = require('fs')
  , reactTools = require('react-tools')
  , spawn = require('child_process').spawn

var transform = function(srcFile, destFile, cb) {
    console.log('Reading %s...', srcFile)

    var src = fs.readFile(srcFile, {encoding: 'utf8'}, function(readErr, data) {
        if (readErr) {
            cb(readErr)
        }
        else {
            console.log('Writing %s', destFile)
            fs.writeFile(destFile, reactTools.transform(data), function(writeErr) {
                if (writeErr) {
                    cb(writeErr)
                }
                else {
                    cb()
                }
            })
        }
    })
}

gulp.task('jsx', function(cb) {
    fs.mkdir('./lib', function(err) {
        transform('index.jsx', './lib/index.js', function(err) {
            cb(err)
        })
    })
})

gulp.task('node', ['jsx'], function() {
    spawn('node', ['./lib/index.js'], { stdio: 'inherit'})
})

gulp.task('default', function() {
    gulp.start('node')
})
```

We can still improve this though, simplifying our Gulp code and make it automatically restart everything if our JSX code changes.  We'll use the `gulp-react` package to take over the JSX transformation and the `gulp-nodemon` package to run Node for us.

1. npm uninstall react-tools --save-dev (this is no longer needed as a direct dependency)
1. npm install gulp-react --save-dev

Now, let's rewrite `gulpfile.js` to use gulp-react to process `*.jsx` files and put the output into the `lib` folder.  This is a lot simpler!

``` js
var gulp = require('gulp')
  , gulpReact = require('gulp-react')

gulp.task('jsx', function() {
    return gulp.src('*.jsx')
               .pipe(gulpReact())
               .pipe(gulp.dest('lib'))
})

gulp.task('default', function() {
    gulp.start('jsx')
})
```

Gulp's piping make this really clean.  And we can now use gulp-nodemon to take care of running Node for us.

1. npm install gulp-nodemon --save-dev

With this package in place, we can easily get Node to restart whenever a JS file is updated.  Here's our new `gulpfile.js` with that plugged in.

``` js
var gulp = require('gulp')
  , gulpReact = require('gulp-react')
  , gulpNodemon = require('gulp-nodemon')

gulp.task('jsx', function() {
    return gulp.src('*.jsx')
               .pipe(gulpReact())
               .pipe(gulp.dest('lib'))
})

gulp.task('node', ['jsx'], function() {
    gulpNodemon({
        script: 'lib/index.js',
        ext: 'js'
    })
})

gulp.task('default', function() {
    gulp.start('node')
})
```

To see the effects of this, try editing the `lib/index.js` file directly and you'll see that nodemon will restart the server for us right away.

To bring this all together, we need to get Gulp to watch our `index.jsx` file and call our `jsx` task whenever the file is touched. Then we run Gulp once and freely edit the index.jsx file and have the changes pick up automatically.

``` js
var gulp = require('gulp')
  , gulpReact = require('gulp-react')
  , gulpNodemon = require('gulp-nodemon')
  , gulpWatch = require('gulp-watch')

gulp.task('watch-jsx', ['jsx'], function() {
    gulpWatch('**/*.jsx', { ignored: 'lib/' }, function() {
        gulp.start('jsx')
    })
})

gulp.task('jsx', function() {
    return gulp.src('**/*.jsx')
               .pipe(gulpReact())
               .pipe(gulp.dest('lib'))
})

gulp.task('node', ['watch-jsx'], function() {
    gulpNodemon({
        script: 'lib/index.js',
        ignore: ['gulpfile.js'],
        ext: 'js jsx'
    })
})

gulp.task('default', function() {
    gulp.start('node')
})
```

Next, run Gulp to see that it starts the server after transforming `index.jsx` into `lib/index.js`.  Then edit `index.jsx` to have the following content.  After saving the file, you'll see that everything automatically reruns.

``` jsx
var http = require('http')
var React = require('react')

http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'})
    res.end(
        React.renderToString(
            <html>
                <head>
                    <title>Hello World</title>
                </head>
                <body>
                    index.jsx, automatically processed through gulp and gulp-react,
                    with node automatically restarted through gulp-nodemon!
                </body>
            </html>
        )
    )
}).listen(1337)
console.log('Server running at http://localhost:1337/')
```

### Creating a React Component
With Gulp running, let's create a new component and watch it automatically get transformed from a JSX file into a JS file under the `lib` folder.

Here is the component we'll create as the `Components/HelloWorld.jsx` file.

``` jsx
var React = require('react')

module.exports = React.createClass({
    render: function() {
        return (
            <div>
                This is from the HelloWorld.jsx component's render function.
            </div>
        )
    }
})
```

Now we will use this component from within `index.jsx` by first adding a `require` statement and then using an html-like JSX tag to reference the component.

``` jsx
var http = require('http')
  , React = require('react')
  , HelloWorld = require('./Components/HelloWorld')

http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'})
    res.end(
        React.renderToString(
            <html>
                <head>
                    <title>Hello World</title>
                </head>
                <body>
                    <HelloWorld />
                    <div>
                        Rendered from the Server!
                    </div>
                </body>
            </html>
        )
    )
}).listen(1337)
console.log('Server running at http://localhost:1337/')
```

Notice that in the `require` statement, we omit the file extension--the .js extension will be used automatically.  It's noteworthy that we've created the component as `Components/HelloWorld.jsx` but it will get transformed into `lib/Components/HelloWorld.js`.  Likewise, even though we're writing code in `index.jsx`, it will be running from `lib/index.js` where its relative path reference to `./Components/HelloWorld` will result in finding `lib/Components/HelloWorld.js`.  At first, I thought there would be some gymnastics or inconsistencies surfacing here, but since `require` assumes the `.js` file extension, it comes together pretty cleanly.

### Passing Properties to Components
Let's pass some properties to the HelloWorld component now!

In `index.jsx`, we'll simply add an attribute to the `<HelloWorld>` tag.

``` jsx
var http = require('http')
  , React = require('react')
  , HelloWorld = require('./Components/HelloWorld')

http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'})
    res.end(
        React.renderToString(
            <html>
                <head>
                    <title>Hello World</title>
                </head>
                <body>
                    <HelloWorld from="index.jsx on the server" />
                </body>
            </html>
        )
    )
}).listen(1337)
console.log('Server running at http://localhost:1337/')
```

Within the `Components/HelloWorld.jsx`, we'll make use of that `from` property.

``` jsx
var React = require('react')

module.exports = React.createClass({
    render: function() {
        return (
            <div>
                <div>
                    This is from the HelloWorld.jsx component's render function.
                </div>
                <div>
                    Rendered from: {this.props.from}
                </div>
            </div>
        )
    }
})
```

There's a noteworthy React/JSX tip to talk about here: Parse Errror: "Adjacent JSX elements must be wrapped in an enclosing tag."

In the `HelloWorld.jsx` file, I initially used the following code, and it resulted in this Adjacent JSX elements error.

``` jsx
var React = require('react')

module.exports = React.createClass({
    render: function() {
        return (
            <div>
                This is from the HelloWorld.jsx component's render function.
            </div>
            <div>
                Rendered from: {this.props.from}
            </div>
        )
    }
})
```

It took a few minutes to understand, but what was happening is the HelloWorld.jsx file's return statement had two adjacent `<div>` tags.  This syntax is unsupported; as the error message explains, the output must be wrapped in an outer element--I just wrapped the two `<div>` elements in an outer `<div>`, as seen above in the working code.

### React on the Client
On the server, we now have JSX automatically transforming into JS files, and we're using React to render a container page that uses a component, passing state into that component.  Now it's time to introduce React on the client!

React on the client is where many tutorials start out; this was backwards from my own needs where server rendering was more critical and client rendering was an added bonus.  While our end result will involve rendering the same component on the server and client, we'll start out by rendering server and client components separately to make sure we understand each concept in isolation before combining them.

Just like we did on the server, we'll start off using React on the client *without* the JSX syntax.  We'll first create a new file at `Components/Timestamp.js` with the following code.

``` js
var Timestamp = React.createClass({
    render: function() {
        return React.createElement("div", null, new Date().toString())
    }
})
```

This will serve as the foundation for our Timestamp component; we'll render this script inline within our HTML to start out.  To do that, we'll add the inline script to the response we're emitting from Node by editing the `index.jsx` file as follows.

``` jsx
var http = require('http')
  , React = require('react')
  , HelloWorld = require('./Components/HelloWorld')
  , fs = require('fs')

http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'})
    var body = React.renderToString(
                <body>
                    <HelloWorld from="index.jsx on the server"></HelloWorld>
                    <div id="reactContainer" />
                </body>)

        res.end('<html><head><title>Hello World</title><script src="//fb.me/react-0.13.1.js"></script>' + 
                '</head>' +
                '<script>' +
                fs.readFileSync('./Components/Timestamp.js') +
                '</script>' +
                body +
                '</html>'
        )

}).listen(1337)
console.log('Server running at http://localhost:1337/')
```

You might be wondering why we're not just referencing Timestamp.js through a `<script src="/Components/Timestamp.js"></script>` tag.  That's because we don't have any routing in place--all requests, regardless of URL, are getting the same response.  Don't worry though, we'll introduce some routing soon enough so that this file can get served up separately.

Okay, if you load the page with this in place you should see the inline JavaScript, but we're not doing anything with it yet.  Let's render this component using `React.render`.

``` jsx
var http = require('http')
  , React = require('react')
  , HelloWorld = require('./Components/HelloWorld')
  , fs = require('fs')

http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'})
    var body = React.renderToString(
                <body>
                    <HelloWorld from="index.jsx on the server"></HelloWorld>
                    <div id="reactContainer" />
                </body>)

        res.end('<html><head><title>Hello World</title><script src="//fb.me/react-0.13.1.js"></script>' + 
                '</head>' +
                '<script>' +
                fs.readFileSync('./Components/Timestamp.js') +
                '</script>' +
                body +
                '<script>' +
                'var timestampInstance = React.createFactory(Timestamp)();' +
                'setInterval(function() { React.render(timestampInstance, document.getElementById("reactContainer")) }, 500)' +
                '</script>' +
                '</html>'
        )

}).listen(1337)
console.log('Server running at http://localhost:1337/')
```

There are a few things to note here:

1. The script for rendering the component needs to be below the rest of the body of the page so that the "reactContainer" element exists.
1. We are using `React.createFactory(Timestamp)()` to get an instance of our component. Without this approach, React warns us about using components directly--using either JSX or a factory is what is suggested.
1. We are forcing the re-rendering of the component within our interval--we should instead use the component's state and just update its state to let React handle rendering.

### Updating Client-Side State
One of the primary value propositions of React is that it reacts to state changes and automatically and efficiently re-renders components when state changes.  Let's take advantage of that!

Something that threw me off at first was just *where* I'd find the `setState` method.  Here were the options:

1. On `Timestamp`, which is the result of `React.createClass()`
1. On the result of `React.createFactory(Timestamp)`
1. On `timestampInstance`, which is the result of `React.createFactory(Timestamp)()`
1. On the result of `React.render(timestampInstance, document.getElementById("reactContainer"))`

I tried them in that order and of course the correct answer was the last option.  But that makes sense--it is the *rendered* component that has state to be updated.  So now that we know what object we'll be able to call `setState` on, let's use some state in `Timestamp.js`.

``` js
var Timestamp = React.createClass({
    getInitialState: function() {
        return { date: "Initial State: " + new Date().toString() }
    },
    render: function() {
        return React.createElement("div", null, this.state.date)
    }
})
```

Our component now sets its initial state to show the date but include a message that it's the initial state.  If you reload the page right now, you'll see that the "Initial State" message is shown and even though we're calling `render` every 1/2 second, the timestamp never changes.  That's because we're rendering the component but we're never updating its state from the initial state.  To update the state and trigger automatic rendering, we'll change `index.jsx`.

``` jsx
var http = require('http')
  , React = require('react')
  , HelloWorld = require('./Components/HelloWorld')
  , fs = require('fs')

http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'})
    var body = React.renderToString(
                <body>
                    <HelloWorld from="index.jsx on the server"></HelloWorld>
                    <div id="reactContainer" />
                </body>)

        res.end('<html><head><title>Hello World</title><script src="//fb.me/react-0.13.1.js"></script>' + 
                '</head>' +
                '<script>' +
                fs.readFileSync('./Components/Timestamp.js') +
                '</script>' +
                body +
                '<script>' +
                'var timestampInstance = React.createFactory(Timestamp)();' +
                'var timestampElement = React.render(timestampInstance, document.getElementById("reactContainer"));' +
                'setInterval(function() { timestampElement.setState({ date: "Updated through setState: " + new Date().toString() }) }, 500)' +
                '</script>' +
                '</html>'
        )

}).listen(1337)
console.log('Server running at http://localhost:1337/')
```

Running the page now, you'll see the "Initial State" message for a 1/2 second and then it will change to "Updated through setState" and the timestamp will continue updating.  We are now updating the client-side component's state and React is automatically re-rendering the component for us.  Yay!

## References

Here are some of the other samples and posts I referenced along the way.

1. The example webserver at [https://nodejs.org/](https://nodejs.org/)
1. [http://facebook.github.io/react/docs/getting-started.html](http://facebook.github.io/react/docs/getting-started.html)
1. [http://facebook.github.io/react/docs/jsx-in-depth.html](http://facebook.github.io/react/docs/jsx-in-depth.html)
1. [http://www.crmarsh.com/react-ssr/](http://www.crmarsh.com/react-ssr/)
1. [https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md](https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md)
1. [https://www.npmjs.com/package/react-tools](https://www.npmjs.com/package/react-tools)
1. [http://www.sitepoint.com/getting-started-react-jsx/](http://www.sitepoint.com/getting-started-react-jsx/)
1. [http://www.smashingmagazine.com/2014/06/11/building-with-gulp/](http://www.smashingmagazine.com/2014/06/11/building-with-gulp/)
