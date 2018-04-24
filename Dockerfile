FROM alpine:3.7

RUN apk --update add readline readline-dev libxml2 libxml2-dev libxslt \
    libxslt-dev python zlib zlib-dev ruby ruby-dev yaml \
    yaml-dev libffi libffi-dev build-base nodejs ruby-io-console \
    ruby-irb ruby-json ruby-rake ruby-rdoc && \
    gem install bundler

WORKDIR /usr/src

COPY Gemfile Gemfile.lock ./
RUN echo "gem: --no-rdoc --no-ri" >> "${HOME}/.gemrc" && \
    bundle install --jobs 20 --retry 5 --without development

COPY package.json .
RUN npm install --quiet

COPY . .

EXPOSE 4000

CMD ["./node_modules/.bin/gulp"]
