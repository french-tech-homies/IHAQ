FROM ubuntu:18.04

ENV TERM=xterm

RUN export DEBIAN_FRONTEND=noninteractive && \
    apt-get update -qq -y && \
    apt-get upgrade -qq -y --no-install-recommends && \
    apt-get install -qq -y --no-install-recommends \
        bash ca-certificates curl gnupg2 jq wget \
        curl iptables iproute2 uml-utilities bridge-utils \
        python3 openssh-client systemd \
        net-tools dnsutils lsof openssl \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*