---
title: React Component Communication
comments: true
series: React Data Grid Tutorials
---

##Pagination
Now that our `DataTable` component is rendering dynamic data, our `Pagination` component is off. The `DataTable` is also rendering everything at once, and not observing the `Pagination` settings like page and number of items to display. Let's change that.

##New Components

##Wrap Up
This is my workflow - it's what I know works, and works for me.  There are tons of additional ways to go about the same tasks, and you can modify these for additional support like less preprocessing, minification, sourcemaps, and others.  This will hopefully be a good starting point to explore more, without making it so complicated that understanding the pieces takes additional work.

I've update my [GitHub repo](https://github.com/kellyjandrews/react-tutorial/tree/modular-build) with the source code from this tutorial.  Next steps will be to start building out the components using actual data and not static `render` methods.
