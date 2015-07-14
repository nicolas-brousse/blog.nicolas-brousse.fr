require "json"
require "open-uri"
source "https://rubygems.org"

deps = JSON.parse(open("https://pages.github.com/versions.json").read)
gem "github-pages", deps["github-pages"]

# gem "rack-jekyll"

# gem "guard"
# gem "guard-jekyll-plus", require: true
# gem "guard-livereload"

gem "rake"
gem "git"
gem 'image_optim', '~> 0.11'
