#!/bin/bash

echo "updatimg code..."
git pull

echo "pulling image..."
docker-compose pull

echo "stoping app..."
docker-compose down

echo "restarting app..."
docker-compose up -d --build

echo "hooray, succeeded!"
