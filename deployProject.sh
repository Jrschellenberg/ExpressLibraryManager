CONTAINER_NAME=expressLibrary
# production
export CONTAINER_NAME=$CONTAINER_NAME
export PORT=8010
docker-compose -p expressLibrary up -d --build