#!/bin/bash

echo "updating code..."
git pull

echo "installing packages..."
yarn install

echo "building..."
yarn build:prod

echo "building image..."
docker build -t mrrs878/blog_dashboard:latest .

echo "stoping app..."
docker-compose down

echo "restarting app..."
docker-compose up -d --build

echo "awesome, you succeeded!"
