FROM alpine:3.19

RUN apk add --no-cache curl \
  && curl -sfL https://github.com/sigstore/cosign/releases/latest/download/cosign-linux-amd64 \
     -o /usr/local/bin/cosign \
  && chmod +x /usr/local/bin/cosign

RUN apk add --no-cache docker-cli

ENTRYPOINT ["cosign"]