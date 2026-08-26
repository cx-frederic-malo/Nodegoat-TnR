FROM node:18-alpine

ENV USER=node
ENV WORKDIR=/home/$USER/app
WORKDIR $WORKDIR

COPY package*.json ./
RUN npm ci --no-cache

RUN chown -R $USER:$USER $WORKDIR
USER $USER

COPY --chown=$USER:$USER . .

EXPOSE 4000
CMD ["npm", "start"]