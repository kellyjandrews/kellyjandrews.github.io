---
title: Data Filtering for React
comments: true
series: React Data Grid Tutorials
---

##We've Come So Far
At this point in the series, our `DataGrid` component has come so far. Starting with only a mockup and static html, we now have a UI component that displays paginated data, and updates based on user interaction. The data is flowing from the top level down, and events are bubbled up through callback functions. Our mockup, however, has addtional functionality that we haven't completed. This part of the series will walk through setting up filtering based on search critera.

##Search Set Up
The first step to get the search working, is to get the value of the search box and pass it back to the owner, since the data comes from there. This is similar to changes made to `Pagination` when we used the `onChange` event to send back information to `DataGrid`.

Keeping `TitleBar` limited in functionality - I decided to pass the `value` back to the owner and store the value in it's state. With only one source of truth - we give ourselves an easier path to success, reducing the code required to stay in sync, and ultimately simplifying debugging when problems arise. The changes to `TitleBar` then, are quite minimal.

{% highlight js %}
/* title-bar.jsx */
class TitleBar extends React.Component{
  constructor(props) {
    super(props);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }
  handleKeyPress(e) {
    this.props.onChange({searchTerm: e.target.value});
  }
  render() {
    return (
      <div>
        <div className="col-md-6">
          <h2>My Contacts</h2>
        </div>
        <div className="col-md-6 searchBox">
          <input type="text" className="form-control pull-right" placeholder="Search" onChange={this.handleKeyPress} value={this.props.searchTerm} />
        </div>
      </div>
    );
  }
};
{% endhighlight %}

