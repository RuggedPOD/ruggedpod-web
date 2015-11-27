# -*- mode: ruby -*-
# vi: set ft=ruby :

$script = <<SCRIPT
set -ex

sudo apt-get update

sudo apt-get install -y apache2
sudo a2enmod proxy_http
sudo a2enmod rewrite
sudo a2enmod proxy_wstunnel
sudo rm -f /etc/apache2/ports.conf /etc/apache2/sites-enabled/*
sudo ln -s /vagrant/apache/ports.conf /etc/apache2/ports.conf
sudo ln -s /vagrant/apache/ruggedpod-vhost.conf /etc/apache2/sites-enabled/ruggedpod-vhost.conf

sudo apt-get install -y python-dev python-pip libxml2-dev libxslt1-dev zlib1g-dev libffi-dev libssl-dev
sudo pip install virtualenv

cd /opt/ruggedpod-api
rm -rf env
virtualenv env
source env/bin/activate
pip install -r mock-requirements.txt

curl -sSL https://deb.nodesource.com/setup | sudo bash -
sudo apt-get install -y git nodejs build-essential
sudo npm install -g bower
sudo npm install -g grunt-cli

cd /vagrant
sudo rm -rf web/packages
bower install

cd /vagrant/serial
sudo chown -R vagrant: /home/vagrant/.npm
sudo rm -rf node_modules
npm install --no-bin-links
sed -i "s/screen-safe/screen-mock/" config.json

sudo tee /etc/rc.local > /dev/null << EOL
#!/bin/bash

service apache2 restart
cd /opt/ruggedpod-api
env/bin/python ruggedpod-api/server.py >> /var/log/ruggedpod-api.log 2>&1 &
cd /vagrant/serial
npm start >> /var/log/ruggedpod-serial-terminal.log 2>&1 &
EOL

sudo chmod a+x /etc/rc.local
sudo /etc/rc.local

SCRIPT

Vagrant.configure('2') do |config|
  config.vm.box = 'ubuntu/trusty64'

  config.vm.provider 'virtualbox' do |vb|
    vb.customize ['modifyvm', :id, '--memory', '1024']
  end

  config.vm.network "forwarded_port", guest: 80, host: 8000
  config.vm.synced_folder 'web', '/var/www/ruggedpod'
  config.vm.synced_folder '../ruggedpod-api', "/opt/ruggedpod-api"
  config.vm.provision 'shell', inline: $script, privileged: false
end
