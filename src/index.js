const   { 
    isAbsolute,
    absolutePath,
    validateFile,
    extractLinks, 
    validateMd,
    isAFile,
    isADirectory,
    readDirectory,
    verifyLinks,
    readTextFile
        } = require("./functions");
    const axios = require('axios');

function mdLinks(path,options){
    return new Promise(function (resolve, reject){
        const resolveIsAbsolute = isAbsolute(path) ? path : absolutePath(path);
        console.log(resolveIsAbsolute,'absolute');
        if (validateFile(resolveIsAbsolute)){
            //console.log(validateFile,'validatefile');
            if (isAFile(resolveIsAbsolute)){
                console.log('Is a file');
                const resultIsMd = validateMd(resolveIsAbsolute);
                console.log(resultIsMd, 'Este One');
                if(resultIsMd === false){
                    reject('Error: No es un archivo .md');
                    return;
                }
                readTextFile(resolveIsAbsolute)
                //console.log(readTextFile,'result de readtextfile')
                .then((result) => {
                    console.log(result,'result');
                    const extract = extractLinks(result, resolveIsAbsolute);
                    console.log(extract, 'Extracto de liiiinks');
                    if (options.validate === false){
                        resolve(extract);
                        //return extract;
                    }    else{
                        //resolve(verifyLinks(extract))
                        verifyLinks(extract)
                        //return verifyLinks(extract);
                   
                        .then((results) =>{
                            resolve(results)
                        })
                            .catch(reject);
                            }
                        })
                        .catch(reject);
                    }
                    
                            //  const errors = results.filter((result) => result.Codigo !== 200);
                            //  if (errors.length > 0) {
                            //      console.log('Los siguientes enlaces son los inválidos:');
                            //      errors.forEach((error) => {
                            //          console.log(`- Ruta: ${error.Ruta}`);
                            //          console.log(`  Texto: ${error.Texto}`);
                            //          console.log(`  Enlace: ${error.Link}`);
                            //          console.log(`  Código: ${error.Codigo}`);
                            //          console.log(`  Estado: ${error.Estado}`);
                //                  });
                //              }
                //              resolve(errors);
                //          })
                //          .catch(reject);
                //     }
                // })
                // .catch(reject);
                // }

                if (isADirectory(resolveIsAbsolute)){
                    readDirectory(resolveIsAbsolute)
                    .then((result)=>{
                        const promises = result.map((link) =>
                        readTextFile(link).then((result)=>{
                            const extract = extractLinks(result, link);
                            if (options.validate === false){
                                return extract;
                                
                            } else {
                                return verifyLinks(extract);
                                console.log((verifyLinks(extract)), 'verifylinks');
                            }
                        })
                        .catch(reject)
                        );
                        Promise.all(promises)
                        .then ((results) =>{
                            const flatAllResults = results.flat();
                            resolve(flatAllResults);
                            console.log(flatAllResults, 'Total de links del directorio');
                        })
                        .catch (reject);
                    })
                    .catch (reject);
                }
            }
            else{
                reject('La ruta no existe');
            }
    });
}
const path = ('../src/pruebas/prueba1.md');
//const path = ('../src/pruebas/text.txt');
//const path = ('../src/pruebas/');
const options = {validate: true};
const resultFunction = mdLinks(path, options);
//console.log(resultFunction, '¡Resultado de la función mdLinks!');
resultFunction
.then(function (result) {
    console.log(result, 'Es este...')
    return result;
})
.catch(
    function (error) {
    console.log(error)
});

module.exports = {
    mdLinks,
};