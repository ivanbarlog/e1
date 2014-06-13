#!/usr/bin/env bash

# Vagrant executes this entire script as root, so no need to sudo.

apt-get update

# Install node.js with npm.
apt-get install -y git
apt-get install -y curl
apt-get install -y nodejs
apt-get install -y npm

# Upgrade node to latest stable through npm (packaged version is always old).
npm set registry http://registry.npmjs.org/ # Workaround for certificate error.
npm cache clean -f
npm install -g n
n stable

# Spring cleaning.
npm cache clean -f
npm update npm -g
npm cache clean -f

# This doesn't update our system bins so ensure we're using the right version.
rm -rf /usr/bin/node
ln -fs /usr/local/bin/node /usr/bin/node
rm -rf /usr/bin/npm
ln -fs /usr/local/bin/npm /usr/bin/npm

npm install -g grunt
npm install -g grunt-cli
npm install -g bower

# Install ruby just so we can use CSS preprocessor tasks (sigh).
apt-get install -y ruby
gem install compass

# Install package dependencies.
su - vagrant
    cd /vagrant
    npm install
    bower install --allow-root
exit