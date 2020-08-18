#!/bin/bash

echo "updating script..."
git pull

echo "restarting app..."
docker-compose up -d

echo "awesome, you succeeded!"
