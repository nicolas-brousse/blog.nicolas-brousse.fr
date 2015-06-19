require 'json'
require 'open-uri'
source "https://rubygems.org"

deps = JSON.parse(open('https://pages.github.com/versions.json').read)

deps.each do |dep, version|
  gem dep, version unless dep == 'ruby'
end

# gem 'rack-jekyll'

# gem 'guard'
# gem 'guard-jekyll-plus', require: true
# gem 'guard-livereload'

gem 'git'
gem 'rake'