Once again, our friend `onChange` makes an appearance, calling the `handleKeyPress()` method in the class instance. This method then passes back the object `{searchTerm: e.target.value}` to the callback method in the owner, `DataGrid`.  In the contructor method, we need to bind `handleKeyPress` to the current instance. In case I didn't explain exactly why we do this - it's because in ES6 classes, the `createClass()` method in React automatically bound methods to the component.  Since we are now extending a base class, that bit of functionality went away.  You can read more about the decision behind that on the [React blog](https://facebook.github.io/react/blog/2015/01/27/react-v0.13.0-beta-1.html#autobinding). I can't wait for ES7 already!

Our `input` adds not only the `onChange` attribute, but also `value`.  Now when the owner changes the `searchTerm` property, it updates the value of the search box. The eliminates the need for us to store the value in the `TitleBar` component's state - and only requires the property to be passed down from the owner.

Admittedly, my naming convention here sucks.  It's not obvious that `TitleBar` has the search box in it. Since I'm not planning on using a search box anywhere else, it's not really critical, and I'm ok with it not being 100% intuitive. If I were planning on reusing search box elsewhere, I would consider moving it and it's event handler to it's own component.

###Getting Some Static
There is one more method I want to add in this component - `filterData()`. I mentioned `static` methods in my last post, but wasn't able to use them. My thought process for adding one here, is actually less complicated than you might think. I wanted to see how it worked :)

The React object `static` is no longer required, since we can directly create static methods in ES6 - which is kind of cool. This let's me call this method with out creating an instance of the class first.

{% highlight js %}
/* title-bar.jsx */
...
static filterData(data,filter) {
  return (
    _.filter(data, function(o) {
      return (
        Object.keys(o).some(function(v, i) {
          return _.includes(o[v].toLowerCase(), filter.toLowerCase());
        })
      )
    })
  );
}
...
{% endhighlight %}

Seriously though - the search box is intended for one purpose - to filter data. Just trying it out aside, I think this makes a lot of sense by keeping functionality with the component. Now, if we did reuse this component else where, I can pass the data in and filter with out rewriting code. I did add `lodash` as an include to the file, and then using `filter` and `includes` methods, I return an array of objects where the search term appears anywhere, case insensitive.

##State Of The State
Refactoring is sometimes the best part of development - making things simple. Immediately, I started to notice how much I'm storing in state, and how some of those are just computed values.

###Count

`this.state.count` is based on the length of the filtered data. That can be done inline with `this.state.filteredData.length`, and `count` can be completely removed.

###Data
Originally I was storing paginated data as `this.state.data`. Sounded good on paper - but I'm storing the same data twice. Removing this will make things much simpler.

{% highlight js %}
<DataTable rows={this.state.filteredData.slice(this.state.itemStart - 1, this.state.itemEnd)}/>
{% endhighlight %}

We only need to get the subset of data at time of `render()`.  I can now completely remove `paginateData()` from the class, as well as any updates to `this.state.data`. For better visibility, we can make it a variable at the top of the `render()` method.


###Item Start and Item End
`this.state.itemStart` and `this.state.itemEnd` are also computed, but I'm using those in other areas. Originally, we were using one method to get both of these. I ended up splitting the functionality into two functions, `getStart()` and `getEnd()`. This allows us to use one or the other and not perform both regardless of what's needed.

{% highlight js %}
getStart() {
  return ((this.state.page - 1) * this.state.displayCount) + 1;
}

getEnd() {
  var highestItem = this.state.page * this.state.displayCount;
  return (highestItem <= this.state.filteredData.length) ? highestItem : this.state.filteredData.length;
}
{% endhighlight %}

###Page Options
With the rest of the refactoring so far, we eliminated computed properties by running the code inline, and removing unecessary `state` from the component. `Pagination` up until now has been very slim in functionality, and I've only kept track of the button states.

After further consideration, and reviewing the functionality, `Pagination` should really be tracking this. `PageOptions` are created from the `count` and the `displayCount` properties. It's not directly reliant on the data, so moving to the `Pagination` component seems reasonable.

There were two approaches I considered here:

1. Static class function







##Updating Data Grid
Our `TitleBar` component now does everything we need in order to filter data, but there are some modifications required at the owener level - `DataGrid`.

In a previous post, I referenced that the property `data` would never change and therefore did not put it in the state.  This still remains true - the data sent to `DataGrid` will never change, however we do need to keep track of the data as it's filtered.  I end up storing the data in both `props` and `state` this way, but essentially it keeps `props` immutable, so I never need to worry about having the correct set of original data.

###Timing Is Everything
In the last post, `state` was created when the `DataGrid` component was instantiated. That worked just fine when the source of the data was from `props`.  It was initially available, and the class could build out the `state` properties by referencing `props.data`.

Well, that's changing - so we need to accomodate this change. I'll be adding a new `state` named `filteredData` to hold the full data set, or the filtered sub set.

First, let's revisit our `defaultProps`.

{% highlight js %}
/* app.jsx */
DataGrid.defaultProps = {
  displayCount: 10,
  page: 1,
  displayCountOptions : [10,25],
  searchTerm: ""
}
{% endhighlight %}

Here, I've added the property `searchTerm`. This will allow the owner to create an instance of `DataGrid` with or without this property. That gives the owner a chance to store and pass a previous `searchTerm` if desired. Our `filteredData` state will need to know about `searchTerm` when create the instance, but since `TitleBar` will be passing back `searchTerm` it will also need to be tracked in the `state` object.

Let's change our constructor method a little to set our initial `state`:

{% highlight js %}
/* app.jsx */
...
this.state = {
  filteredData:(props.searchTerm != "") ? TitleBar.filterData(props.data, props.searchTerm) : props.data,
  page: this.props.page,
  displayCount: this.props.displayCount,
  searchTerm: props.searchTerm
};
...
{% endhighlight %}

I'm initally creating the core `state` in the constructor. In other words, these are not computed values, but basic values that the rest of the `state` object needs. Previusly, we just used the `props` object, and `props.data` was available to use.

Pay attention to one thing here

{% highlight js %}
filteredData:(props.searchTerm != "") ? TitleBar.filterData(props.data, props.searchTerm) : props.data
{% endhighlight %}

See how we are calling `filterData()` from the `TitleBar` component?  That's the `static` method in action. Very simple function to return a filtered data set. Your component can all kinds of methods in this way to create an API of sorts - allowing owners to use functionality required by that specific component.

If we didn't offer the option of filtering data on initialization, we could have continued to use `props.data` for everything and not have the inline conditional.  However, that seemed limiting to the functionality, to me. Plus, it gives us a chance to use another  [React lifecycle method](https://facebook.github.io/react/docs/component-specs.html).

{% highlight js %}
/* app.jsx */
...
componentWillMount() {

  var startEnd = this.getStartEnd(this.state);

  this.setState({
    itemStart: startEnd.itemStart,
    itemEnd: startEnd.itemEnd,
    pageOptions: this.getPageOptions(this.state.filteredData.length, this.state.displayCount)
  });

}
...
{% endhighlight %}

React's `componentWillMount()` method let's us perform some tasks prior to the component rendering. Here we are using `setState()` to complete the initial data required by the component, and `render()` is only called once (`setState()` typically fires `render()`).

At this point in the lifecycle, we have everything we need in our `state` object, both basic and computed values. A minor detour to get things set up - but overall, not adding any complexity.


Now that we have `this.state.filteredData`, we need to locate all of the places where `this.props.data` was being used, and determine if they need to use the filtered set of data.


{% highlight js %}
{% endhighlight %}

##Wrap Up


I've updated my [GitHub repo](https://github.com/kellyjandrews/react-tutorial/tree/pagination) with the source code from this tutorial.
