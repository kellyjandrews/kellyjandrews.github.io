---
title: Data Filtering for React
comments: true
series: React Data Grid Tutorials
---

## We've Come So Far
At this point in the series, our `DataGrid` component has come so far. Starting with only a mockup and static html, we now have a UI component that displays paginated data, and updates based on user interaction. Data is flowing top down, and with a recently refactored code base, we have arranged the workload to the component level allow for greater modularity.

Now, let's implement the search feature - which is actually quite easier than you'd think.

## Search Set Up
The first step to get the search working, is to get the value of the search box and pass it back to the owner, since our data lives there. This is similar to the way `Pagination` uses `onChange` events to send back information to `DataGrid`.

`TitleBar` doesn't make any sense, and the component is actually the `SearchBox`. I've made that change, and our search box component looks like this:

```js
/* searchbox.jsx */
class SearchBox extends React.Component{
  constructor(props) {
    super(props);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  handleKeyPress(e) {
    this.props.onChange({searchTerm: e.target.value});
  }

  static filterData(data,filter) {
    if (filter === "" || !filter) {return data};
    return (
      data.filter(function(o) {
        return (
          Object.keys(o).some(function(v, i) {
            return o[v].includes(filter.toLowerCase());
          })
        )
      })
    );
  }

  render() {
    return (
      <span>
        <input type="text" className="form-control pull-right" placeholder="Search" onChange={this.handleKeyPress} value={this.props.searchTerm} />
      </span>
    );
  }

};

export default SearchBox;
```

Once again, our friend `onChange` makes an appearance, calling the `handleKeyPress()` method in the class instance. This method then passes back the object `{searchTerm: e.target.value}` to the callback method in the owner, `DataGrid`.  We bind `handleKeyPress` to the current instance in the contructor method. The non ES6 method uses `createClass()` to automatically bind methods to the component.  Since we are now extending a base class, that bit of functionality went away.  You can read more about the decision behind that on the [React blog](https://facebook.github.io/react/blog/2015/01/27/react-v0.13.0-beta-1.html#autobinding). I can't wait for ES7 already!

The real work with this component is the static `filterData()` method, which takes an array of objects and a filter, and returns the filtered array when the object matches anywhere. This method can now be called from any other owner that utilizes `SearchBox` with consistent results.

## Wrap Up
This was a short one - but as I implement new functionality - especially after the refactor - the code just gets easier. The filter is fairly simple, and expects a one level deep object - we could easily modify that for additional cases.  Since it's in this component - any other consumers now have access to the updates as well.

I've updated my [GitHub repo](https://github.com/kellyjandrews/react-tutorial/tree/pagination) with the source code from this tutorial.
