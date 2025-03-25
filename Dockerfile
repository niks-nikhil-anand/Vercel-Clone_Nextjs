FROM ubuntu:focal
RUN apt-get update
RUN apt-get install -y curl
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash -

RUN apt-get upgrade -y
RUN apt-get install -y nodejs
RUN apt-get install git -y

# setting the working directory
WORKDIR /home/app

COPY src/lib/main.sh main.sh
COPY src/lib/script.mjs script.mjs
COPY package.json .

RUN npm install

# Make sure main.sh is executable 
RUN chmod +x /home/app/main.sh 
RUN chmod +x /home/app/script.mjs




ENTRYPOINT ["/home/app/main.sh"]




