FROM ubuntu:focal
RUN apt-get update
RUN apt-get install -y curl
RUN curl -sL https://deb.nodesource.com/setup_22.14.0 | bash -

RUN apt-get upgrade -y
RUN apt-get install -y nodejs
RUN apt-get install git -y

# setting the working directory
WORKDIR /home/app

COPY src/script/main.sh main.sh

# Make sure main.sh is executable 
RUN chmod +x /home/app/main.sh 



ENTRYPOINT ["/home/app/main.sh"]




