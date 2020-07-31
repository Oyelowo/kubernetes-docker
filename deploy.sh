# We are also adding latest, so that is implicitly used in kubernetes' object configs. Using our git commit sha helps kubernetes
# to always rebuild our docker images since they'll be changing. It also helps when debugging in prod, as we can see the version that broke.
docker build -t oyelowo/multi-client:latest -t oyelowo/multi-client:$SHA -f ./client/Dockerfile ./client
docker build -t oyelowo/multi-server:latest -t oyelowo/multi-server:$SHA -f ./server/Dockerfile ./server
docker build -t oyelowo/multi-worker:latest -t oyelowo/multi-worker:$SHA -f ./worker/Dockerfile ./worker
docker push oyelowo/multi-client:latest
docker push oyelowo/multi-server:latest
docker push oyelowo/multi-worker:latest

docker push oyelowo/multi-client:$SHA
docker push oyelowo/multi-server:$SHA
docker push oyelowo/multi-worker:$SHA

kubectl apply -f k8
kubectl set image deployments/server-deployment server=oyelowo/multi-server:$SHA
kubectl set image deployments/client-deployment client=oyelowo/multi-client:$SHA
kubectl set image deployments/worker-deployment worker=oyelowo/multi-worker:$SHA