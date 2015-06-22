---
layout: post
title:  "Rack web profiler"
author: "Nicolas B."
date:   2015-06-22
header-img: assets/img/posts/rack-web-profiler/banner.jpg
---

Before I started using Ruby, I coded mostly with PHP. Back then, I worked a lot with Symfony2 and its web profiler.  
I found it really nice and I'm surprised that nothing similar exists in Ruby and Ruby on Rails.
So I decided to create one.

I'm currently working on it. I mainly would like to provide a nice an simple DSL to allow everybody
to create and register their own collector(s).

## Create a collector

Until now I'm thinking about creating DSL like the examples right after.
As a lot of libraries and tools, it's a nice way to allow externals extended.

To start prototyping I worked with classic classes. But I guess it's a nice instant to move in a DSL way.
So, here are the two ways I think are interesting.

### DSL with template file

{% highlight ruby %}
class MyCollector
  extends WebProfiler::Collector::DSL

  collector_name 'my_collector' # Technical name of the collector.
  icon     ''                   # Base64 encoded image for the icon collector.
  position 0                    # Position of the collector in the toolbar.

  # Retrieve the env, the request and the response
  # to collect the needed information. Then save datas
  # and show them in the profiler toolbar and panel.
  collect do |env, request, response|
    store :version, MyApp::VERSION
    store :list, ['value1', 'value2']
  end

  # The path of the collector template.
  # May be with some options to know if we show the collector
  # on tab and/or panel.
  template '../path/to/template.erb', tab: false, panel: false

  # To know if the collector must be enabled.
  # Usefull to load collector only if a gem is installed.
  is_enabled? {defined? MyApp}
end
{% endhighlight %}

The `erb` template could look like this. By using the `content_for` method.

{% highlight erb %}
<% content_for :tab do %>
  <!-- Here the tab content -->

  <div class="tab">
    <%= data[:version] %>

    <div class="pane">
      <ul>
      <% data[:list].each do |item| %>
        <li><%= item %></li>
      <% end %>
      </ul>
    </div>
  </div>
<% end %>

<% content_for :panel do %>
  <!-- Here the tab -->

  <div class="panel">
    <ul>
    <% data[:list].each do |item| %>
      <li><%= item %></li>
    <% end %>
    </ul>
  </div>
<% end %>
{% endhighlight %}


### 100% DSL

I'm not sure yet about the template part. It might be better to
have DSL methods into the collector instead of a template.  
With something like this:

{% highlight ruby %}
class MyCollector
  extends WebProfiler::Collector::DSL

  ...

  tab_value do
    'MyApp'
  end

  tab_content do
    table do
      row 'Version', MyApp::VERSION
    end
  end

  panel_content do
    div do
      p "This is my app with version #{MyApp::VERSION}"
    end
  end
end
{% endhighlight %}


## Register a collector

It's nice to create a collector but we also have to register it. It's why I prepared some code to allow it.

### Into an app

Then with the collector the idea is just to register it as this.

{% highlight ruby %}
# config/initializers/web_profiler.rb

WebProfiler.register_collector MyCollector

# or

WebProfiler.config do |c|
  c.add_collector MyCollector
end

{% endhighlight %}


### Into a gem

But also it allow gems to contain their own collector(s).

{% highlight ruby %}
# lib/my_gem.rb

if defined? WebProfiler
  WebProfiler.register_collector MyCollector
end

{% endhighlight %}


## Conclusion

I my opinion the template file is nicer to management html. At least if the html to generate is big.  
But have the content into the collector class is simpler because we only have one file.


I will inform you of the progression.
