
[![pipeline status](https://gitlab.com/fboisselier52/nestjs-eureka/badges/master/pipeline.svg)](https://gitlab.com/fboisselier52/nestjs-eureka/commits/master)

`nests-eureka` is a [NestJS](https://nestjs.com/) module that provides an integration with [eureka-js-client](https://github.com/jquatier/eureka-js-client#eureka-js-client)


## Run Tests

```
npm run test
docker pull springcloud/eureka
docker run --rm -p 8761:8761 springcloud/eureka
npm run test:e2e 
```