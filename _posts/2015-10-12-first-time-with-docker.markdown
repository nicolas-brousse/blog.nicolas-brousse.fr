---
layout: post
title:  "First time with Docker"
author: "Nicolas B."
date:   2015-10-12 10:45:26
header-img: assets/img/posts/2015-10-12-first-time-with-docker/banner.jpg
# sources:
#   - href: http://website.com
#     label: website
---

Maybe you already hear about [Docker](https://www.docker.com/), this open source application to manage containers. But it's not very easy to start working with it.  
There is only few weeks that I start to understand how it works. So I decided to write an article to list some basics.


## Prerequisites

There are multiple ways to install Docker listed in the [documentation](https://docs.docker.com/installation/).

I am working on OSX, so I will be focus on the OSX environment. If you are on Linux just follow the Docker [documentation](https://docs.docker.com/installation/).

You can use [Docker Toolbox](https://www.docker.com/toolbox) to install Docker via an installer. But I prefer to do the installation by using command lines as follows.

First we need **VirtualBox** installed.  
We could install it from their [website](https://virtualbox.org/wiki/Downloads/) or with [Homebrew Cask](http://caskroom.io/) like this:

{% highlight bash %}
$ brew cask install virtualbox
{% endhighlight %}

Then install Docker.

{% highlight bash %}
$ brew install docker
{% endhighlight %}


### Docker Machine

On Linux we can use Docker directly after its installation. But on OSX we need to install `boot2docker` to be able to use Docker. It creates a very small Linux VM.  

There is two ways to install it. You can follow installation instructions on [boot2docker.io](http://boot2docker.io/) or install it via `docker-machine`.

I prefer to use `docker-machine` because it allows to install and manage multiple machines (locales and remotes).

So let's install it.

{% highlight bash %}
$ brew install docker-machine
{% endhighlight %}

Then we need to create the Docker machine named `dev` ([Docker Machine get started](https://docs.docker.com/machine/get-started/)).

{% highlight bash %}
$ docker-machine create --driver virtualbox dev
{% endhighlight %}

If we list our machines we have the dev docker machine.

{% highlight bash %}
$ docker-machine ls
NAME   ACTIVE   DRIVER       STATE     URL                         SWARM
dev             virtualbox   Running   tcp://192.168.99.100:2376
{% endhighlight %}

But if we try listing the processes we have an error.

{% highlight bash %}
$ docker ps # list the processes
Get http:///var/run/docker.sock/v1.20/containers/json: dial unix /var/run/docker.sock: no such file or directory.
* Are you trying to connect to a TLS-enabled daemon without TLS?
* Is your docker daemon up and running?
{% endhighlight %}

`docker` command needs some informations about the host machine to communicate with it and do the jobs we need.
We have to set the `env` variables with this command.

{% highlight bash %}
$ eval "$(docker-machine env dev)"
$ docker ps
CONTAINER ID        IMAGE                        COMMAND                CREATED              STATUS              PORTS               NAMES
{% endhighlight %}

We are now ready to create our first Docker container.


## Docker with existing images

As first example we could use a simple and light image named `busybox`.

### Busybox

[Busybox](https://hub.docker.com/_/busybox/) is one of the smallest Docker images (less than 5MB). This image contains "common UNIX utilities into a single small executable".

{% highlight bash %}
$ docker run -it busybox
{% endhighlight %}

By doing this command we will create a new container from the `busybox` image. If this is the first time we execute it, it will pull the image first.  
And for this image it will open a shell inside. This come from its [definition](https://github.com/docker-library/busybox/blob/4979e9bb245d8e28d37f9cf21c01b828d3830da5/upstream/Dockerfile#L3).

When we are into the container we could do what we want. It's really close to a VM for this part.  
But each time we use `docker run` command, it will create a new container and loose what we did. If we want to use the same container we have to name it with `--name` option and `--detatch` the container.  

For example:
{% highlight bash %}
$ docker run -itd --name=my-busybox busybox
3c4eb1117ece13b72647459960f4438f9da1b9445afe56188b19d1492b8c1c61

# And play with 'my-busybox' container
$ docker exec -it my-busybox ls -la
$ docker exec -it my-busybox touch index.html
$ docker exec -it my-busybox ls -la
$ docker exec -it my-busybox echo hello world
$ docker exec -it my-busybox sh
{% endhighlight %}

About the `docker run` options:  
`-d, --detach=false`: Run container in background and print container ID  
`--name=`: Assign a name to the container  
`-i, --interactive=false`: Keep STDIN open even if not attached.  
`-t, --tty=false`: Allocate a pseudo-TTY.


### Debian

To test something most common. We could do the same with the `debian` image.

{% highlight bash %}
$ docker run -it debian
{% endhighlight %}

For `debian` image it's similar than the `busybox` one. But it will open a instance with `bash` and not `sh` ([debian image definition](https://github.com/tianon/docker-brew-debian/blob/fbf1d76bdcba758d49f5fbf5c591e5149658e991/jessie/Dockerfile#L3)).


### Nginx

Now let's use `nginx` image. This works a bit different.

{% highlight bash %}
$ docker run -p 8000:80 nginx
{% endhighlight %}

With this command we expose the port `80` of the container into the port `8000` of docker host.  
Just execute one of this two lines in a new terminal to check it.

{% highlight bash %}
$ curl $(docker-machine ip dev):8000

# To open in browser (OSX)
$ open http://$(docker-machine ip dev):8000
{% endhighlight %}

Nice but could be better by including content!

{% highlight bash %}
$ docker run -p 8000:80 \
  -v /path/to/content:/usr/share/nginx/html:ro \
  nginx
{% endhighlight %}

If we refresh our brother we now have our folder accessible :)

About the options:  
`-p, --publish=[]`: Publish a container's port(s) to the host.  
`-v, --volume=[]`: Bind mount a volume.

Explanation of `/path/to/content:/usr/share/nginx/html:ro`:  
`/path/to/content`: is the local folder to share.  
`/usr/share/nginx/html`: the remote folder.  
`ro`: read-only mode (optional).


## Remove old containers

Some commands to help us.

{% highlight bash %}
$ docker ps
CONTAINER ID        IMAGE                        COMMAND                CREATED              STATUS              PORTS               NAMES
{% endhighlight %}

We normally have nothing running. But it does not mean that there is 0 containers.

{% highlight bash %}
$ docker ps -a
CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS                      PORTS               NAMES
60477ca46da0        debian              "/bin/bash"              4 minutes ago       Exited (0) 4 seconds ago                        boring_morse
4e584955af81        nginx               "nginx -g 'daemon off"   5 minutes ago       Exited (0) 35 seconds ago                       agitated_mahavira
{% endhighlight %}

There is container exited. The following command will remove containers that not running.

{% highlight bash %}
$ docker rm $(docker ps -a -q)
{% endhighlight %}


## Dockerfile, Docker-composer

I will talk about `Dockerfile` file and `docker-compose` command in a next article.


## Conclusion

Really interesting tool but it need a new an approach.  
For a web application we don't really have to use and configure a http server. It's not the job of the application container. But we may have to use a proxy that could be instantiate into a container. And its the proxy server that will redirect the call into the good docker container port.
