---
layout: post
title:  "Rack web profiler, first release"
subtitle: "A profiler for Rack and Rails web applications."
author: "Nicolas B."
date:   2017-01-05
header-img: assets/img/posts/2017-01-05-rack-web-profiler-first-release/banner.jpg
sources:
  - href: https://github.com/rack-webprofiler/rack-webprofiler
    label: Rack WebProfiler GitHub repository
  - href: https://github.com/rack-webprofiler/rails-webprofiler
    label: Rails WebProfiler GitHub repository
---

It's been more than a year since I introduced one of my projects named Rack Web Profiler.

These last months I worked to stabilise, clean the project and also export the part linked to Rails onto a separate gem.


## Why this gem

I know there is existing tools to develop and debug Rack and Rails applications like the gem `rack-miniprofiler`. But they have some elements missing to allow customisation and easy extension.  
That's why I started creating this gem.

With Rack Web Profiler you have the ability to create custom collectors by using its DSL. It allows you to collect informations then show them on the bar and the panel.
All datas collected are stored in an SQLite database so you have access to the requests history.

For now these two gems are just bases but it could be something more in the future.


## UI preview

I worked with [Thomas De Cicco](http://thomasdecicco.me) a digital designer on the UI of the profiler. We tried together to have something light, simple and readable.

### The bar

It gives you quick informations about the current request. By clicking an element you can access more informations on the panel.

{% include image.html url="/assets/img/posts/2017-01-05-rack-web-profiler-first-release/bar.png" alt="Bar" %}

### The panel

It shows you collectors details for a captured request.  
You also have a page that gives you the previous requests.

{% include image.html url="/assets/img/posts/2017-01-05-rack-web-profiler-first-release/panel.png" alt="Panel" %}


## How to use it

I worked to have something which works with as less configuration as possible. But the gem will come with the possibility of having some options to configure it as you like.

### Rack &rarr; `rack-webprofiler`

With `rack` you need to add the profiler in the middleware like this:

{% highlight ruby %}
home = lambda { |_env|
  [200, { "Content-Type" => "text/html" }, ["<html><body>Hello world!</body></html>"]]
}

builder = Rack::Builder.new do
  use Rack::WebProfiler

  map('/') { run home }
end

run builder
{% endhighlight %}

By default it will use `Dir.tmpdir` to define the temporary directory (place where the database is created). You could configure it by using the `tmp_dir:` option.

To see more you can go to the [GitHub](https://github.com/rack-webprofiler/rack-webprofiler) project.

### Rails &rarr; `rails-webprofiler`

For Rails the gem only contains specific collectors. It includes the `rack-webprofiler` gem to have the bar and panel.
It uses Railtie to automatically load the profiler in the middleware. So you only have to add one gem to the Gemfile as following:

{% highlight ruby %}
# Gemfile
gem "rails-webprofiler"
{% endhighlight %}

It uses the Rails temporary directory as `tmp_dir` for the database place.

To see more you can go to the [GitHub](https://github.com/rack-webprofiler/rails-webprofiler) project.

### Sinatra

For now there is nothing for Sinatra but I plan working on a `sinatra-webprofiler` gem in the future if there are requests.


## How to extend it

Like I said I worked to have something extendable easily. I created a DSL with methods to give you access to the tools you needs.

Here is an example of the time collector.

{% highlight ruby %}
class TimeCollector
  # Just include the DSL.
  include Rack::WebProfiler::Collector::DSL

  # Base64 icon (using svg icon is better).
  icon <<-'ICON'
data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+PHN2ZyB3aWR0aD0iMjBweCIgaGVpZ2h0PSIyMHB4IiB2aWV3Qm94PSIwIDAgMjAgMjAiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+ICAgICAgICA8dGl0bGU+R3JvdXAgMjwvdGl0bGU+ICAgIDxkZXNjPkNyZWF0ZWQgd2l0aCBTa2V0Y2guPC9kZXNjPiAgICA8ZGVmcz48L2RlZnM+ICAgIDxnIGlkPSJQYWdlLTEiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPiAgICAgICAgPGcgaWQ9IkRlc2t0b3AtMiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTEwLjAwMDAwMCwgLTE3MC4wMDAwMDApIiBmaWxsPSIjNTg1NDczIj4gICAgICAgICAgICA8ZyBpZD0iUGVyZm9ybWFuY2UiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAuMDAwMDAwLCAxNjAuMDAwMDAwKSI+ICAgICAgICAgICAgICAgIDxnIGlkPSJHcm91cC0yIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxMC4wMDAwMDAsIDEwLjAwMDAwMCkiPiAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0iTTEwLDE4IEwxMCwxOCBDMTQuNDE4Mjc4LDE4IDE4LDE0LjQxODI3OCAxOCwxMCBDMTgsNS41ODE3MjIgMTQuNDE4Mjc4LDIgMTAsMiBDNS41ODE3MjIsMiAyLDUuNTgxNzIyIDIsMTAgQzIsMTQuNDE4Mjc4IDUuNTgxNzIyLDE4IDEwLDE4IEwxMCwxOCBMMTAsMTggWiBNMCwxMCBDMCw0LjQ3NzE1MjUgNC40NzcxNTI1LDAgMTAsMCBDMTUuNTIyODQ3NSwwIDIwLDQuNDc3MTUyNSAyMCwxMCBDMjAsMTUuNTIyODQ3NSAxNS41MjI4NDc1LDIwIDEwLDIwIEM0LjQ3NzE1MjUsMjAgMCwxNS41MjI4NDc1IDAsMTAgWiIgaWQ9IlNoYXBlIj48L3BhdGg+ICAgICAgICAgICAgICAgICAgICA8cmVjdCBpZD0iUmVjdGFuZ2xlLTQzIiB4PSI5IiB5PSI0IiB3aWR0aD0iMiIgaGVpZ2h0PSI1Ij48L3JlY3Q+ICAgICAgICAgICAgICAgICAgICA8cmVjdCBpZD0iUmVjdGFuZ2xlLTQzLUNvcHkiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDE0LjAwMDAwMCwgMTAuMDAwMDAwKSByb3RhdGUoLTI3MC4wMDAwMDApIHRyYW5zbGF0ZSgtMTQuMDAwMDAwLCAtMTAuMDAwMDAwKSAiIHg9IjEzIiB5PSI4IiB3aWR0aD0iMiIgaGVpZ2h0PSI0Ij48L3JlY3Q+ICAgICAgICAgICAgICAgIDwvZz4gICAgICAgICAgICA8L2c+ICAgICAgICA8L2c+ICAgIDwvZz48L3N2Zz4=
ICON

  identifier "time" # identifier is used as database key and in css.
  label      "Time" # label is used as text in the panel sidebar.
  position   3      # position of the element in the bar and panel sidebar.

  # Collect the data you need to store for the view.
  # You access to the request and response objects (they are not the originals).
  collect do |request, _response|
    runtime = request.env[WebProfiler::ENV_RUNTIME] * 1000.0

    # Store by key the data you need access in the view.
    store :runtime, runtime

    # You could set a color status to the bar item.
    # Possible values: `:warning`, `:danger`, `:success`
    status :warning if runtime >= 200
    status :danger  if runtime >= 1000
    
    # You could conditionally show or hide panel and bar.
    # By default they are shown if they exist in the view.
    show_panel false
    show_bar   true
  end

  # There is two ways to store the ERB template. Here we store view content
  # in the same file as the collector.
  template __FILE__, type: :DATA
  # But you could put it into a separate file like this:
  #template "../template_folder/template_file.erb"
end

__END__
<% tab_content do %>
  <%= data(:runtime).round(2) %> ms
<% end %>

{% endhighlight %}

Or if it was in a separate file:

{% highlight eruby %}
<!-- tab_content block just contains the tab content -->
<% tab_content do %>
  <!-- use data method to get the values you stored by key -->
  <%= data(:runtime).round(2) %> ms
<% end %>

<!-- panel_content block contains the panel content -->
<!-- but here we don't need to show it -->
<% panel_content do %>
  <!-- Your pretty HTML code -->
<% end %>

{% endhighlight %}

After creating the collector, you simply need to register it as following:

{% highlight ruby %}
Rack::WebProfiler.register_collector TimeCollector
{% endhighlight %}

Registration can't be done dynamically in your application code. If you don't always need to show a collector, you have to use the `is_enabled?` DSL method.

If you need more details, you have a [documentation for the DSL](https://github.com/rack-webprofiler/rack-webprofiler/blob/master/docs/DSL.md).

Voilà, you have your first collector!


## Next steps

The Rack WebProfiler will have some other functionalities in the future. Like being able to toggle the bar, have a search form for the requests list and catch the exceptions to show the informations into the panel.  
I also plan to create some other collectors for Rails like I18n, ActiveMailer and ActiveJob collectors.

If you have any feedback, comment or idea of contribution, [github](https://github.com/rack-webprofiler/rack-webprofiler/issues/new)!
