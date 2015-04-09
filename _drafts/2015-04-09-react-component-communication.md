---
title: React Component Communication
comments: true
---

##Pagination
Now that our `DataTable` component is rendering dynamic data, our `Pagination` component is off. The `DataTable` is also rendering everything at once, and not observing the `Pagination` settings. Let's change that.



##Wrap Up
This is my workflow - it's what I know works, and works for me.  There are tons of additional ways to go about the same tasks, and you can modify these for additional support like less preprocessing, minification, sourcemaps, and others.  This will hopefully be a good starting point to explore more, without making it so complicated that understanding the pieces takes additional work.

I've update my [GitHub repo](https://github.com/kellyjandrews/react-tutorial/tree/modular-build) with the source code from this tutorial.  Next steps will be to start building out the components using actual data and not static `render` methods.

####Data Grid Tutorials
1. [React - Up and Running]({{site.baseurl}}/2015/03/30/react-up-and-running.html)
2. [Modular React Components With Browserify]({{site.baseurl}}/2015/04/01/modular-react-components-with-browserify.html)
3. [Data Driven React Components]({{site.baseurl}}/2015/04/08/data-driven-react-components.html)
4. [React Component Communication]({{site.baseurl}}/2015/04/09/react-component-communication.html)
