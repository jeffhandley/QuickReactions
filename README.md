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
        </html>)
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

gulp.task('node', ['jsx'], function(cb) {
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

gulp.task('jsx', function(cb) {
    return gulp.src('*.jsx')
               .pipe(gulpReact())
               .pipe(gulp.dest('lib'))
})

gulp.task('default', function() {
    gulp.start('jsx')
})
```

Gulp's piping make this really clean.  And we can now use gulp-nodemon to take care of running Node for us.


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