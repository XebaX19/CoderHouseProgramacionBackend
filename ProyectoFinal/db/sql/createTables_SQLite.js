const dbconfig = require('../config');
const knex = require('knex')(dbconfig.sqlite);
const logger = require('../../logger/index');

(async () => {
    try {

        //Tabla productos
        let tableExist = await knex.schema.hasTable('productos');
        if (!tableExist) {
            await knex.schema.createTable('productos', (table) => {
                table.increments('id');
                table.timestamp('timestamp').defaultTo(knex.fn.now());
                table.string('nombre').notNullable();
                table.string('descripcion').notNullable();
                table.string('codigo').notNullable().unique();
                table.string('fotoUrl');
                table.decimal('precio', 13, 2).notNullable().unsigned();
                table.integer('stock').notNullable().unsigned();
            });
            logger.info('Tabla "productos" creada!');
        } else {
            logger.info('La tabla "productos" ya existe');
        }

        //Tabla carritos
        tableExist = await knex.schema.hasTable('carritos');
        if (!tableExist) {
            await knex.schema.createTable('carritos', (table) => {
                table.increments('id');
                table.timestamp('timestamp').defaultTo(knex.fn.now());
            });
            logger.info('Tabla "carritos" creada!');
        } else {
            logger.info('La tabla "carritos" ya existe');
        }

        //Tabla carrito_productos
        tableExist = await knex.schema.hasTable('carrito_productos');
        if (!tableExist) {
            await knex.schema.createTable('carrito_productos', (table) => {
                table.increments('id');
                table.integer('id_carrito').unsigned().references('id').inTable('carritos');
                table.integer('id_producto').unsigned().references('id').inTable('productos');
            });
            logger.info('Tabla "carrito_productos" creada!');
        } else {
            logger.info('La tabla "carrito_productos" ya existe');
        }
        
    } catch (error) {
        logger.error(error);
        throw error;
    }
    finally {
        //Finaliza la conexión con la BD
        knex.destroy();
    }
})();
