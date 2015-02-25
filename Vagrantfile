# -*- mode: ruby -*-
# vi: set ft=ruby :

$script = <<SCRIPT
apt-get update

apt-get install -y apache2
a2enmod proxy_http
rm -f /etc/apache2/ports.conf /etc/apache2/sites-enabled/*
ln -s /vagrant/apache/ports.conf /etc/apache2/ports.conf
ln -s /vagrant/apache/ocp-vhost.conf /etc/apache2/sites-enabled/ocp-vhost.conf
service apache2 restart

apt-get install -y python-dev python-pip libxml2-dev libxslt1-dev zlib1g-dev
pip install virtualenv

cd /opt/ruggedpod-api
virtualenv env
source env/bin/activate
pip install -r mock-requirements.txt
python server.py >> /var/log/ruggedpod-api.log 2>&1 &

curl -sSL https://deb.nodesource.com/setup | sudo bash -
apt-get install -y git nodejs build-essential
npm install -g bower
SCRIPT

Vagrant.configure('2') do |config|
  config.vm.box = 'ubuntu/trusty64'

  config.vm.provider 'virtualbox' do |vb|
    vb.customize ['modifyvm', :id, '--memory', '1024']
  end

  config.vm.network "forwarded_port", guest: 80, host: 8000
  config.vm.synced_folder 'web', '/var/www/ruggedpod'
  config.vm.synced_folder '../ruggedpod-api', "/opt/ruggedpod-api"
  config.vm.provision 'shell', inline: $script
end
