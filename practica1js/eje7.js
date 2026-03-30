//7. Almacenar el resto de los elementos de un arreglo 
// sin tomar en cuenta los dos primeros elementos de un arreglo, 
// mediante desestructuración.
const arreglo = [1, 2, 3, 4, 5];
const [ , , ...resto] = arreglo;
console.log(resto); 
