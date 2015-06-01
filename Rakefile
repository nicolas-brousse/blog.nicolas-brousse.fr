# For Bundler.with_clean_env
require 'bundler/setup'

desc 'Deploy on github'
task :deploy do
  sh 'mkdir -p tmp/deploy'
  
  # Use git to have the remote git datas
  
  # List of versionned files
  files = `git ls-files -z`.split("\x0")
  
  # TODO copy this files into tmp/deploy
end