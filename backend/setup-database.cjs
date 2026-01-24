/**
 * Script para configurar la base de datos MySQL
 * Ejecuta el schema SQL y crea todas las tablas necesarias
 */

const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env.local') });

const config = {
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  multipleStatements: true, // Permite ejecutar múltiples queries
};

async function setupDatabase() {
  let connection;
  
  try {
    console.log('🔄 Intentando conectar a MySQL...');
    console.log(`📍 Host: ${config.host}`);
    console.log(`👤 Usuario: ${config.user}`);
    console.log(`🗄️  Base de datos: ${config.database}`);
    console.log('');

    // Conectar a MySQL
    connection = await mysql.createConnection(config);
    console.log('✅ Conexión exitosa a MySQL');
    console.log('');

    // Leer el archivo SQL
    const sqlPath = path.join(__dirname, 'database-schema.sql');
    console.log('📖 Leyendo schema SQL...');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');

    // Ejecutar el schema
    console.log('🚀 Ejecutando schema SQL...');
    console.log('⏳ Esto puede tomar unos segundos...');
    console.log('');
    
    await connection.query(sqlContent);
    
    console.log('✅ Schema ejecutado exitosamente');
    console.log('');
    console.log('📊 Verificando tablas creadas...');
    
    // Verificar tablas creadas
    const [tables] = await connection.query('SHOW TABLES');
    console.log(`✅ Total de tablas: ${tables.length}`);
    console.log('');
    console.log('📋 Tablas creadas:');
    tables.forEach((table, index) => {
      const tableName = Object.values(table)[0];
      console.log(`   ${index + 1}. ${tableName}`);
    });
    
    console.log('');
    console.log('🎉 ¡Base de datos configurada exitosamente!');
    console.log('');
    console.log('📝 Notas importantes:');
    console.log('   - Usuario admin creado (cambiar contraseña después)');
    console.log('   - 10 servicios predefinidos agregados');
    console.log('   - Configuraciones del sistema inicializadas');
    console.log('');

  } catch (error) {
    console.error('');
    console.error('❌ ERROR al configurar la base de datos:');
    console.error('');
    
    if (error.code === 'ENOTFOUND') {
      console.error('🌐 No se puede resolver el hostname:', config.host);
      console.error('   Verifica que el dominio sea correcto');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('🔌 Conexión rechazada al servidor MySQL');
      console.error('   Verifica que MySQL esté corriendo en el puerto', config.port);
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('🔐 Acceso denegado');
      console.error('   Verifica usuario y contraseña');
      console.error('   Usuario:', config.user);
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.error('🗄️  Base de datos no existe');
      console.error('   Crea la base de datos', config.database, 'en cPanel primero');
    } else if (error.errno === 1045) {
      console.error('🔐 Usuario o contraseña incorrectos');
      console.error('   Verifica las credenciales en .env.local');
    } else if (error.errno === 2003) {
      console.error('🌐 No se puede conectar al servidor');
      console.error('   Posibles causas:');
      console.error('   1. Tu IP no está autorizada en cPanel > Remote MySQL');
      console.error('   2. El firewall está bloqueando el puerto 3306');
      console.error('   3. MySQL no acepta conexiones remotas');
    } else {
      console.error('Código de error:', error.code || error.errno);
      console.error('Mensaje:', error.message);
    }
    
    console.error('');
    process.exit(1);
    
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Ejecutar
console.log('');
console.log('═══════════════════════════════════════════════════');
console.log('  🔧 CONFIGURACIÓN DE BASE DE DATOS - SAG GARAGE');
console.log('═══════════════════════════════════════════════════');
console.log('');

setupDatabase();
