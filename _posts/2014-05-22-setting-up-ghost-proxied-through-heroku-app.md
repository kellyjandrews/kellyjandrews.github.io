---
title: Ghost Proxied Through Heroku App
comments: true
---

Over the last couple of days, I have been pounding my head against the wall of what is known as a proxy. I wanted to capture everything I did to make it work, and hope it helps someone down the road attempting the same thing.

####Background
I have been working on documentation utilizing [Assmeble.io](http://www.assemble.io) - a great Static-Site-Generator (SSG) created by [Jon Schlinkert](https://github.com/jonschlinkert) and [Brian Woodward](https://github.com/doowb). Great tool to build out documentation.  

I am pushing my static files to [Heroku](http://www.heroku.com/), and using [Expressjs](http://expressjs.com/) to serve the static files.  This part was super simple with the following code:

{% highlight js %}
var express = require('express');

var app = express();

process.env.PWD = process.cwd()
app.use(express.static(process.env.PWD + '/public'));

var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
  console.log("Listening on " + port);
});
{% endhighlight %}

Everything worked great, and it's super fast. Anyone looking to create documentation - it's a great way to go, and I'll be blogging more about how this works in the coming weeks.

####Additional Requirements
Assmeble.io offers a method of blogging.  For most of us, it's fairly straight forward, and if you have developers doing your blogging, it will work for you.  It involves rebuilding your static `html` files and pushing up the changes.  

For those who are less inclined to create files and push code to a server, you may want to consider an alternative. I found myself needing a blogging platform that required a bit more non-developer love.

Since Assemble is build on [Node](http://nodejs.org/), [Grunt](http://gruntjs.com/), and [Handlebars](http://handlebarsjs.com/), the most logical choice was [Ghost](https://ghost.org/).  I went this direction in order to keep my templating straight forward and not recode them in order to use something like [Wordpress](http://wordpress.org/) where I would need to change them into `PHP`.

I easily made a new Grunt task to take my existing templates, and built new template files specifically for Ghost. How I did this is out of scope for this article, but something I want to share in the future, so watch for that in the next couple weeks.

####Seperation of Concerns
What I quickly realized, was that I couldn't easily run two Express apps on one Heroku app. Realistically - you probably shouldn't anyhow, so it needed to be a seperate app.  I now have two Heroku apps running - {site}.herokuapp.com and {site-blog}.herokuapp.com.

Each app ran individually as expected, and things were looking like it was the right direction.

####Then I Hit a Brick Wall
Setting up a [Node-HTTP-Proxy](https://github.com/nodejitsu/node-http-proxy) looked like it was the way to go.  It all seemed fairly easy at first, but I had to work around some issues.

Adding the following code get's the proxy started:

{% highlight js %}
var httpProxy = require('http-proxy');
var proxy = new httpProxy.createProxyServer();
{% endhighlight %}

You then need to set up the routes to work correctly. I wanted to use {site}.herokuapp.com/blog to serve up my blog site.  In Ghost, there are a few `HTTP` methods you have to be concerned with for it al to function properly - `GET`, `POST`, `PUT`, `DELETE`.  So far, these are all of the ones I have run into, but if any others pop up, you would cut and past the same code and change the method.

I started with (only listing the `GET` route here):

{% highlight js %}
app.get('/blog*', function (req, res, next) {
    proxy.web(req, res, {
        target: '{site-blog}.herokuapp.com'
    });
});
{% endhighlight %}

I tried various formats of this, getting hit with `503`, `500`, and `404` errors, or simply a blank page. What once seemed to be working locally - was no longer functioning as expected.

I finally got back an error in Heroku reading "No Such App". I was getting close. Google search popped up with a post on [StackOverflow](http://stackoverflow.com/questions/6444280/heroku-no-such-app-error-with-node-js-node-http-proxy-module) which FINALLY (I at this point spent about 10 hours trying to get settings to work). I modified my code to this:

{% highlight js %}
app.get('/blog*', function (req, res, next) {
  req.headers.host = '{site-blog}.herokuapp.com';
    proxy.web(req, res, {
        target: '{site-blog}.herokuapp.com'
    });
});
{% endhighlight %}

After pushing the changes to Heroku - I fired it up, and got a `404` - from Ghost. This is where some folks would lose it - after all the frustration, still getting nowhere. However - I knew differently - this was a huge win - I got something back from the server.

The final change I had to make was on the Ghost `config.js` file.  I'm running my `NODE_ENV` as production, so my production object initially looked like this:

{% highlight js %}
production: {
    url: '{site-blog}.herokuapp.com',
    mail: {},
    database: {
        client: 'postgres',
        connection: {
            host: '{myhost}',
            user: '{myuser}',
            password: '{mypassword}',
            database: '{mydbname}',
            port: '{myport}'
        },
        debug: false
    },
    server: {
        host: '0.0.0.0',
        port: Number(process.env.PORT || 2368)
    }
},
{% endhighlight %}

This is fine if I'm running it as normal, but I'm running as a subdirectory, and a proxy. So I changed the `url` to this:

{% highlight js %}
url: '{site}.herokuapp.com/blog',
{% endhighlight %}

Now it was expecting to see the base files served from my Express server under the subdirecory `/blog`.

All of the routes function, the admin, the front end, everything.  I still have to work out some of the templating issues, but that's a cake walk at this point.

Getting this up and running was the best feeling, and it all works like a charm.  Hopefully this helps you if you are trying to do the same thing.  
