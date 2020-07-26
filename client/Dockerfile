FROM node:alpine

WORKDIR /app

COPY ./package.json ./
RUN npm install

COPY . . 
RUN npm run build


FROM nginx

# Default port for nginx is 80, but this was changed in the nginx/default.conf file
EXPOSE 3000

# This overwrites the defualt conf of nginx with our default in nginx/default.conf
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=0 /app/build /usr/share/nginx/html
