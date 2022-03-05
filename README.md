Services: 
NodePort is for connecting from outside , it assigns a random port which connects from outside.
Cluster Ip, is used to internal communication between pods in a cluster( basically in one machine)

<!-- Not sure -->
LoadBalancer service directs traffic from outside to a pod.
Ingress Controller is a config file where you can write routing rules for multiple hosts. As you can have multiple apps running in a kubernetes cluster