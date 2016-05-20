---
title: Read-Component = Lifesaver
comments: true
---
I recently wrote a [post](http://kellyjandrews.com/using-bower/) about utilizing [Bower](http://bower.io/) in your projects.  It has seriously saved me from copy/pasting files numerous times, and I hope you are starting to use it in your projects as well. If not - start - like now.

Like all technologies, there is eventually a wall you hit, and your once glorious library is a source of frustration. I am building a project that utilizes [Highcharts](http://www.highcharts.com/), and I have also been using [Brunch](http://brunch.io/) as a front-end automation tool (more on that when I have time).

Brunch, and it's reloader plugin, save me serious cycles - I simply save a page, it recompiles and refreshes my browser page. It's truly the little things that make me happy.  I'm know that [GruntJS](http://gruntjs.com) does the same thing, Brunch is just easier to get into, and is blazingly fast.

####The Brick Wall
Brunch works great with Bower, in that it will automatically read all `bower.json` files in the `bower_components` folder, and append them into your `app.js` file. You can specify order etc, but it's fairly simple. Here is where I got stuck:

```js
{
  "name": "highcharts",
  "version": "3.0.7",
  "main": "./highcharts.js",
  "dependencies": {
  }
}
```

The `main` file listed here is simply `highcharts.js`.  I wanted to use the `gauge` chart. Ugh - it's in a different file. This just wouldn't do. So I modified the `.bower.json` file and the `bower.json` file (I'm not positive which one brunch reads from, so I just did both) to use `./highcharts-all.js`. I recompiled, and voila - my chart worked.

####That sinking feeling
I knew it was a hack. In fact, I felt incredibly dirty, and almost stopped coding completely just to figure it out. Ok seriously, that's exactly what I did - I couldn't get past the awful thing I just did. I couldn't shae the code with anyone because it wouldn't work without my hack in place. So, I called on my trusty friend Google.

####Knight in White Armor
Thank goodness [Paul Miller](https://github.com/paulmillr) and some other folks realized this was a problem about 7 months ago.  I introduce to you [read-components](https://github.com/paulmillr/read-components). Brunch will run into incomplete `bower.json` files and fail, hardcore failures.  Brunch also determines the best order to drop in dependencies - if the Bower component isn't complete - failure.

So I installed it as an `npm` module, ran the install, and then removed my hack.  As expected, my chart failed.  I then added the following to my project's `bower.json` file:

```js
"overrides": {
  "highcharts": {
    "main": "highcharts-all.js"
  }
}
```

I restarted Brunch, and like magic - it all returned.

#### Moral of the story
Don't give up - there is always something out there addressing your issue.  Just have to find it.
