function mdLinks(path, options){
    const result = new Promise(function(resolve, reject) {
        resolve(path)
    });
    return result;
}

const path = 'C:/Users/cuc22/Documents/Laboratoria/MD-Links/DEV006-md-links/src/pruebas/prueba2.md'
const options = {validate: false};
const resultFunction = mdLinks(path, options)
console.log(resultFunction);
resultFunction.then(
    function (result){console.log(result, 'then:')}
).catch(
    function (error){console.log(error)}
)