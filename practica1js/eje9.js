//79. Crear una promesa que devuelva un mensaje de éxito 
// después de 3 segundos.
const esperar = () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve("Éxito!!! Pasaron 3 segundos");
        }, 3000);
    });
    
};
esperar().then(console.log)
