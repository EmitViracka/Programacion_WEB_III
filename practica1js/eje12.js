/*12. Proporcione un ejemplo concreto donde el anidamiento 
// de callbacks se puede reescribir mejor con async/await 
// haciendo el código más limpio y mantenible.
function prepararMasa(callback) {
    setTimeout(() => {
        console.log("1. Masa lista");
        callback();
    }, 2000);
}

function ponerSalsa(callback) {
    setTimeout(() => {
        console.log("2. Salsa lista");
        callback();
    }, 2000);
}

function ponerQueso(callback) {
    setTimeout(() => {
        console.log("3. Queso listo");
        callback();
    }, 2000);
}

prepararMasa(() => {
    ponerSalsa(() => {
        ponerQueso(() => {
            console.log("La Pizza esta lista");
        });
    });
});
*/


const prepararMasaPro = () => new Promise(res => setTimeout(() => { 
    console.log("1. Masa lista"); res(); 
}, 2000));

const ponerSalsaPro = () => new Promise(res => setTimeout(() => { 
    console.log("2. Salsa lista"); res(); 
}, 2000));

const ponerQuesoPro = () => new Promise(res => setTimeout(() => { 
    console.log("3. Queso listo"); res(); 
}, 2000));
async function cocinarPizza() {
    try {
        console.log("Preparando...");
        
        await prepararMasaPro(); 
        await ponerSalsaPro();   
        await ponerQuesoPro();   
        console.log("Pizza lista");
    } catch (error) {
        console.log("Aun no esta lista", error);
    }
}

cocinarPizza(); 