#!/usr/bin/env node

require('dotenv').config({ path: '.env.local' });
const mysql = require('mysql2/promise');

const baseConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT || '3306'),
  connectTimeout: 10000
};

// Lista de hostnames posibles para probar
const possibleHosts = [
  'saggarage.com.mx',                    // Dominio principal
  'www.saggarage.com.mx',                // Con www
  'mysql.saggarage.com.mx',              // Subdominio mysql común
  'db.saggarage.com.mx',                 // Subdominio db común
  'server.saggarage.com.mx',             // Subdominio server
  'saggarage.com.mx:3306',               // Con puerto explícito
];

console.log('\n═══════════════════════════════════════════════════');
console.log('  🔍 PROBANDO HOSTNAMES DE MYSQL REMOTO');
console.log('═══════════════════════════════════════════════════\n');
console.log(`👤 Usuario: ${baseConfig.user}`);
console.log(`🗄️  Base de datos: ${baseConfig.database}`);
console.log(`🔌 Puerto: ${baseConfig.port}\n`);

async function testHost(host) {
  const config = { ...baseConfig, host };
  
  console.log(`\n🔄 Probando: ${host}`);
  console.log('─'.repeat(50));
  
  try {
    const connection = await mysql.createConnection(config);
    
    // Probar una query simple
    const [rows] = await connection.execute('SELECT 1 as test');
    
    await connection.end();
    
    console.log('✅ ¡CONEXIÓN EXITOSA!');
    console.log(`   └─ Hostname funcional: ${host}`);
    return { success: true, host };
    
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.log('❌ Conexión rechazada');
      console.log('   └─ El servidor no acepta conexiones en este host');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('⚠️  Acceso denegado (pero el host es válido)');
      console.log('   └─ El hostname es correcto pero hay problema de permisos');
      return { success: false, host, validHost: true };
    } else if (error.code === 'ENOTFOUND') {
      console.log('❌ Host no encontrado (DNS)');
      console.log('   └─ Este hostname no existe');
    } else if (error.code === 'ETIMEDOUT') {
      console.log('❌ Timeout');
      console.log('   └─ El servidor no responde (firewall bloqueado?)');
    } else {
      console.log(`❌ Error: ${error.code || error.message}`);
    }
    
    return { success: false, host };
  }
}

async function findWorkingHost() {
  console.log('Probando ' + possibleHosts.length + ' hostnames posibles...\n');
  
  const results = [];
  
  for (const host of possibleHosts) {
    const result = await testHost(host);
    results.push(result);
    
    if (result.success) {
      console.log('\n');
      console.log('═'.repeat(50));
      console.log('  🎉 ¡HOSTNAME ENCONTRADO!');
      console.log('═'.repeat(50));
      console.log(`\n✅ Usa este hostname: ${result.host}\n`);
      console.log('📝 Actualiza tu .env.local con:');
      console.log(`   DB_HOST=${result.host}\n`);
      return;
    }
    
    // Pequeña pausa entre intentos
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log('\n');
  console.log('═'.repeat(50));
  console.log('  ⚠️  NO SE ENCONTRÓ UN HOSTNAME FUNCIONAL');
  console.log('═'.repeat(50));
  console.log('\n📋 Posibles soluciones:\n');
  console.log('1. Contacta a tu proveedor de hosting y pregunta:');
  console.log('   "¿Cuál es el hostname para conexiones MySQL remotas?"');
  console.log('\n2. Verifica en cPanel si hay información sobre:');
  console.log('   - Remote MySQL Host');
  console.log('   - MySQL Server Address');
  console.log('\n3. Por mientras, usa phpMyAdmin desde cPanel para:');
  console.log('   - Crear las tablas ejecutando database-schema.sql');
  console.log('   - Administrar la base de datos');
  console.log('\n4. Una vez en producción (código en el servidor):');
  console.log('   - Usa DB_HOST=localhost (funcionará sin problemas)');
  
  // Ver si alguno tuvo acceso denegado (significa que el host es válido)
  const validHosts = results.filter(r => r.validHost);
  if (validHosts.length > 0) {
    console.log('\n⚠️  NOTA: Estos hosts son válidos pero tienen problema de permisos:');
    validHosts.forEach(r => console.log(`   - ${r.host}`));
    console.log('\n   Posibles causas:');
    console.log('   - Tu IP no está autorizada en Remote MySQL');
    console.log('   - El usuario no tiene permisos para conexión remota');
    console.log('   - El usuario solo puede conectarse desde localhost');
  }
}

findWorkingHost().catch(error => {
  console.error('\n❌ Error fatal:', error.message);
  process.exit(1);
});
