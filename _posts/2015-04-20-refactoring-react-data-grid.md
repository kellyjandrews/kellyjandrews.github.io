---
title: Refactoring React Data Grid
comments: true
series: React Data Grid Tutorials
---

## Self Correction
I spent the last few days really thinking about the `DataGrid` and how to utilize [React](https://facebook.github.io/react/) in the best way possible. `DataGrid` currently works, but if we evaluate individual components, I haven't adhered to keeping these modular and reusable.

Every project, at some point, has to be evaluated and adjusted - so I took the time now to walk through my thought process.

### Why Now?
As I started to implement the search functionality, a few items are glaring issues that needed to be addressed:

1. `DataGrid` state object is simply doing too much. Storing data that will change is proper, however it is also storing computed values - which is completely uneccessary - as well as I started to duplicate some `state` to make things work.
2. `TitleBar` just doesn't make sense. The real component here is `SearchBox`, and the markup in `TitleBar` can be move up to `DataGrid`.  This also allows us to use `SearchBox` elsewhere.
3. Components are currently unusable outside of `DataGrid`. If I want to reuse the `SearchBox` or `Pagination` for any other components, I would have to recode several lines, which is unproductive and prone to error. I have to move functionality to the right component, without breaking the top-down data flow.
4. `Pagination` requires too many properties, and can be greatly simplified.
5. I'm not taking full advantage of vanilla JavaScript here, and can reduce extra code in several spots to simplify debugging.
6. Not refactoring would cause additional work later, so better to do this now than continue adding complexity.

Maybe you have already spotted some of these issues?  If so, good for you! During the coding process it's easy to miss optimization opportunities or learn new ways to do things that change the way you think about your project.

In this case, I initially wanted the lower level component to do very little functionality. IF I were simply distributing the data grid as a pre built component, it works. However, after the refactor, I am able to reuse components with less duplicate code.

## State Of The State
Currently the `state` for the `DataGrid` component looks like this:

{% highlight js %}
/* app.jsx */

this.state = {
  count: props.data.length,
  data: this.paginateData(startEnd.itemStart, startEnd.itemEnd),
  displayCount: props.displayCount,
  itemStart: startEnd.itemStart,
  itemEnd: startEnd.itemEnd,
  page: props.page,
  pageOptions: this.getPageOptions(props.data.length, props.displayCount)
};
{% endhighlight %}

After giving these a hard look, several of these are just computed values - `count`, `pageOptions`, `itemStart` and `itemEnd` really should all be controlled at the time of render, and not stored in `state`. Each of these are based on `data`, `page`, and `displayCount`.

If we dig a bit deeper, though, even `data` is computed. The `prop` data is immutable - so it never changes. The `state` data is our paginated data set. It's just a sliced array. If we remove the computed items, our state now looks like this:

{% highlight js %}
/* app.jsx */

this.state = {
  page: props.page,
  displayCount: props.displayCount,
  searchTerm: props.searchTerm
};
{% endhighlight %}

This feels so much cleaner. `searchTerm` will come into play later when we get to the search component.

`DataGrid` also has several class methods doing many different calculations for the `Pagination` component. `getStartEnd()`, `getPageOptions()`, and `paginateData()` methods all update the older state version. They also feel like they go together - sort of as a class.

### Replacing The Old Guard
Since we basically killed our entire `state`, we need a place to get it.  Remember how I mentioned at time of `render()`?  Initially, I wanted a function to just build out everything. I ran into some difficulties trying to figure out how, though. `Static` methods are not aware of `state` or `props`, `Prototype` methods in the component aren't aware of `static` functions.

Enter `class PagedData`. A static class in the `pagination.jsx` file that performs all of the computations needed (save a couple) to populate the `Pagination` component, and we expose it in a  `static` method. We can then pass in our data set, page and displayCount `state` and let the `Pagination` component take care of itself a bit more. It will also make the component reusable, without rewriting all of the functions somewhere else.

{% highlight js %}
/* pagination.jsx */
class PagedData {
  constructor(d, o) {
    var r = {paginatedProps:{}, paginatedData:[]};

    r.paginatedProps.total = d.length;
    r.paginatedProps.itemStart = PagedData.getStart(r.paginatedProps.total, o.page, o.displayCount);
    r.paginatedProps.itemEnd = PagedData.getEnd(r.paginatedProps.total, o.page, o.displayCount);
    r.paginatedProps.pageOptions = PagedData.getPageOptions(r.paginatedProps.total, o.displayCount);
    r.paginatedProps.page = o.page;
    r.paginatedProps.displayCount = o.displayCount;
    r.paginatedData = PagedData.splitData(d, r.paginatedProps.itemStart, r.paginatedProps.itemEnd);

    return Object.freeze(r);
  }
  static splitData(d, s, e) {
    return d.slice(s - 1, e);
  }
  static getStart(t, p, d) {
    return (t > 0) ? ((p - 1) * d) + 1 : 0;
  }
  static getEnd(c, p, d) {
    var h = p * d;
    return (h <= c) ? h : c;
  }
  static getPageOptions(t, d) {
    var o = new Array(Math.ceil(t / d));
    var i = 0;
    var a = o.length;
    while(i < a){
      o[i] = i+1;
      i++;
    }
    return o;
  }
}
{% endhighlight %}

I split up the result to help the owner do it's job, allowing it to pass `paginatedProps` and `paginatedData` to the proper place. Our new class gets created by calling the following method with `Pagination.pageData()` and pass in the `data` array and our `state` object.

{% highlight js %}
/* app.jsx */
render() {
  var paginated = Pagination.pageData(this.props.data, this.state);
...

/* pagination.jsx */

static pageData(d, o) {

  return new PagedData(d,o);

}
{% endhighlight %}

I had to do some clean up for the values in `Pagination`, but that was fairly simple, and is in the new code set. One other item that needed cleaning up, is correcting the current page when the `displayCountOptions` change.  That gets moved to a component lifecycle method.

{% highlight js %}
componentWillUpdate(nextProps) {
  if (this.props.paginatedProps.total !== nextProps.paginatedProps.total) {
    this.props.onChange({'page' : 1});
  }

  if (nextProps.paginatedProps.displayCount !== this.props.paginatedProps.displayCount) {
    var i = 1;
    while(this.props.paginatedProps.itemStart > i * nextProps.paginatedProps.displayCount) { i++; };
    this.props.onChange({'page' : i});
  }
}
{% endhighlight %}

`componentWillUpdate` and `componentDidUpdate` are pretty powerful when used correctly. I dare you to `this.setState()` from one of these... ok I don't mean that. Loops are never fun - so avoid this.

Now to call our component, we simply need this -

{% highlight html %}
<Pagination
  paginatedProps={paginated.paginatedProps}
  onChange={this.handleData}
/>
{% endhighlight %}

###Handling the Change Events
In preparing for search, I originally modified the "handlePagination()" method, to simplify the interaction. Then I realized, the method wasn't even required, and could be bypassed altogether.

{% highlight js %}
/* app.jsx */
//before
handlePagination(setting) {
  var nextState = _.assign({}, this.state, setting);

  if (nextState.displayCount != this.state.displayCount) {
    nextState.pageOptions = this.getPageOptions(this.props.data.length, nextState.displayCount);

    var that = this;
    nextState.pageOptions.every(function(option){
      if (that.state.itemStart < option * nextState.displayCount) {
        nextState.page = option;
        return false;
      } else {
        return true;
      }
    });
  }

  nextState = _.assign(nextState, this.getStartEnd(nextState));
  nextState.data = this.paginateData(nextState.itemStart, nextState.itemEnd);

  this.setState(nextState);
}

//after
...
<Pagination
  paginatedProps={paginated.paginatedProps}
  onChange={this.setState.bind(this)}
/>

{% endhighlight %}

Now any thing from an `onChange` event can be handled the same way - by performing `setState` which forces a refresh, calling the `PageData` method, and everything is up-to-date. Since my low level components and `DataGrid` all play well together - I don't even need the function I originally created. Refactor #FTW!

### Default Props
One last item to cover, then we can move on. When you are looking for properties in a component, you need to make sure those are set in it's owner so those are available. However, if those aren't included you get errors and such - and sometimes that's actually avoidable because the property could have a default value.  React allows for `defaultProps` to be set up. I created those like this:


{% highlight js %}
DataGrid.defaultProps = {
  data: [],
  displayCount: 10,
  page: 1,
  searchTerm: ""
}
{% endhighlight %}

Now when I want to use this component, I can pass in `<DataGrid />` and not blow it up. With this method, I could render the `DataGrid` without any data, and pass it in later. I can also pass in a page, or search term if I have one stored.  This makes our components more flexible to the end user.

## Wrap Up
I had to. I tried to leave it - but as I got deeper into the search component, I couldn't leave it alone. Some of this comes from a deeper understanding of functional programming, and really separating out functionality into its’ simplest forms. To be perfectly honest, I still feel like I could slim this down even more. I have drastically reduced what's in state, and I've built a more modular set of components. I've also adhered to the top down data flow, by exposing functions in each component for it's owner to call and pass back

The repo that's been refactored also includes the search functionality, which will be in another post very soon.

I've updated my [GitHub repo](https://github.com/kellyjandrews/react-tutorial/tree/searchbar) with the source code from this tutorial.
