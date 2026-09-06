// Configuración global para los tests
process.env.NODE_ENV = 'test';

// Limpiar la base de datos antes de cada test
beforeAll(async () => {
  // Aquí puedes agregar lógica de limpieza de BD si la necesitas
  console.log('🔧 Configurando entorno de pruebas...');
});

afterAll(async () => {
  console.log('✅ Pruebas finalizadas');
});
