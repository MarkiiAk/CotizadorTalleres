const bcrypt = require('bcryptjs');

// Contraseña a hashear
const password = '050899';

// Generar hash con bcrypt (cost 10)
const hash = bcrypt.hashSync(password, 10);

console.log('\n===========================================');
console.log('GENERADOR DE HASH DE CONTRASEÑA');
console.log('===========================================\n');
console.log('Contraseña:', password);
console.log('Hash generado:');
console.log(hash);
console.log('\n===========================================\n');
console.log('INSERT SQL:');
console.log(`INSERT INTO usuarios (username, password_hash, nombre_completo, email, rol, activo)`);
console.log(`VALUES ('saggarage', '${hash}', 'SAG Garage Usuario', 'saggarage@saggarage.com', 'admin', 1);`);
console.log('\n===========================================\n');

// Verificar que el hash funciona
if (bcrypt.compareSync(password, hash)) {
    console.log('✅ Verificación: El hash es válido\n');
} else {
    console.log('❌ Error: El hash NO es válido\n');
}