# -*- mode: ruby -*-
# vi: set ft=ruby :

$script = <<SCRIPT
set -ex


##################################################################
### Apt update
##################################################################

sudo apt-get update


##################################################################
### Generate Self signed certificate
##################################################################

cert=/etc/ssl/certs/ruggedpod
sudo openssl req -nodes -newkey rsa:2048 -keyout ${cert}.key -out ${cert}.csr \
                 -subj "/C=FR/ST=Paris/L=Paris/O=OCP/OU=RuggedPOD/CN=admin.ruggedpod"
sudo openssl x509 -req -days 365 -in ${cert}.csr -signkey ${cert}.key -out ${cert}.crt


##################################################################
### Install tools
##################################################################

sudo apt-get install -y --force-yes git tcpdump bridge-utils jq curl


##################################################################
### Install Apache + System dependencies for python app
##################################################################

sudo apt-get install -y --force-yes apache2 python-dev python-pip libxml2-dev \
                                    libxslt1-dev zlib1g-dev libffi-dev libssl-dev


##################################################################
### Apache configuration
##################################################################

sudo a2enmod proxy_http
sudo a2enmod rewrite
sudo a2enmod proxy_wstunnel
sudo a2enmod ssl

sudo rm -f /etc/apache2/ports.conf /etc/apache2/sites-enabled/*
sudo ln -s /vagrant/apache/ports.conf /etc/apache2/ports.conf
sudo ln -s /vagrant/apache/ruggedpod-vhost.conf /etc/apache2/sites-enabled/ruggedpod-vhost.conf


##################################################################
### Install RuggedPOD API
##################################################################

cd /opt/ruggedpod-api
sudo pip install -r test-requirements.txt
sudo pip install -e .
sudo pip uninstall -y rpi.gpio

sed -i "s/profile: production/profile: development/" conf.yaml


##################################################################
### Install NodeJS (for RuggedPOD serial web console)
##################################################################

curl -sSL https://deb.nodesource.com/setup | sudo bash -
sudo apt-get install -y git nodejs build-essential
sudo npm install -g bower
sudo npm install -g grunt-cli


##################################################################
### Fetch web application dependencies
##################################################################

cd /vagrant
sudo rm -rf web/packages
bower install


##################################################################
### Fetch serial web console dependencies
##################################################################

cd /vagrant/serial
sudo chown -R vagrant: /home/vagrant/.npm
sudo rm -rf node_modules
npm install --no-bin-links
sed -i "s/screen-safe/screen-mock/" config.json


##################################################################
### Setup startup script
##################################################################

sudo tee /etc/rc.local > /dev/null << EOL
#!/bin/bash

cd /vagrant/serial
nohup npm start >> /var/log/ruggedpod-serial-terminal.log &
service apache2 restart
cd /opt/ruggedpod-api
nohup python ruggedpod_api/server.py --debug >> /var/log/ruggedpod-api.log 2>&1 &
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
  config.vm.network "forwarded_port", guest: 443, host: 8443

  config.vm.synced_folder 'web', '/var/www/ruggedpod'
  config.vm.synced_folder '../ruggedpod-api', "/opt/ruggedpod-api"
  config.vm.provision 'shell', inline: $script, privileged: false
end
