---
title: Lightning Components and Browserify
comments: true
---

###Lightning Components
Over the last week, I've been working with the Salesforce Lightning Component Framework. It's a simple way to build single page apps using client side JS and server side Apex. I am in no way a true Salesforce developer - I'm really just a noob - but it's super fun to learn and for any one with a MVC background, you can pick it up quickly.

This is not, however, an overview of how to get started on Lightning - there are other, more qualified tutorials out there like [Reid Carlberg's Newbie Notes](http://reidcarlberg.github.io/lightning-newbie/) or [Christoph Coenraets Lightning Components Tutorial](http://ccoenraets.github.io/salesforce-lightning-tutorial/). If you are looking for a solid front-to-back overview - start with one of these.

###Challenge Accepted
One of the difficulties I have run into during my learning process, is that including a library like [jQuery](http://jquery.com/), isn't as simple as adding a file and calling it in the application. Salesforce uses "static resources" for things like css files, and javascript files.

When you want to use those in a Lightning component, you simply call it like so:

{% highlight xml %}
<aura:application >
    <link href='/resource/bootstrap/' rel="stylesheet"/>
</aura:application>
{% endhighlight %}

This calls the static resource that is the css file for [Bootstrap SF1 theme](http://developer.salesforcefoundation.org/bootstrap-sf1/).

Based on this, simply adding a jQuery static resource should be a piece of cake.

{% highlight xml %}
<aura:application >
    <script src="/resource/jQuery/"></script>
    <link href='/resource/bootstrap/' rel="stylesheet"/>
</aura:application>
{% endhighlight %}

One would expect this to load jQuery, which, essentially it does, however it's a bit of a race case.  The script loads a few milliseconds after the application, and you can't actually use it. There is a [great thread](https://developer.salesforce.com/forums/ForumsMain?id=906F0000000AmazIAC) covering this behavior, and I won't go into much detail here, but the solution is to use [RequireJS](http://requirejs.org/) in a component, and an event to listen for everything to be loaded, and then load the RequireJS config and all of the static resources.

This, to me, was a challenge.

###The Dark Magic of Browserify
I have been toying with [Browserify](http://browserify.org/) for a bit now, and ditched RequireJS some time ago. I was never a fan of the AMD syntax, and I love being able to pull all of my JS together into one file with one command. So I was curious, if it would be at all possible to pull off some magic and load everything with one file.

In my developer console, I created a New->Static Resource, and named it `AppScripts`. It creates a new js file with a sample function in it. I'll use this again in a bit, but went ahead and set it up in the application.

{% highlight xml %}
<aura:application >
    <script src="/resource/AppScripts/"></script>
    <link href='/resource/bootstrap/' rel="stylesheet"/>
</aura:application>
{% endhighlight %}

Now I turned my attention to my local machine. I'm not going to go over all the ins and outs of Browserify, but I will walk you through what I did to set it up.

First, you have to get set up a bit, and install a couple things. You will be using [NPM](https://www.npmjs.com) to manage your packages, so go through a quick `npm init` process first. Once that's complete, open up your `package.json` and update your `scripts` section.

{% highlight json %}
"scripts": {
  "bundle": "browserify main.js -o scripts.js"
}
{% endhighlight %}

This will allow you to use `npm run bundle` from the command line, and will output a `scripts.js` file.

First, however, you have to install the required modules -

{% highlight bash %}
npm i --save-dev browserify jQuery
{% endhighlight %}

This will install the requirements for this simple test. After that completes, I created a `main.js` file. Remember the script in npm? It's looking for main.js - you can change the script to be any name - just make sure they match.

In my main.js file - I did just a quick script to see if it was working -

{% highlight js %}
var $ = jQuery = require('jquery');

$(function(){
  console.log('This is working.');
});
{% endhighlight %}

When `npm run bundle` gets called on the command line - it will take this file, and it's recursive dependencies, and output them to `scripts.js`.  You can then minify this file to save space, but for now I'm skipping that.  At this point, I opened my `scripts.js` file, copied the entire file, and pasted into my static resource `AppScripts`, and saved it.  

I previewed the application in the browser, and my console log showed the text appropriately. I have tried a few other simple tests, and so far, everything appears to load properly and execute.

###So What's Next
Now I'm going to go nuts. So many things I want to try out and see if they will work.  It's not that the current framework is limiting, but it's a restriction not having some go-to libraries. I don't want to reinvent modules that exist, so any way I can get this to work, I'm going to make it happen.

Some ideas to try - bootstrap js components, data grids, knockout, handlebars, and so on. What I have yet to determine is what is available to me at run time.  Some of the controller js will need to be tested - can I use my Browserify bundle to run controller code? No clue - this may not even work at all - I was just excited to get this to work - I had to share.
