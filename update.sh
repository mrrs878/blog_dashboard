#!/bin/bash
###
 # @Author: mrrs878@foxmail.com
 # @Date: 2021-03-05 17:33:59
 # @LastEditTime: 2021-03-10 11:26:51
 # @LastEditors: Please set LastEditors
 # @Description: In User Settings Edit
 # @FilePath: /blog_dashboard/update.sh
### 

# echo "updating code..."
# git pull

# echo "installing packages..."
# yarn install

# echo "building..."
# yarn build:prod

# echo "building image..."
# docker build -t mrrs878/blog_dashboard:latest .

echo "stoping app..."
docker-compose down

echo "restarting app..."
docker-compose up -d --build

echo "awesome, you succeeded!"
