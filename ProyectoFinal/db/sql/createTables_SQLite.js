const dbconfig = require('../config');
const knex = require('knex')(dbconfig.sqlite);
const logger = require('../../logger/index');

(async () => {
    try {

        //Tabla productos
        let tableExist = await knex.schema.hasTable('productos');
        if (!tableExist) {
            await knex.schema.createTable('productos', (table) => {
                table.increments('_id');
                table.timestamp('timestamp').defaultTo(knex.fn.now());
                table.string('nombre').notNullable();
                table.string('descripcion').notNullable();
                table.string('codigo').notNullable().unique();
                table.string('fotoUrl');
                table.decimal('precio', 13, 2).notNullable().unsigned();
                table.integer('stock').notNullable().unsigned();
                table.string('categoria');
            });
            logger.info('Tabla "productos" creada!');
        } else {
            logger.info('La tabla "productos" ya existe');
        }

        //Tabla carritos
        tableExist = await knex.schema.hasTable('carritos');
        if (!tableExist) {
            await knex.schema.createTable('carritos', (table) => {
                table.increments('_id');
                table.string('emailUsuario').notNullable();
                table.string('estado').notNullable();
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
                table.increments('_id');
                table.integer('id_carrito').unsigned().references('_id').inTable('carritos');
                table.integer('id_producto').unsigned().references('_id').inTable('productos');
            });
            logger.info('Tabla "carrito_productos" creada!');
        } else {
            logger.info('La tabla "carrito_productos" ya existe');
        }

        //Tabla mensajes
        tableExist = await knex.schema.hasTable('mensajes');
        if (!tableExist) {
            await knex.schema.createTable('mensajes', (table) => {
                table.increments('_id');
                table.string('emailUsuario').notNullable();
                table.string('mensaje');
                table.string('tipo').notNullable();
                table.timestamp('timestamp').defaultTo(knex.fn.now());
            });
            logger.info('Tabla "mensajes" creada!');
        } else {
            logger.info('La tabla "mensajes" ya existe');
        }

        //Tabla usuarios
        tableExist = await knex.schema.hasTable('usuarios');
        if (!tableExist) {
            await knex.schema.createTable('usuarios', (table) => {
                table.increments('_id');
                table.string('email').notNullable().unique();
                table.string('password').notNullable();
                table.string('nombre').notNullable();
                table.string('direccion');
                table.integer('edad');
                table.string('nroTelefono');
                table.string('avatar');
                table.timestamp('timestamp').defaultTo(knex.fn.now());
            });
            logger.info('Tabla "usuarios" creada!');
        } else {
            logger.info('La tabla "usuarios" ya existe');
        }

        //Tabla ordenes
        tableExist = await knex.schema.hasTable('ordenes');
        if (!tableExist) {
            await knex.schema.createTable('ordenes', (table) => {
                table.increments('_id');
                table.string('emailUsuario').notNullable();
                table.timestamp('timestamp').defaultTo(knex.fn.now());
            });
            logger.info('Tabla "ordenes" creada!');
        } else {
            logger.info('La tabla "ordenes" ya existe');
        }

        //Tabla ordenes_productos
        tableExist = await knex.schema.hasTable('ordenes_productos');
        if (!tableExist) {
            await knex.schema.createTable('ordenes_productos', (table) => {
                table.increments('_id');
                table.integer('id_orden').unsigned().references('_id').inTable('ordenes');
                table.integer('id_producto').unsigned().references('_id').inTable('productos');
                table.string('descripcion');
                table.decimal('precio', 13, 2).notNullable().unsigned();
                table.integer('cantidad').notNullable();
            });
            logger.info('Tabla "ordenes_productos" creada!');
        } else {
            logger.info('La tabla "ordenes_productos" ya existe');
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