---
title: Data Driven React Components
comments: true
series: React Data Grid Tutorials
---

##Making This Thing Useful
If you have been following along with my data grid tutorial - we don't really have much going on yet. So far I've only mocked up a representation of what the final data grid will look like. This is not entirely useful. The next step is to use real data.

##React Data Flow
In order to think about how this works together, we need to approach this in the React way of doing things. In the `app.jsx` file, this is where our main data grid component lives - and it's a composite component made up of other, smaller components.

It's important to understand how React uses it's data - from the owner to the ownee. It seperates concerns into the individual components, and makes your applications easier to understand what's going on. If none of this makes sense - keep going, and it should clear things up.

###Starting Point
First things first - we need some data.  The data set is overly contrived, but it will help prove out the concept. I've added a `data.js` file to my root directory:

{% highlight js %}
/* data.js */
export default [{
    "firstName": "Lacota",
    "lastName": "Mason"
},
...
]
{% endhighlight %}

I used a [data generator](http://www.generatedata.com/) to produce 100 objects containing `firstName` and `lastName`. With the ES6 syntax, the data is exported and useable in my component.

With the example data created, include that in the `app.jsx` file, and pass the data into the `<DataGrid />` component, like this:

{% highlight js %}
/* app.jsx */
...
import Data from '../data.js'
...
React.render(<DataGrid data={Data} />, document.getElementById('dataGrid'));
{% endhighlight %}

React uses a one-way data binding, so the data starts at the parent level, and passes it down to the children.  The data is being passed to the `<DataTable />` component, but it's not actually using it. Just a little more work to get there.

###Props and State
React uses two variables, `props` and `state` to work with data.  The `props` data object contains everything passed into a component. The docs expain `state` absolutely perfect with

>State should contain data that a component's event handlers may change to trigger a UI update.

If you can think of `state` as the data that needs to be changed somehow - then you should be ok.  It's tricky at first, but I'm hoping these tutorials will help demystify it a bit.

We passed in the `data` prop, which is now available in our `DataTable` class.  Using ES6 modules, React is slightly different with ES6 - but changes are small.  With ES6, you use constructor methods, and set the state there:

{% highlight js %}
/* app.jsx */
class DataGrid extends React.Component{
  constructor(props) {
    super(props);
    this.state = {data: props.data};
  }
{% endhighlight %}

The constructor method takes the `props` data object in, and runs `super()`, which may be unfamiiar to any JavaScript developer who hasn't used classes in other languages. `super()` runs the parent functions the current class is extending. In other words, what ever `React.Component` is doing to set it self up, `DataGrid` will do the same thing. You can then do other tasks here to set up your class.  Specifically, we are setting the classes `state` to be `{data: props.data}`.

##Actually Using The Data
Currently, we have an array with 100 objects, and we are passing that into our `<DataGrid />` component as the `data` prop, and then set the inital data set in our `state` object.  With me so far?

Here is where the data finally gets used:

{% highlight js %}
/* app.jsx */
...
<DataTable rows={this.state.data}/>
...
{% endhighlight %}

Save that, wait for reload, and magic! Wait - no. Still the same.  Why, you ask?  Because we are passing the data to the `<DataTable />` component, but it has no clue we are doing that yet. Let's change that so it's expecting the data, and uses it to build out our rows.

{% highlight js %}
/* datatable.jsx */
render() {
  var dataRows = this.props.rows.map(function (row, key){
    return(
      <tr key={key}>
        <td className="col-xs-6">{row.firstName}</td>
        <td className="col-xs-6">{row.lastName}</td>
      </tr>
    )
  });
  ...
{% endhighlight %}

In the `<DataTable />` component, I'm adding the variable `dataRows` to the top of the `render()` method. The component will pull in each row, and return a `<tr>` with the appropriate data. Since each row is unique in the array, we also need to include the `key` property. This helps React out when we update data and need to rerender everything. You can read more in depth about that [here](http://facebook.github.io/react/docs/multiple-components.html#dynamic-children).

In our `<tbody>` tag, we can now render out the `dataRows` variable like this:

{% highlight js %}
/* datatable.jsx */
...
<tbody>
  {dataRows}
</tbody>
...
{% endhighlight %}

Now the data table renders out with the data passed to it. This is still very static, and only serves our current purpose of two columns.  That's ok for now - we can come back later and modify to allow various data sets dynamically.

Also, in the repo you will see that I added some additional styles to fix the header to the top. This feels more like a data grid should, as opposed to a table where the header scrolls as well.


##Wrap Up
This is just the start of the data grid being interactive. Now that we have live data, the next steps will include working with the pagination to update the data grid so that it will react to page changes and keep the data up-to-date accordingly.

I've update my [GitHub repo](https://github.com/kellyjandrews/react-tutorial/tree/modular-build) with the source code from this tutorial.
