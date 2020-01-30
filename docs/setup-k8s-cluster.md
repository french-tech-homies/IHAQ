# Setup your Kubernetes Cluster

## Deploy the app

```bash
helm install ihaq-api charts/api --set redis.usePassword=false
helm install ihaq-worker charts/worker
helm install ihaq-client charts/client
```

Validate your deployment `kubectl get pods`

## Deploy Ingress

```bash
# Deploy Traefik
helm install traefik --namespace kube-system --values charts/ingress/values.yaml stable/traefik
# Apply Ingress rules
kubectl apply -f charts/ingress/ingress.yaml
```

Get the traefix External IP using `kubectl get svc -n kube-system` command and add the following DNS record to your zone :
- dashboard
- api.ihaq
- ihaq
