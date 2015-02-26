---
title: How Are Your Docs?
comments: true
---

There will always be a time when you start a project and you have to begin understanding the platform you are working with. It's that critical moment when you start to decide which tools you need, if you haven't already.

Typically, some initial research is done to uncover some general ideas about what you need, and looking at various websites or repo's, you quickly start eliminating libraries.  The decision could be based on community support, functionality, adoption, etc.  But I find myself eliminating tools by how well it's documented.

Documentation can make the time difference of hours, simply by causing more problems getting going than it's worth. Other tools are just so well done, and so critical, that poor documentation is just dealt with, but I typically gripe and moan the _entire_ time I'm using it.

As a developer, I want to know how your library, tool, or product works, and I want to know in the quickest way possible.  If your documentation sucks, I'm going to move on and find something similar (even less functional) that is documented in such a way I can use it.

Too often, documentation is a just check box. "We built everything we needed. Did we document it? Check." But what does that mean? I find it means so many things to so many people.  It could take the form of:

+ Quick reference material covering core concepts
+ Class/Module Specs
+ System designs
+ Sample code
+ Anecdotal Guides
<br><br>

Often times, just the simple organizational aspect of where these items are can be maddening.  You end up locating better documentation on [Stack Overflow](http://www.stackoverflow.com) than you do on the libraries site itself.

If you want me to use your product, make it as easy as possible to get going, or I'm out.

###Some Suggestions

####Show me something, now.
If I click on something, it needs to show exactly what I want to see at that given time.  If I want to learn your REST API, I want to see what it has to offer and how I can use it. Take a look at the [Twitter API](https://dev.twitter.com/docs/api/1.1). I immediately get a page that shows every potential route, and how it should be used.  From there, I can click in and immediately get something to test with. It does give me some description regarding meta data and usage info, but it's related specifically to the route and how it is intended to be used.

####Make it useful.
If I am on your page, I want to immediately get something of value - in the real world. [Handlebarsjs](http://handlebarsjs.com/) frustrates me a bit in this regard.  The sample code is mostly ok, but when you start to do real templating, most of the examples don't hold up in my opinion. Once you get going, everything makes more sense, but when you first start learning it, it's an uphill battle that can easily be overcome with better samples.

####Don't just generate crap
I'm looking at you [JavaDocs](http://docs.oracle.com/javase/1.5.0/docs/api/index.html), [Rdocs](http://rdoc.sourceforge.net/), [YUIdocs](https://yuilibrary.com/yui/docs/api/classes/Anim.html), [phpDocumentor](http://phpdoc.org/) and the host of other source code based documentation generators. Just stop. If you have to learn how to write specific comments to generate documentation, you are already going down the wrong path.

####Write some guides!
Reference is great, and typically is where I spend my time once I understand your concepts. But at some point in my journey with your library, I have to understand some core concepts.  [Emberjs](http://www.emberjs.com) does an amazing job of breaking down some fairly complex concepts Barney style. Well done.

<img src="http://stream1.gifsoup.com/view3/3151954/barney-o.gif" style="margin:0 auto;display:block;">

####Go Old School
I will eventually write more about some solid tools to generate better documentation, but here is a quick preview - pen and paper.  Plan some things first - then start developing your docs.  Maybe that's a unicorn - but seriously - show you want me to use your stuff.
