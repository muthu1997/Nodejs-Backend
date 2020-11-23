import express from 'express';
import passport from 'passport';
import cors from 'cors'
import compression from 'compression'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import { errorHandler as queryErrorHandler } from 'querymen'
import { errorHandler as bodyErrorHandler } from 'bodymen'
import { env } from '../../config'
import path from 'path';
const swaggerJsonDoc = require('swagger-jsdoc')
const swaggerUI = require('swagger-ui-express')

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: "Documenting REST API's",
      description: "This is an implementation of how to document your RESTful API's using SWAGGER",
    },
    securityDefinitions: {
      JWT: {
        type: "apiKey",
        name: "Authorization",
        in: "header",
      }
    }
  },
  apis: [path.resolve(__dirname, '../../../src/api/questions/index.js'), path.resolve(__dirname, '../../api/users/index.js'), path.resolve(__dirname, '../../api/tests/index.js')]

}
export default (routes) => {
  const app = express();
  const swaggerDocs = swaggerJsonDoc(swaggerOptions)
  app.use('/api/swagger', swaggerUI.serve, swaggerUI.setup(swaggerDocs))
  console.log(path.resolve(__dirname, '../../../src/api/questions/index.js'))
  console.log(swaggerDocs)
  /* istanbul ignore next */
  if (env === 'production' || env === 'development') {
    app.use(cors())
    app.use(compression())
    app.use(morgan('dev'))
    app.set('trust proxy', 1) // trust first proxy
  }
  app.use(cors())
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(passport.initialize());
  app.use('/api', routes);
  app.use(queryErrorHandler())
  app.use(bodyErrorHandler())
  app.use('/api/assets', express.static(path.resolve(__dirname, '../../../assets')));

  app.set('case sensitive routin', true);
  return app
}
