FROM alpine:3.20

RUN apk add --no-cache curl tar ca-certificates && \
    update-ca-certificates && \
    curl -L -o gitleaks.tar.gz https://github.com/gitleaks/gitleaks/releases/download/v8.18.2/gitleaks_8.18.2_linux_x64.tar.gz && \
    tar -xzf gitleaks.tar.gz && \
    mv gitleaks /usr/local/bin/ && \
    chmod +x /usr/local/bin/gitleaks
    
WORKDIR /app
ENTRYPOINT ["gitleaks"]