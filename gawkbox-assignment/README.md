# Twitch live streams
This is a cross platform (iOS & Android) mobile app for streaming twitch live
streams. Developed using React Native for user interface, and Golang server
that communicates with twitch REST API and Mysql database.

## Tech/framework used
<b>Built with</b>
- [Go](https://golang.org)
- [React Native](https://facebook.github.io/react-native/)
- [MySQL](https://www.mysql.com)
- [Docker](https://www.docker.com)

## Installation and Setup
This app requires you to install [Golang](https://golang.org/dl/) and get familiar
with [Go Workspaces](https://golang.org/doc/code.html#Workspaces) and
[GOPATH environmental variable](https://golang.org/doc/code.html#GOPATH). Then
download [Docker](https://www.docker.com/community-edition#/download) to spin-up
Golang and Mysql containers.

Clone the project repository and place it under `$GOPATH/src`.
```
cd $GOPATH
mkdir -p src
git clone https://github.com/mgiridhar/twitch_streams.git ./src
cd gawkbox_assignment/
```

Build a docker image for the Golang web-server, and spin up a docker container
that serves at port `8080`.
```
docker build -t web_server_image .
docker run --publish 8080:8080 --name web_server --rm web_server_image
```
