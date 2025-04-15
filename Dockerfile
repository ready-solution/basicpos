FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install
COPY . .
ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL

RUN npx prisma generate

# ENV NEXT_IGNORE_TYPE_ERRORS=true

RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
