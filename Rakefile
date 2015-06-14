# For Bundler.with_clean_env
require 'bundler/setup'
require 'rubygems'
require 'git'

desc 'Deploy on github'
task :deploy do
  # sh 'rm -rf tmp/deploy'
  sh 'mkdir -p tmp/deploy'

  # Use git to have the remote git datas
  g = Git.clone('git@github.com:nicolas-brousse/blog.nicolas-brousse.fr.git', 'tmp/deploy')

  # List of versionned files
  files = `git ls-files -z`.split("\x0")

  files.each do |file|
    puts file.inspect
  end

  # TODO copy this files into tmp/deploy
  commit_msg = "Deploy #{Time.now.to_s}"
end
