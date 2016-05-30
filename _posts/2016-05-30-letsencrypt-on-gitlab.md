---
layout: post
title:  "Use Let's Encrypt for GitLab"
author: "Nicolas B."
date:   2016-05-30
header-img: "assets/img/posts/2016-05-30-letsencrypt-on-gitlab/banner.jpg"
# header-class: inverse
sources:
  - href: https://webnugget.de/setting-up-gitlab-with-free-ssl-certs-from-lets-encrypt-on-ubuntu-14-04/
    label: webnugget.de/setting-up-gitlab-with-free-ssl-certs-from-lets-encrypt-on-ubuntu-14-04/
---

If you have a [GitLab](https://about.gitlab.com/) instance and you want to secure it, you could do it for free with [Let’s Encrypt](https://letsencrypt.org/).

------

To start if it's not already the case you need to [install Let’s Encrypt](https://letsencrypt.org/getting-started/).

When installation is done we create an ini file for Let’s Encrypt. It's more clear than a command line with multiple options.  
So create `/root/letsencrypt-config/gitlab.ini` file.

{% highlight ini %}
# Let's Encrypt config file for GitLab instance

# register certs with the following email address
email = hello@MY_DOMAIN

# standalone authenticator
authenticator = standalone


# generate certificates for the specified domains.
domains = gitlab.MY_DOMAIN, mattermost.MY_DOMAIN, registry.MY_DOMAIN

# use a 4096 bit RSA key
rsa-key-size = 4096

{% endhighlight %}

We use `authenticator = standalone` because of GitLab Registry. The Registry can't be started in `http://`. So it's the more easier. But it will need to have `nginx` down while Let's Encrypt run.  


Now we have to create a small script `/root/letsencrypt-config/renew-ssl-certificates.cron` to automatically renew certificates by using cron.  
The script will stop the GitLab's `nginx` server, then call Let’s Encrypt to renew our certificates, then start the `nginx` server.

{% highlight bash %}
#!/bin/bash

gitlab-ctl stop nginx

/usr/local/bin/certbot-auto certonly -c /root/letsencrypt-config/gitlab.ini --renew-by-default

gitlab-ctl start nginx

{% endhighlight %}


Then we put the script into `cron.monthly`. And manually generate certificates the first time.

{% highlight shell %}
$ chmod +x /root/letsencrypt-config/renew-ssl-certificates.cron
$ ln -s /root/letsencrypt-config/renew-ssl-certificates.cron /etc/cron.monthly/

# Let's generate the certificates for the first time
$ /usr/local/bin/certbot-auto certonly -c /root/letsencrypt-config/gitlab.ini
{% endhighlight %}


To finish we configure GitLab to have it use the certificates.

{% highlight ruby %}
external_url 'https://...'

nginx['redirect_http_to_https'] = true
nginx['ssl_certificate'] = "/etc/letsencrypt/live/gitlab.MY_DOMAIN/fullchain.pem"
nginx['ssl_certificate_key'] = "/etc/letsencrypt/live/gitlab.MY_DOMAIN/privkey.pem"

# ...

mattermost_external_url 'https://...'

mattermost_nginx['redirect_http_to_https'] = true
mattermost_nginx['ssl_certificate'] = "/etc/letsencrypt/live/gitlab.MY_DOMAIN/fullchain.pem"
mattermost_nginx['ssl_certificate_key'] = "/etc/letsencrypt/live/gitlab.MY_DOMAIN/privkey.pem"

# ...

registry_external_url 'https://...'

registry_nginx['ssl_certificate'] = "/etc/letsencrypt/live/gitlab.MY_DOMAIN/fullchain.pem"
registry_nginx['ssl_certificate_key'] = "/etc/letsencrypt/live/gitlab.MY_DOMAIN/privkey.pem"
{% endhighlight %}


And apply it.

{% highlight shell %}
$ gitlab-ctl reconfigure
{% endhighlight %}


Enjoy HTTPS on your GitLab instance :)
