FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm install --no-save --ignore-scripts --no-audit --prefer-offline 2>/dev/null || true
EXPOSE 5002
CMD sh -c "npm run dev & until wget -q -O /dev/null http://127.0.0.1:5002/api-docs 2>/dev/null; do sleep 2; done && npx --yes sequelize-cli db:seed:all 2>/dev/null || true && wait"
