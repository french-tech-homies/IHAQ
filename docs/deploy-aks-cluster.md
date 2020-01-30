# Deploy an AKS Cluster

> Install helm
> az aks install-cli

```bash
export AKS_SUB_ID=<YourSubID>
export AKS_SSH_KEY=<LocationToYourPublicKey>
export AKS_RG_NAME=<YourRGName>
export AKS_CLUSTER_NAME=<YourClusterName>


az login
az account -set $AKS_SUB_ID
az aks create -n $AKS_CLUSTER_NAME -g $AKS_RG_NAME --ssh-key-value $AKS_SSH_KEY

az aks get-credentials -n $AKS_CLUSTER_NAME -g $AKS_RG_NAME

helm repo add stable https://kubernetes-charts.storage.googleapis.com/
```
