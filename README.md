Services: 
NodePort is for connecting from outside , it assigns a random port which connects from outside.
Cluster Ip, is used to internal communication between pods in a cluster( basically in one machine)

<!-- Not sure -->
LoadBalancer service directs traffic from outside to a pod.
Ingress Controller is a config file where you can write routing rules for multiple hosts. As you can have multiple apps running in a kubernetes cluster


Skaffold: 
It runs outside our cluster. Settings now directly applied to kubernetes either
Does 3 things.
1) When skaffold starts, apply the settings in the manifest folder
2) Watch manifest folder for any changes and apply them.
3) When skaffold stops, delete the objects associated with the files. (The Kubernetes objects)