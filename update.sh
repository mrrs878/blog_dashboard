###
 # @Author: your name
 # @Date: 2020-09-22 09:42:32
 # @LastEditTime: 2020-09-24 19:25:31
 # @LastEditors: your name
 # @Description: In User Settings Edit
 # @FilePath: \blog_dashboard\update.sh
### 
#!/bin/bash

echo "updating code..."
git pull

echo "building image..."
docker build -t mrrs878/blog_dashboard:latest .

echo "stoping app..."
docker-compose down

echo "restarting app..."
docker-compose up -d --build

echo "hooray, succeeded!"
