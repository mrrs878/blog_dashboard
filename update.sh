#!/bin/bash
###
 # @Author: mrrs878@foxmail.com
 # @Date: 2021-03-05 17:33:59
 # @LastEditTime: 2021-07-20 23:48:38
 # @LastEditors: mrrs878@foxmail.com
 # @Description: In User Settings Edit
 # @FilePath: \blog_dashboard\update.sh
### 

echo "updating code..."
git pull

# echo "installing packages..."
# yarn install

# echo "building..."
# yarn build:prod

# echo "building image..."
# docker build -t mrrs878/blog_dashboard:latest .

echo "stoping app..."
docker-compose down

echo "removing image(s)..."
docker image rm mrrs878/blog_dashboard:master

echo "restarting app..."
docker-compose up -d --build

echo "awesome, you succeeded!"
