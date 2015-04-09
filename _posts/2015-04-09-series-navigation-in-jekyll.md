---
title: Series Navigation In Jekyll
comments: true
---

I love [Jekyll](http://jekyllrb.com/).  Simple to use, easy to set up, and runs great in GitHub pages without much effort. You can see how I have this blog set up in it's [GitHub repo](https://github.com/kellyjandrews/kellyjandrews.github.io).

Recently, I have been writing blog posts that really fit into a series. Initially I was using copy pasta to update each series post with the latest links. Well, it was tedious - so I wanted a better way.

Using some [Liquid template](http://liquidmarkup.org/) logic and the data already being passed around, it turned out to be relatively easy.

Each post used the following [YAML Front Matter](http://jekyllrb.com/docs/frontmatter/):

{% highlight yaml %}
---
title: My Blog Post
series: My Series Title
---
{% endhighlight %}

And I modified my `post.html` layout file to include:

{% highlight liquid %}
{% raw %}
{{content}}
{% if page.series %}
  <h4>{{page.series}}</h4>
  <ol>
  {% for post in site.posts reversed %}
    {% if post.series == page.series %}
      {% if page.url != post.url %}
      <li><a href="{{site.baseurl}}{{post.url}}" title="{{post.title}}">{{post.title}}</a></li>
      {% else %}
      <li class="active">{{post.title}}</li>
      {% endif %}
    {% endif %}
  {% endfor %}
  </ol>
{% endif %}
  {% endraw %}
{% endhighlight %}

Essentially I grab all posts in `reversed` order (so they are in order by posted date ascending) and check for the `series` to match the current page. When that's true, I check if the page is not the current one with `{{"{%"}} if page.url != post.url %}` and provide a link to the other posts, and no link if the page is the one you are currently on.

Really easy way to create some great navigation for a series of tutorials. Hope it helps!
