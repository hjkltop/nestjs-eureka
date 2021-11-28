
[![pipeline status](https://gitlab.com/fboisselier52/nestjs-eureka/badges/master/pipeline.svg)](https://gitlab.com/fboisselier52/nestjs-eureka/commits/master)

`nests-eureka` is a [NestJS](https://nestjs.com/) module that provides an integration with [eureka-js-client](https://github.com/jquatier/eureka-js-client#eureka-js-client)

## Getting Started

You need to import the `EurekaModule` in your application:

```js
EurekaModule.forRoot({
    eureka: {
      host: 'eureka-service',
      port: 8761,
      registryFetchInterval: 1000,
      servicePath: '/eureka/apps/',
      maxRetries: 3,
    },
    service: {
      name: 'my-service',
      port: 8080,
    },
}),
```

## Run Tests

```
npm run test
docker pull springcloud/eureka
docker run --rm -p 8761:8761 springcloud/eureka
npm run test:e2e
```
