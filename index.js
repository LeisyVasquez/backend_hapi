const Hapi = require('@hapi/hapi')
const { pool } = require('./config/db')
const HapiSwagger = require('hapi-swagger')
const Inert = require('@hapi/inert')
const Vision = require('@hapi/vision')
const Package = require('./package.json')
const Joi = require('joi')

const init = async () => {
  const server = Hapi.server({
    port: 3000,
    host: 'localhost'
    //línea cors, y otras config que se puedan poner acá
  })

  //Poner API al principio

  const swaggerOptions = {
    info: {
      title: "API REST ACADEMIA",
      description:
        "Esta es la documentación de la API academia, creada en la sesión de clase Backend para demostrar el uso de swagger",
      contect: {
        name: "Ingrid Argote",
        email: "ingridloargote@gmail.com",
      },
      servers: ["http://localhost:3000"],
      version: '0.0.1'
    },
  }

  await server.register([
    Inert,
    Vision,
    {
      plugin: HapiSwagger,
      option: swaggerOptions
    }
  ])

  server.route([
    {
      method: 'GET',
      path: '/',
      handler: (request, h) => {
        return 'Hola mundo'
      }
    },
    {
      method: 'GET',
      path: '/saludo/{nombre}',
      handler: (request, h) => {
        return `Hola ${request.params.nombre}`
      }
    },
    {
      method: 'GET',
      path: '/actor',
      handler: async (request, h) => {
        let cliente = await pool.connect()
        const { user, password } = request.query
        try {
          let result = await cliente.query(
            `SELECT * FROM actores WHERE contrasena = $1 AND correo = $2`,
            [password, user]
          )
          return result.rows
        } catch (err) {
          console.log({ err })
          return h.code(500).response({ error: 'Internal error server' })
        } finally {
          cliente.release(true)
        }
      }, 
      options: {
          description: 'Obtener actores por su id', 
          notes: 'Returns a todo item by the id passed in the path',
          tags: ['api','Actores']
      }
    }
  ])

  await server.start()
  console.log('Server running on port 3000')
}

init()
