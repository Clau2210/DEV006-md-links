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
        if (validateFile(resolveIsAbsolute)){
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
                        }
                    })
                    .catch(reject)
                    );
                    Promise.all(promises)
                    .then ((results) =>{
                        const flatAllResults = results.flat();
                        resolve(flatAllResults);
                    })
                    .catch (reject);
                })
                .catch (reject);
            } else if (isAFile(resolveIsAbsolute)){
                const resultIsMd = validateMd(resolveIsAbsolute);
                if(resultIsMd === false){
                    reject('Error: No es un archivo .md');
                    return;
                }
                readTextFile(resolveIsAbsolute)
                .then((result) => {
                    const extract = extractLinks(result, resolveIsAbsolute);
                    if (options.validate === false){
                        resolve(extract);
                    }    else{
                        verifyLinks(extract)
                        .then((results) =>{
                            resolve(results)
                        })
                            .catch(reject);
                            }
                        })
                        .catch(reject);
                    }               
            }
            else{
                reject('La ruta no existe');
            }
    });
}
//const path = ('../src/pruebas/prueba1.md');
//const path = ('../src/pruebas/text.txt');
const path = ('../src/pruebas/');
const options = {validate: false};
const resultFunction = mdLinks(path, options);
resultFunction
.then(function (result) {
    console.log(result)
    return result;
})
.catch(
    function (error) {
    //console.error(error)
});

module.exports = {
    mdLinks,
};