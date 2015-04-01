---
title: Modular React Components With Browserify
comments: true
---

##Breaking Up Is Hard To Do
My last post walked through creating a quick mock up of a data grid component.  This works to get something displayed, but in the long run, is just impracticle to build anything useful. Sure you can build everything into separate `js` files, but even that is a little slow for my taste during the process.

The next logical step is to break our files up, and then introduce a simple build process to manage everything.  This isn't directly about React, meaning I won't be building anything using the React framework. Instead, I'm going to split up my data grid, use Browserify and Gulp to build everything, and BrowserSync to refresh the page automatically. I'll keep it simple for now, but may additionally add other options later.


##Getting The Requirements
Since we are adding some requirements to the build process, the first step is to get `npm` going. If you need to [install npm and node](https://docs.npmjs.com/getting-started/installing-node), do that now. If you prefer [IO](https://iojs.org/en/index.html), I've not done much there yet, but it's compatible with NPM.

{% highlight bash%}
npm init
{% endhighlight %}

From here, just follow the prompts, until the `package.json` file is built for you. Now we need a few packages to get things moving.

###Gulp
[Gulp](http://gulpjs.com/) is a task automation tool, and lately it's been my choice for running tasks.  There are arguments for and against, but I find the benefits out weigh the issues.  It's really up to you, but for this series, I'm using it, so strap in.

###Browserify
[Browserify](http://browserify.org/) is nearly black magic, in my opinion.  It let's me write my front end code in a CommonJS pattern, and then precompiles all of my scripts into one file.  It's really something awesome. You can also use [webpack](http://webpack.github.io/) which appears to be equally as straight forward, but I learned Browserify first.  There are, of course, debates on which is better.

There is another module I'll need for Browserify and Gulp to work together, which is [Vinyl Source Stream](https://www.npmjs.com/package/vinyl-source-stream).  This allows me to use Browserify directly, as opposed to `gulp-browserify` or `gulpify`.  I'm going to keep the requirements to a minimum, so this is all I will add for now.

###Babel(ify)
[Babel](https://babeljs.io/) is an es6 and React transformer. It will be used in the bundle process of Browserify, and allow us to use es6 export/imports. Babelify is the transformer that Browserify uses specifically.

###React
We could continue to include this from the CDN, but I'm going to move it locally. In a production app - having this localized to the app makes sense - you really don't want to rely on a third party to be up, even if that's what it's designed to do. Sometimes bad things happen, so why chance it.

###The Standards
[jQuery](http://jquery.com/) and [Bootstrap](getbootstrap.com) - if you don't know what these are - then you probably aren't reading this. I've also included Browser Sync to reload the browser when I save and build the bundles, and Gulp Watch to watch the files as they change.

That covers it - now we save these as development dependencies:

{% highlight bash %}
npm i --save-dev react bootstrap jquery vinyl-source-stream gulp browserify babelify browser-sync
{% endhighlight %}

##Building the Build File
Now that we have all the pieces, let's build out the process. The first step we need is our `Gulpfile.js`.  I often make this a more modular, which you can see in the source code of this blog, but for this project, I'm going to keep it all in one spot.

###Dealing with Externals
Bootstrap, jQuery, and React are not going to change while I'm developing. They may change, but not every time I save my files. It takes extra time to bundle these, so the first thing I want to do is create a bundle with just these libraries, that way I'm only rebuilding my data grid files when saving.


{% highlight js %}
var vendors = [
  'react',
  'bootstrap',
  'jquery'
];

gulp.task('vendors', function () {
    var stream = browserify({
            debug: false,
            require: vendors
        });

    stream.bundle()
          .pipe(source('vendors.js'))
          .pipe(gulp.dest('build/js'));

    return stream;
});
{% endhighlight %}

I create an array with the vendors I want to include. I then pull these into a gulp task and bundle them.  The output is the `vendors.js` file in my build directory.  This works for now - but you can eventually watch for production vs development environments and minify accordingly. I'm keeping it simple for the moment to make the process clearer.

{% highlight bash %}
$ gulp vendors
Using gulpfile ~/Apps/react-tutorial/Gulpfile.js
Starting 'vendors'...
Finished 'vendors' after 15 ms
{% endhighlight %}

`vendor.js` file now shows up in the `build/js` directory.

###App Files
Now we need to create some new folders for our `jsx` files to be stored. I made an app folder, and created an `app.jsx` file.  `app.jsx` will require the additional files needed to run the data grid. I'll show you how that's set up in a bit. First, let's look at the gulp task.

{% highlight js %}
gulp.task('app', function () {
    var stream = browserify({
            entries: ['./app/app.jsx'],
            transform: [babelify],
            debug: false,
            extensions: ['.jsx'],
            fullPaths: false
        });

    vendors.forEach(function(vendor) {
        stream.external(vendor);
    });

    return stream.bundle()
                 .pipe(source('data-grid.js'))
                 .pipe(gulp.dest('build/js'));
});
{% endhighlight %}

This is very similar to the vendor task, but I add a couple of items that need to be explained. I add the `entries`, `transform`, `extensions`, and `fullPaths` properties to the stream. This tells Browserify where my initial file is located, what transforms to perform - in this case Babelify (which is runnint the react transform), which extensions are valid, and not require the full path.  I then iterate over the `vendors` array and create external resources, so Browserify doesn't pull those into my `data-grid.js` file.

{% highlight bash %}
$ gulp app
Using gulpfile ~/Apps/react-tutorial/Gulpfile.js
Starting 'app'...
Finished 'app' after 15 ms
{% endhighlight %}

Now that my static libs and app files are set up to build independently, I need to modify my index file to use those files.

{% highlight html %}
<script src="build/js/vendors.js"></script>
...
<script src="build/js/data-grid.js"></script>
{% endhighlight %}

I am leaving the Bootstrap css file as is for now, but we could easily move that into it's own gulp task and call it from a local place.

##Separate Components
We are nearly there, just a couple more steps to really get this in a place that development is simple. The next step is to move the individual components into their own files. This is a little repetitive, so I'll just show the initial component and the repo will show the final versions.

Let's first take a look at the `app.jsx` file, and how we are now using ES6 modules.

{% highlight js %}
import React from 'react';

class DataGrid extends React.Component{
  anotherMethod() {

  },
  render() {
    return (
      <div>
        <div className="row">
          <TitleBar />
        </div>
        <div className="dataTable">
          <DataTable />
        </div>
          <Pagination />
      </div>
    );
  }
};

React.render(<DataGrid />, document.getElementById('dataGrid'));
{% endhighlight %}

You will need to rerun `gulp app`.

If you haven't read up on using ES6, there is a [great tutorial](http://www.jayway.com/2015/03/04/using-react-with-ecmascript-6/) on using them with react. This is the future of javascript - and I like it.

The `app.jsx` file is still missing a few items to get it working. We have yet to import the additional components.  Let's start with the `TitleBar` component.

{% highlight js %}
import React from 'react';

class TitleBar extends React.Component{
  render() {
    return (
      <div>
        <div className="col-md-6">
          <h2>My Contacts</h2>
        </div>
        <div className="col-md-6 searchBox">
          <input type="text" className="form-control pull-right" placeholder="Search" />
        </div>
      </div>
    );
  }
};

export default TitleBar;
{% endhighlight %}

With some quick modifications - our `TitleBar` component is ready to be consumed by our `app.jsx` file. I already have made the other modules as well in a similar fashion, so now our `app.jsx` file starts with:

{% highlight js %}
import React from 'react';
import TitleBar from './title-bar';
import DataTable from './datatable';
import Pagination from './pagination';
{% endhighlight %}

####Bootstrap and jQuery are Missing

Even with all of this, Bootstrap and jQuery don't just automatically work. The best solution I currently have for this is to add the following just below the lines above in `app.jsx`.

{% highlight js %}
import jQuery from 'jquery';
global.jQuery = jQuery;
import bootstrap from 'bootstrap';
{% endhighlight %}

This feel terribly wrong to me - but I know it works.  I hate using the global variable, and eventually I will land on the right combination to resolve this, and get it sorted. For now. This is what I have.

Rerun `gulp app` and we are back where we started. This may seem like a lot of work - but in the long run, it pays off.

##Auto Reload
Now that we have gotten this far, there is one last step - auto reloading when we change something.  If you have been following along, you might notice that every time you change a `.jsx` file, you have to run `gulp app` to rebuild your `data-grid.js` file. This is a pain, and often forgotten (at least for me)

So let's use Gulp to do that for us, by watching for changes, and running it automatically.

{% highlight js %}
gulp.task('watch', ['app'], function () {
  gulp.watch(['./app/**/*.jsx'], ['app'])
});
{% endhighlight %}

This is super simple - watch all `.jsx` files, and run the `app` task when they change. Now it's reloading without our manual input.

One last automation step, and we can call it a day.
{% highlight js %}
gulp.task('browsersync',['vendors','app'], function () {
    browserSync({
  		server: {
  			baseDir: './'
  		},
  		notify: false,
  		browser: ["google chrome"]
	});
});
{% endhighlight %}

This allows us to fire up a testing server, and loads a browser window when we run it. I include the `vendor` and `app` gulp task here to ensure they are complete prior to starting the server. I then slightly modify my `watch` task, and add a `default` task to run using `gulp`.

{% highlight js %}
gulp.task('watch', [], function () {
  gulp.watch(['./app/**/*.jsx'], ['app', browserSync.reload]);
});

gulp.task('default',['browsersync','watch'], function() {});
{% endhighlight %}

Now when I run `gulp`, a browser window opens with the app running.  Modify any of the `.jsx` files, and it reloads automatically.

##Wrap Up
This is my workflow - it's what I know works, and works for me.  There are tons of additional ways to go about the same tasks, and you can modify these for additional support like less preprocessing, minification, sourcemaps, and others.  This will hopefully be a good starting point to explore more, without making it so complicated that understanding the pieces takes additional work.

I've update my [GitHub repo](https://github.com/kellyjandrews/react-tutorial/tree/modular-build) with the source code from this tutorial.  Next steps will be to start building out the components using actual data and not static `render` methods.

####Data Grid Tutorials
1. [React - Up and Running](http://www.kellyjandrews.com/2015/03/30/react-up-and-running.html)
2. Modular React Components With Browserify
