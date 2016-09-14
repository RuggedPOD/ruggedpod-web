FROM ubuntu:14.04

RUN set -ex && \
    apt-get update && \
    apt-get install -y --force-yes openssh-server

RUN mkdir /root/.ssh

ADD keys/blade.pub /root/.ssh/authorized_keys

RUN mkdir /var/run/sshd
CMD ["/usr/sbin/sshd", "-D"]
