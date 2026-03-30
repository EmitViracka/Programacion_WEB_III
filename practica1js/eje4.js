//4. Crear una función que reciba un arreglo de números
// y devuelva el número mayor y elmenor, en un objeto.
function miFuncion(arreglo){
    let obj = {mayor: arreglo[0], menor: arreglo[0]};
    for (let i= 1 ; i < arreglo.length; i++){
        if (arreglo[i] > obj.mayor){
            obj.mayor = arreglo[i];
        }
        if (arreglo[i] < obj.menor){
            obj.menor = arreglo[i];
        }
    } 
    return obj;
}
let obj = miFuncion([3,1,5,4,2])
console.log(obj) 
