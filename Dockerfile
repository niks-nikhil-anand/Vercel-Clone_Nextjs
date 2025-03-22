FROM ubuntu:focal
RUN apt-get update
RUN apt-get install -y curl
RUN curl -sL https://deb.nodesource.com/setup_22.14.0 | bash -

RUN apt-get upgrade -y
RUN apt-get install -y nodejs
RUN apt-get install git


