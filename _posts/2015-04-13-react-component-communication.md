---
title: React Component Communication
comments: true
series: React Data Grid Tutorials
---

##The Real Work Starts
So far in the series, we have mocked up the `DataGrid` component, set up our application workflow with [Gulp](http://gulpjs.com/) and [Babel](https://babeljs.io/), and updated our `DataTable` component to use some example data. At this point, `DataGrid` is still a fairly static component.  So let's look at how to make the `Pagination` and `DataTable` work together and communicate through the `DataGrid`.

##Caution
This tutorial is not for the faint hearted.  I will do my best to explain everything that is going on and break it down into simple chunks. It's also using pure React and JavaScript when possible. There are libraries that can help with some of the data flow challenges that are faced doing this kind of component, however, with any framework, understanding how it works at it's lowest level is highly beneficial when you begin abstracting layers with additional libraries.

##Owner/Ownee and Data
React specifically makes the distinction between owner/ownee and parent/child relationships. A component is an owner, and any sub components are ownees. This is differs from parent/child, where a tag wraps inner tags. I will use this as the terminology henceforth.  Forgive me if I used these interchangeably in the past.

With this in mind, we then can make decisions about which component owns what data. Looking at the `DataGrid` component, there are a few data points to keep track of:

1. **Item Counts:** Based on our mockup, we want to track the starting and ending item number, and the total count
2. **Display Count Setting:** The UI allows for a user to set the maximum number of items displayed at one time.  
3. **Current Page:** The user will be paging through results, and we want to track what page the user is currently on.
4. **Data Set:** We will need to manage somehow what data gets rendered in the `DataTable`.

The goal is to manage these data points in the top-level, and then pass them down through the components.  Let's start with an initial change, that will get the data flow moving first.

##Initial Changes
The first step is to get the data to the top level from the two dropdowns for display count and current page. Since we are building components, it made sense to add a new component named `DropDownMenu` and render it in the `Pagination` component.

{% highlight js %}
/* pagination.jsx */
class DropDownMenu extends React.Component {
  render() {
    var optionList = this.props.options.map( function (option, key) {
      return (
        <li key={key}><a>{option}</a></li>
      )
    }, this)
    return(
      <div className="btn-group">
        <button type="button" className="btn btn-xs btn-default dropdown-toggle" data-toggle="dropdown">
          {this.props.value} <span className="caret"></span>
        </button>
        <ul className="dropdown-menu" role="menu">
          {optionList}
        </ul>
      </div>
    );
  }
};
{% endhighlight %}

If you read the previous post in the series, this should look somewhat familiar. The `DropDownMenu` controller will need some options passed to it as an array, and then we map the array to out put our `<li>`s to be rendered to the UI, and the current value that is set.

{% highlight html %}
<DropDownMenu value="Current Value" options=["Current Value", "Another Value"] />
{% endhighlight %}

So far, we are only using the `render()` method. We need to add some handler to the `<a>` tag to pass back what has been selected.

{% highlight js %}
/* pagination.jsx */
class DropDownMenu extends React.Component {
  handleClick(key) {
    this.props.onChange(this.props.options[key]);
  }
  render() {
    var optionList = this.props.options.map( function (option, key) {
      return (
        <li key={key}><a onClick={this.handleClick.bind(this, key)} >{option}</a></li>
      )
    }, this)
    return(...
{% endhighlight %}

Adding a `handleClick()` method to the class, we now have the ability to capture which option was selected, and then do something with that information. We grab where the click took place by adding `onClick={this.handleClick.bind(this, key)` to each anchor tag.  `This` for each option in the drop down represents the current `DropDownMenu` component, and finds the option by it's `key` and logs the option to the console. The final `}, this)` binds the class to the map function to make it aware of the current class methods.

Notice we are now using an `onChange` function from `props`. This is a simple way to pass information back to `Pagination`, so it is also aware of the change. I'll get to that in detail in just a bit.

For now, modify how these are called in `Pagination`:

{% highlight html %}
...
<DropDownMenu value={1} options={[1,2,3,4,5,6,7,8,9,10]} />
...
<DropDownMenu value={10} options={[10,25]} />
...
{% endhighlight %}

I'm actually going to pass `props` later for the value and options, but for now this can be static. If you run the app now, you will get an error since we haven't passed in `onChange()` from the owner component. Let's do that now.

##Pagination
Remember how I said that our goal is to manage data at the top level? `DropDownMenu` currently provides a path for `Pagination` to learn of the changes, but if we stick to the goal of top down data flow, `Pagination` also needs a way to communicate with it's owner, `DataGrid`.

Much like `DropDownMenu`, `Pagination` doesn't need to do much more than report changes to `DataGrid`. Data will flow from the top down, and `Pagination` will update based on new data.

First, let's take a look at the way we handle the selections bubbled up from the `DropDownMenu`.

{% highlight js %}
/* pagination.jsx */
...
updateSettings(type, value) {
  var setting = {};
  setting[type] = value
  this.props.onChange(setting);
}

...

render() {
  return (
    <div className="well">
        <div className="row">
        <div className="col-md-6">
          <strong>{this.props.itemStart}</strong> - <strong>{this.props.itemEnd}</strong> items out of <strong>{this.props.count}</strong>
        </div>
        <div className="col-md-6">
          <div className="pageControls pull-right">
            <button className="btn btn-xs btn-default glyphicon glyphicon-triangle-left" onClick={this.updateSettings.bind(this,"page",this.props.page - 1)} disabled={!this.state.prev} />
            <DropDownMenu value={this.props.page} options={this.props.pageOptions} ref="page" onChange={this.updateSettings.bind(this, "page")} />
            <button className="btn btn-xs btn-default glyphicon glyphicon-triangle-right" onClick={this.updateSettings.bind(this,"page", this.props.page + 1)} disabled={!this.state.next} />
          </div>
          <div className="itemOption pull-right">
            <DropDownMenu value={this.props.displayCount} options={this.props.displayCountOptions} ref="displayCount" onChange={this.updateSettings.bind(this, "displayCount")} />
          </div>
        </div>
        <div className="clearfix"></div>
        </div>
    </div>
  );
}
};

{% endhighlight %}

This looks like a lot, but there actually isn't too much happening here. `DataGrid` will be sending down the `page` and `displayCount` as props. While using the `state` could also make sense, there are some considerations when these change that I want to handle at the top level and pass to multiple components. If I maintain state in `Pagination`, I end up breaking the top down approach and introduce code in places that doesn't make sense.

I've added the `updateSetting()` method to the class to pass to the `onChange` property of `DropDownMenu`. When `DropDownMenu` fires the `handleClick()` method, `updateSettings()` calls a similar `onChange()` method passed in from `DataGrid` as a property.

`updateSettings()` takes two parameters, `type` and `value`.  Using `bind()`, I add `this` for proper context, and send additional arguments to the method - which is just vanilla JS. On the two buttons, I manually send the `value` param, however, with the `DropDownMenu`, `value` comes from the `handleClick()` method in `DropDownMenu`.

There are two types that are being passed back to `DataGrid` - "page" and "displayCount".  Remember how I mentioned that is all the pagination does?  It's simply reporting back to it's owner what options have been selected.

There are, however, two items we want to track in `state` - the next/previous button states.

{% highlight js %}
/* pagination.jsx */
class Pagination extends React.Component{
  constructor(props) {
    super(props);
    this.state = this.buttonStates(props);
  }

  componentWillReceiveProps(nextProps) {
    this.setState(this.buttonStates(nextProps));
  }

  buttonStates(props) {
    var buttonStates = {prev: true, next: true};
    if (props.page === props.pageOptions[0]) {
      buttonStates.prev = false;
    }

    if (props.page === props.pageOptions[props.pageOptions.length - 1]) {
      buttonStates.next = false;
    }

    return buttonStates;
  }
...
{% endhighlight %}

I created a function `buttonStates()` to manage the next/previous buttons.  This just checks the current page, and determines if it's first or last in the array of `pageOptions`. The buttons then have `disabled={!this.state.next}` and `disabled={!this.state.prev}` to turn them on and off accordingly.

ES6 slightly changes the way `state` is created - directly in the `constructor()` method, as opposed to `getInitialState()`. From here, I call the `buttonStates()` method and return the initial object. When the `DataGrid` sends new `props` down, we then use the [React lifecycle method](https://facebook.github.io/react/docs/component-specs.html) `componentWillReceiveProps()` to update our `state`.

That's it - this is all we need the `Pagination` component to do. What we have so far, is a component that passes data back to it's owner when it's changed (twice actually), and it maintains it's own state for buttons.

##Driving With The Top Down
Since we created `Pagination` to operate with very little functionality - `DataGrid` needs to pass down the right `props` to keep things accurate. `Pagination` needs several data points from `DataGrid`:
{% highlight html %}
<Pagination
  count={this.state.count}
  page={this.state.page}
  displayCount={this.state.displayCount}
  itemStart = {this.state.itemStart}
  itemEnd = {this.state.itemEnd}
  pageOptions = {this.state.pageOptions}
  displayCountOptions = {this.props.displayCountOptions}
  onChange={this.handlePagination}
/>
{% endhighlight %}

Let's walk through this before moving on. The `Pagination` render method is looking for several items, and those all are passed as props.  `DataGrid` will manage everything in `state` that is allowed to change. Notice two items are not `state` properties?  `displayCountOptions` in reality should never change - I've set mine to 10 and 25. I can't think of a good reason for the UI to change those options in the drop down, so I just left them as `props`. Also, I introduce the `onChange()` property that takes a function, and eventually is called by `updateSettings()` in the `Pagination` component. Now it all starts to come together.

###Constructing DataGrid
When I build the initial `DataGrid` there are a few steps I want to perform right away.

{% highlight js %}
/* app.jsx */

class DataGrid extends React.Component{
  constructor(props) {
    super(props);

    this.handlePagination = this.handlePagination.bind(this);
    this.paginateData = this.paginateData.bind(this);
    this.getStartEnd = this.getStartEnd.bind(this);

    var startEnd = this.getStartEnd(props);

    this.state = {
      count: props.data.length,
      data: this.paginateData(startEnd.itemStart, startEnd.itemEnd),
      displayCount: props.displayCount,
      itemStart: startEnd.itemStart,
      itemEnd: startEnd.itemEnd,
      page: props.page,
      pageOptions: this.getPageOptions(props.data.length, props.displayCount)
    };
  }

  handlePagination(setting) {...}
  getStartEnd(state) {...}
  getPageOptions(count, displayCount) {...}
  paginateData(start, end) {...}

  render() {...}
};

{% endhighlight %}

In ES6, we need to bind all class functions to `this` - `this.handlePagination = this.handlePagination.bind(this);`, etc. Doing this allows each method access to the current instance of `DataGrid`.

You might be wondering why I have `this.props.data` and `this.state.data`. The reason for this is I want `this.props.data` to be immutable. When we page the data, we aren't actually changing the data, just returning a subset of data to the `DataTable` component - in my case either 10 or 25 rows at a time.

##Static Functions
There are three functions in our `DataGrid` component that simply return some result:

{% highlight js %}
/* app.jsx */
...
getStartEnd(state) {
  var highestItem = state.page * state.displayCount;
  var result = {};
  result.itemStart = ((state.page - 1) * state.displayCount) + 1;
  result.itemEnd = (highestItem <= this.props.data.length) ? highestItem : this.props.data.length;
  return result;
}

getPageOptions(count, displayCount) {
  var options = new Array(Math.ceil(count / displayCount));
  var i = 0;
  var a = options.length;
  while(i < a){
    options[i] = i+1;
    i++;
  }
  return options;
}

paginateData(start, end) {
  return this.props.data.slice(start - 1, end);
}
...
{% endhighlight %}

These three functions are just static - they run when called, do not set state, and return a result. Basically, helper functions to reduce redundancy. React component does have the `static` object, which allows your component to have callable methods, allowing them to be ran prior to creating a component instance, but they don't have access to `state` or `props`.  This isn't exactly what I was after, so they remain instance methods, and left it at that. If I needed them to be accessible outside this specific instance, then that change could be made.

These methods are really simple in function.  
+ `getStartEnd()` provides a way to ensure the start and end item number match up the current data set displayed.
+ `getPageOptions()` creates the array for the `DropDownMenu` component, since the number of pages changes when you change the display count.
+ `paginateData()` returns my data set sliced by the page.

###Handling The Pagination Changes
All that's left to do it handle the pagination. `handlePagination()` runs when the `Pagination` component fires `this.props.onChange`.

{% highlight js %}
/* app.jsx */
...
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
...
{% endhighlight %}

`Pagination` sends an object back, `{type:value}` based on what is changed, either `displayCount` or `page`. At this point, I felt it necessary to include [`lodash`](https://lodash.com/) for the `assign()` method.

`handlePagination()` does just a few simple steps.  I use `nextState` here to manually build out the changes and pass to the other helper functions.  The most important part here is checking for `displayCount` changes.  Since changing how many items display will change the current `page`, I want to be sure to handle that properly. I took the approach of keeping the user as close to the original data set they were previously viewing, so I'm changing the page they are on based on the `itemStart` property. Not sure if I like it, but it works for now.

Finally, I update the final items in `state` and then using `setState()` method update the component. All of the `DataGrid` ownees then get updated with the new data automatically.

##Defaults
When you initialize the `DataGrid`, you can actually pass in additional `props`. `DataGrid` relies on `displayCount`, `displayCountOptions` array, `page`, and `data`. This will allow the owner of `DataGrid` to pass in specific details to render, say the user leaves the containing page and comes back - you might store where they left off and return them to the exact spot.

However, these aren't required, and I handle that using `defaultProps` on the component class.
{% highlight js %}
DataGrid.defaultProps = {
  displayCount: 10,
  page: 1,
  displayCountOptions : [10,25],
}
{% endhighlight %}

Now, our `DataGrid` only requires `data` to be passed in, and everything else has a default.

##Wrap Up
Phew! This took me a bit to get here. To be honest, I started with a much larger code set and did some rework, and I'm happy with where it's ended up. The process helped me really digest how top down data should be approached, and separating concerns as much as possible. There were a lot of change to get here, but in reality - it's very simple.  When the `DropDownMenu` changes, the `DataGrid` is alerted and send the data back through. It updates the UI super quick, and feels very natural.

There is still some additional functionality I'd like to introduce, but so far this is very operational. Next steps are adding the search function to reduce the number of total results.

I've updated my [GitHub repo](https://github.com/kellyjandrews/react-tutorial/tree/pagination) with the source code from this tutorial.
