#!/bin/bash
echo 'Building project frontend'
cd mta-final-projects-site
echo 'Git pull' 
git fetch
git clean -f
git reset --hard
git pull
echo 'Docker build'
docker build --platform linux/amd64 -t gcr.io/final-project-427104/frontend-app .
echo 'Docker push'
docker push gcr.io/final-project-427104/frontend-app:latest

cd ..
echo 'Building project backend'
cd mta-final-projects-site-backend-server
echo 'Git pull'
git fetch
git clean -f
git reset --hard
git pull
echo 'Docker build'
docker build --platform linux/amd64 -t gcr.io/final-project-427104/backend-app .
echo 'Docker push'
docker push gcr.io/final-project-427104/backend-app:latest

echo 'Finished build'
