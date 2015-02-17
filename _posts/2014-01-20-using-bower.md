---
title: Using Bower
---
I first started developing back when `jquery` was still a figment in John Resig's imagination. The only `js` files that were included were those to perform minor tasks, and some dynamic html.  The front end world, was simpler.

Now, working with front-end development has changed so dramatically.  Requirements for projects can be a moving target.  Staying up-to-date can be difficult, and a ton of time is wasted searching for required files to just get started is a pain.

This is where you need some help, and [`Bower`](http://bower.io/) is your answer.  It's super simple, and contiues to gain support from the developer community as a tool to adopt. Let me show you how you can utilize it in your workflow. You can follow along [on Github](https://github.com/kellyjandrews/bower-demo).

####Installing Bower
First, you need to have `node.js` and `npm` installed on your machine already.  If not, [this link](http://www.joyent.com/blog/installing-node-and-npm/) should help you out.

After you have those requirements, it get easier. First, install the package:

{% highlight console %}
(sudo) npm install -g bower
{% endhighlight %}

When that completes, you can always run `bower help` to get more information.

Some of these feature, you may never use, but my favorite is the `bower search` feature.  There are so many packages out there, it's hard to know where to begin.

Type in:
{% highlight console %}
bower search jquery
{% endhighlight %}


See what I mean? You can search right in your terminal. Another method to look for them has been presented by [Sindre Sorhus](https://github.com/sindresorhus) and you can [find it here](http://sindresorhus.com/bower-components/). It is a great search tool that is nicely laid out. Either way, you will be searching for your packages to get the proper name, so `Bower` knows what to install.

####Installing Packages
Speaking of install, let's do that now.

{% highlight console %}
bower install jquery
{% endhighlight %}


This command installs the latest version of `jquery`, right in your project under the `bower_components` sub-directory. Looking at the folder, you will notice that it does install every file from `jquery`.  This isn't too many here, but in some cases, there are a ton of files. For now, don't worry about that too much, and we can attack that later.

Using the `bower install` function for every library can get tedious, and really, defeats the purpose. So let's try another way.

####bower.json

Go ahead and run in your terminal

{% highlight console %}
bower init
{% endhighlight %}

Follow the prompts, you can hit enter for default, or fill out the info, your choice.

This process creates a file named `bower.json`.  This is where the magic happens. Let's say you want to also add [Bootstrap](http://getbootstrap.com/) to you project.

{% highlight console %}
bower install bootstrap --save
{% endhighlight %}

Now take a look at your `bower.json` file, and take note of the `dependencies` section.

{% highlight js %}
"dependencies": {
  "jquery": "~2.0.3",
  "bootstrap": "~3.0.3"
}
{% endhighlight %}

Now both `jquery` and `bootstrap` are listed as dependencies, and `bootstrap` is listed in your `bower_components` folder.  At this point, go ahead and delete this folder (leaving the `bower.json` file) and type in:

{% highlight console %}
bower install
{% endhighlight %}

Awesome - everything comes right back and installs with no problem. Now what if you aren't on the internet?

{% highlight console %}
bower cache list
{% endhighlight %}

They thought of this too, and now there is a cache of your previous installs.  You can wipe this out using

{% highlight console %}
bower cache clean
{% endhighlight %}

####Versioning

At this point, it makes sense to explain a little further the verion numbers and symbols.  

`Bower` uses [`semver`](https://github.com/isaacs/node-semver/) as it's version notation. The section there lays out the ranges you would need to know, and I won't repeat here. However, what you need to know is that you can get very specific with your versions.

Let's say your project MUST have `jquery` v 1.9.1, then in your `bower.json` file, use

{% highlight js %}
"jquery": "1.9.1"
bower install
{% endhighlight %}

Now if you look in your `bower_components` folder, and check out the `jquery.js` file, you will see it is indeed not version 1.9.1.  

Each individual package has a set of requirements, and `Bower` helps you through any versioning issues you may have.  If one library requires a new version of a different library, `Bower` will present you with various ways to resolve those problems, and update your `bower.json` file to correct those in the future.

This is where the power is, and the huge time saver.  I've spent hours trying to understand why I couldn't fix errors, only to find it was simply a library issue with versions.  Frustrating!  `Bower` does a great job giving you exactly what you need to get up and running.

####But wait - there's more!
Now that you are getting your libraries the easy way, what if your application structure looks like this:

{% highlight console %}
app
|--vendor
|--css
|--scripts
|--index.html
|--bower.json
{% endhighlight %}

And you don't want to reference `bower_components`.  You don't have to with the `.bowerrc` file and some configuration options. Create the file, and add:

{% highlight js %}
{
  "directory": "vendor"
}
{% endhighlight %}

Voila - now it fits a little better with your specific app layout.  There is a ton more you can do with the config file, but this is probably the most important for you to use.

####Wrap-up
It's easy to see that you can manage your project's dependencies using `Bower` and the `bower.json` file.   You can then couple this with a compiler like [`Grunt`](http://gruntjs.com/) or [`Brunch`](http://brunch.io/) to pull in the required files into your final build, and greatly reduce your time in getting projects out the door.  

I highly recommend trying it out and getting it into your workflow, if you haven't already started!
