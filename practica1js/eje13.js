//13. Proporcione un ejemplo concreto donde el anidamiento 
// de promesas se puede reescribir mejor con async/await 
// haciendo el código más limpio y mantenible.
const conectar = () => Promise.resolve("Conectado");
const verificarCarga = () => Promise.resolve("Batería al 100%");
const encender = () => Promise.resolve("Encendido");
/*
conectar().then(res1 => {
    console.log(res1);
    verificarCarga().then(res2 => {
        console.log(res2);
        
        encender().then(res3 => {
            console.log(res3);
            console.log("Carga completa");
        });
    });
});*/

async function iniciarCelular() {
    try {
        console.log("Comenzando a cargar...");
        
        const res1 = await conectar();
        console.log(res1);

        const res2 = await verificarCarga();
        console.log(res2);

        const res3 = await encender();
        console.log(res3);

        console.log("Carga completa");

    } catch (error) {
        console.error("No se ha completado la carga", error);
    }
}
iniciarCelular();
