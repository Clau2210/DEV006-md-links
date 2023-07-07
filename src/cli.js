const { error } = require ('console');
const { mdLinks } = require ('./index.js');
const fs = require('fs');
const colors = {
    blue: "\x1b[38;5;38m",
    teal: "\x1b[38;5;69m",
    orange: "\x1b[38;5;215m",
    yellow: "\x1b[38;5;220m",
    red: "\x1b[38;5;160m",
    celest: "\x1b[38;5;158m",
    green: "\x1b[38;5;41m",
    white: "\x1b[38;5;231m",
    reset: "\x1b[0m", // Reset to default color
};

const pathArgument = process.argv[2];//.replace(/\\/g, '')
console.log(pathArgument);
const optionsArgument = process.argv[3] === 'true';
//const validateOption = process.argv.includes('--validate');
//const validateOption = process.argv.includes('--validate') ? process.argv[process.argv.indexOf('--validate') + 1] === 'true' : false;
//const statsOption = process.argv.includes('--stats');
const helpOption = process.argv.includes('--help');


if (helpOption) {
    console.log(`${colors.green}Escriba la ruta, luego escriba verdadero para validar los enlaces y falso para no hacerlo..${colors.reset}`);
} else if ((optionsArgument !== true && optionsArgument !== false) && (!pathArgument || !fs.existsSync(pathArgument))) {
    console.log(`${colors.red}La ruta u opción proporcionada no es válida, inténtelo de nuevo.${colors.reset}`);
} else if (optionsArgument !== true && optionsArgument !== false){
    console.log(`${colors.red}La ruta u opción proporcionada no es válida, inténtelo de nuevo.${colors.reset}`);
} else if (!pathArgument || !fs.existsSync(pathArgument)){
    console.log(`${colors.red}La ruta u opción proporcionada no es válida, inténtelo de nuevo.${colors.reset}`);
} else {    
    mdLinks(pathArgument, { validate : optionsArgument })
    .then((links) => {
        console.log(links);    
    })
    .catch((error) => {
        console.error(`${colors.red}Un error ha ocurrido: ${error.message}.${colors.reset}`);
    });
}
