# main.ts
## NestFactory
Bootstraps a Nest application by creating an application instance from the root module.
=> return  a promise resolving to the application instance.
**NestFactory.create** build an HTTP application;
**createMicroservice()** builds a microservice transport. global pipes, filters, interceptors, and guards are registered on the returned app instance before listen().
## WsAdapter
## GatewayModule