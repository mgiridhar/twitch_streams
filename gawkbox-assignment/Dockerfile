# Start from a Debian image with the latest version of Go installed
# and a workspace (GOPATH) configured at /go.
FROM golang

# Copy the local package files to the container's workspace.
ADD . /go/src/gawkbox-assignment

# Build the gawkbox-assignment command inside the container.
# (You may fetch or manage dependencies here,
# either manually or with a tool like "godep".)
RUN mkdir -p /go/src/gawkbox-assignment/config
COPY ./config/config.json /go/src/gawkbox-assignment/config/
RUN go get -u github.com/go-sql-driver/mysql
RUN go install gawkbox-assignment

# Run the outyet command by default when the container starts.
ENTRYPOINT /go/bin/gawkbox-assignment

# Document that the service listens on port 8080.
EXPOSE 8080
