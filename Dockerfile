FROM mhart/alpine-node:6.9.1

# Install git
RUN apk add --update git && rm -rf /tmp/* /var/cache/apk/*

# Set environment variables
ENV NPM_CONFIG_LOGLEVEL warn
ENV NODE_ENV production
ENV appDir /opt/app

# Set the work directory
RUN mkdir -p ${appDir}
WORKDIR ${appDir}

# Add our package.json and install *before* adding our application files
ADD package.json ./
RUN npm i --production

# Add application files
ADD . ./

# Build with next.js
RUN npm run build

# Expose the port
EXPOSE 3000

CMD ["npm", "start"]
