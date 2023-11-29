const tipo = 'tipo6';
const tipos = ['tipo1', 'tipo2', 'tipo3', 'tipo4', 'tipo5'];

let tipoExiste = false;

tipos.forEach(item => {
  if (item === tipo) {
    tipoExiste = true;
  }
});

if (tipoExiste) {
  console.log('Já existe');
} else {
  console.log('Ainda não existe');
}
