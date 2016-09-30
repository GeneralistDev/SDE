# SDE Setup

1. Download and install VirtualBox https://www.virtualbox.org/
2. Download and install Vagrant https://www.vagrantup.com/

Run `./setup.sh` from terminal

# Local Development
Start the vagrant instance
```
vagrant up
```
Once that's started, you can connect via SSH using
```
vagrant ssh
```
Start the local node script
```
cd /vagrant && npm start
```
Access the local instance from your host web browser at [http://localhost:8080](http://localhost:8080)
