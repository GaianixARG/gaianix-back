import swaggerUi from 'swagger-ui-express'
import swaggerJsdoc from 'swagger-jsdoc'
import { Express } from 'express'
import { config } from './env'
import { SwaggerSchemasOrder } from '../schemas/order.schema'
import { SwaggerSchemasSeed } from '../schemas/seed.schema'

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Gaianix API',
      version: '1.0.0'
    },
    servers: [
      {
        url: `http://localhost:${config.port}/api`,
        description: 'Servidor local'
      }
    ],
    components: {
      schemas: {
        ...SwaggerSchemasOrder,
        ...SwaggerSchemasSeed
      }
    }
  },
  apis: ['./src/routes/*.ts']
}

const swaggerSpec = swaggerJsdoc(options)

export const setupSwagger = (app: Express): void => {
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
}
