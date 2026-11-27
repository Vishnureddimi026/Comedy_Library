# Build from the repository root:  docker build -f app/Dockerfile -t comedy-library .
FROM node:22-alpine
WORKDIR /srv/app
COPY app/package.json app/package-lock.json ./
RUN npm ci --omit=dev
COPY app/server.js ./
COPY index.html ./public/index.html
COPY Old_to_New_Dialogue_Evolution.pdf ./public/
ENV NODE_ENV=production PORT=3000 DATA_DIR=/srv/data
VOLUME ["/srv/data"]
EXPOSE 3000
USER node
HEALTHCHECK --interval=30s --timeout=5s CMD wget -qO- http://127.0.0.1:3000/healthz || exit 1
CMD ["node", "server.js"]
