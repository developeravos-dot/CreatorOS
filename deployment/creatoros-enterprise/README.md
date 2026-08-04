# CreatorOS Enterprise Deployment

This directory contains the initial CreatorOS Enterprise production deployment foundation.

## Included

- Kubernetes namespace, deployment, service, ingress, HPA, and disruption budget.
- Three-replica high-availability baseline.
- Rolling updates with zero unavailable replicas.
- Disaster-recovery backup and recovery policies.
- Readiness and liveness probes.
- Resource requests and limits.

## Apply

```powershell
kubectl apply -k deployment/creatoros-enterprise/kubernetes
```

Secrets are intentionally excluded and must be supplied by the target environment.
