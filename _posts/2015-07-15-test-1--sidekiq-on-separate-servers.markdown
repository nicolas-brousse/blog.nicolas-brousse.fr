---
layout: post
title:  "Test #1 — Use Sidekiq on a separate servers"
author: "Nicolas B."
date:   2015-07-15
header-img: assets/img/posts/2015-07-15-test-1--sidekiq-on-separate-servers/banner.jpg
sources:
  - href: http://stackoverflow.com/questions/18265427/is-it-possible-to-run-sidekiq-on-a-separate-host-from-the-rails-host
    label: Stackoverflow question about Sidekiq on separate server
  - href: http://docs.vagrantup.com/v2/multi-machine/
    label: Vagrant multi-machine documentation
  - href: http://sidekiq.org/
    label: Sidekiq website
  - href: http://railscasts.com/episodes/366-sidekiq/
    label: 'Railscast #366 Sidekiq'
  - href:  https://github.com/nicolas-brousse/1-sidekiq-separate-servers
    label: Source code
---

These last days I tried to use Sidekiq on different servers than the Rails app one.

## First, What is Sidekiq?

[Sidekiq](http://sidekiq.org/) is a <q>Simple, efficient background processing for Ruby</q>.  

With more words, it's a library who allows you to create job classes. A job contains the code pieces you want to perform later. It's a kind of code decentralization.

And in this test the goal is to try running the job in different server than the web server.


## Why?

Why is it better to separate worker of web server?  
Imagine you need to do processes, so you use memory and CPU. In this case that means you take web server resources. So your web app could be slower.

By using different servers, it uses separate server resources. If process needs time, it takes the time it needs. And you could eventually decide to use a bigger server later.  
So it's just easier to scale web and worker servers separately with you VPS or cloud hosting provider.


## Test in pictures

To do this test I used **Vagrant** with 3 VMs. One for the Rails `web` server and two others for Sidekiq named `worker-01` + `worker-02`.

For the Rails app code I simply used the one of the [Railscast #366](http://railscasts.com/episodes/366-sidekiq/) by [Ryan Bates](https://twitter.com/rbates).  
I only converted the Sidekiq worker into a Rails ActiveJob.

The example is a simple snippets application.

### 1. Set data into form

{% include image.html url="/assets/img/posts/2015-07-15-test-1--sidekiq-on-separate-servers/img-1.png" alt="Form" %}
This is the "homepage" and also the form to send the code of our snippet.

### 2. After data posted

{% include image.html url="/assets/img/posts/2015-07-15-test-1--sidekiq-on-separate-servers/img-2.png" alt="Datas posted" %}
After posted our snippet we could see the code. Currently the code is still raw. We have to wait the job is processed.

### 3. After worker processed

{% include image.html url="/assets/img/posts/2015-07-15-test-1--sidekiq-on-separate-servers/img-3.png" alt="Datas processed" %}
Now the worker processed the job. The code is full of colors.
And we could see that the IP is a different one and the hostname as well.

### 4. Retry a new once

{% include image.html url="/assets/img/posts/2015-07-15-test-1--sidekiq-on-separate-servers/img-4.png" alt="Datas posted after retry" %}
In my example I instantiate two worker servers. So I do others tests.

### 5. After worker processed on a different worker

{% include image.html url="/assets/img/posts/2015-07-15-test-1--sidekiq-on-separate-servers/img-5.png" alt="Datas processed after retry" %}
In this new test the IP is not the same than the other time. It's not the same worker server who processed the job.

### Sidekiq admin

{% include image.html url="/assets/img/posts/2015-07-15-test-1--sidekiq-on-separate-servers/img-6.png" alt="Sidekiq admin" %}
We have the list of the Sidekiq processes who are working. The two (or more) workers are listed here :)


## Serveurs configuration

Let see with scheme how it looks for the servers configuration.

### My current test with Vagrant

For the test I did with Vagrant, it looked like this.

{% include image.html url="/assets/img/posts/2015-07-15-test-1--sidekiq-on-separate-servers/configuration-vagrant.png" alt="Vagrant configuration" %}

So we have the `web` server who also contains the Redis server and the Rails app. Because this is a test, I run the application in development mode with Rack.
The application is exactly the same used for the 3 servers. So I used an Sqlite as a file for simplicity.

For the `worker`s it uses the same Redis server and database. And I run the Sidekiq root process as a daemon.

### Production example

So, what about a production configuration? It could be something like this.

{% include image.html url="/assets/img/posts/2015-07-15-test-1--sidekiq-on-separate-servers/configuration-production-example.png" alt="Example of production configuration" %}

And have separate `db` and `redis` servers. `web` servers only contain the application with the http server. If you want multiple `web` servers, you have to install a proxy server as HAProxy.


## Code sources

If you want to test it, [all the code is available on GitHub](https://github.com/nicolas-brousse/1-sidekiq-separate-servers){:target="_blank"}.  
After clone or download you only have to install Vagrant (if you haven't yet) and just `vagrant up`.

Have fun :smile:!
