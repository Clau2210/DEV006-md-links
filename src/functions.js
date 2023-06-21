const path = require('path');
const fs = require('fs');
const { markAsUntransferable } = require('worker_threads');
const { JSDOM } = require('jsdom');
const MarkdownIt = require('markdown-it');

// Valida el archivo
const validateFile = (filePath => {
    if (fs.existsSync(filePath)) {
        console.log('El archivo existe:', filePath);
    } else {
        console.error('El archivo no existe:', filePath);
    }
});

// Valida si la ruta es absoluta o relativa, en el último caso, la convierte
const files = (filePath) => {
    const isAbsolute = path.isAbsolute(filePath);
    if (isAbsolute) {
        console.log('La ruta es absoluta.');
        console.log('Archivo a revisar:', filePath);
        console.log(filePath);
        validateFile(filePath);
    } else {
        console.log('La ruta es relativa.');
        const absolutePath = path.join(__dirname, filePath);
        console.log(absolutePath);
        console.log('Archivo a revisar:', filePath);
        validateFile(absolutePath);
    }
};

// Revisa si es un directorio, si es, despliega los archivos dentro
const readDirectory = (directoryPath) => {
    try {
        const files = fs.readdirSync(directoryPath);
        console.log('Archivos en el directorio:', files);
    } catch (error) {
        console.error('Error al leer el directorio', error);
    }
}

//Lee el archivo
const readTextFile = (filePath) => {
    const currentFilePath = __filename;
    const absolutePath = path.resolve(path.dirname(currentFilePath), filePath);
    console.log(absolutePath);
    fs.readFile(absolutePath, 'utf-8', (error, data) => {
        if (error) {
            console.error('Error al leer el archivo:', error);
        } else {
            console.log(data);
        }
    });
};

// Valida si la extensión es .md
const validateMd = (filePath) => {
    const extension = path.extname(filePath);
    console.log(extension);
    if (extension === '.md') {
        console.log('Es un archivo Markdown.');
    } else {
        console.log('No es un archivo Markdown');
    }
};

// Revisa si hay links dentro del archivo y los extrae 
const extractLinks = (filePath, fileName) => {
    fs.readFile(filePath, 'utf-8', (error, mdContent) => {
        if (error) {
            console.error('Error al leer el archivo:', error);
        } else {
            const allLinks = [];
            const mdRender = new MarkdownIt();
            const renderHtml = mdRender.render(mdContent);
            const dom = new JSDOM(renderHtml);
            const { document } = dom.window;
            const links = document.querySelectorAll('a');

            links.forEach((link) => {
                const href = link.getAttribute('href');
                const text = link.textContent.slice(0, 50);
                if (href.startsWith('https://') || href.startsWith('http://')) {
                    allLinks.push({ href, text, fileName });
                }
            });
            console.log(allLinks);
            //return allLinks;
        }

    });
};

// Verifica los links
const verifyLinks = (links) => {
    console.log(links);
    const arrayPromise = links.map((link) => {
        return new Promise((resolve, reject) => {
            fetch(link.href)
                .then((response) =>{
                    const result ={
                        Ruta:link.fileName,
                        Texto: link.text,
                        Link: link.href,
                        Codigo: response.status === 200 ? 200 : 404,
                        Estado: response.status === 200 ? 'OK' : 'FAIL',
                    };
                    resolve(result);
                })
                .catch((error) =>{
                    const result = {
                        Ruta: link.fileName,
                        Texto: link.text,
                        Link:link.href,
                        Codigo: error.name,
                        Estado: error.message, 
                    };
                    resolve(result);
                });
        });
    });
    return Promise.all(arrayPromise);
};

// const verifyLinks2 = (links) => {
//     if (!Array.isArray(links)) {
//         return Promise.reject(new Error('Invalid links array'));
//     }
//     return Promise.all(links.map((link) => fetch(link.href)
//         .then((response) => {
//             const result = {
//                 Ruta: link.file,
//                 Texto: link.text,
//                 Link: link.href,
//                 Codigo: response.status === 200 ? 200 : 404,
//                 Estado: response.status === 200 ? 'OK' : 'FAIL',
//             };
//             return result;
//             console.log(result);
//         })
//         .catch((error) => {
//             const result = {
//                 Ruta: link.file,
//                 Texto: link.text,
//                 Link: link.href,
//                 Codigo: error.name,
//                 Estado: error.message,
//             };
//             return result;
//             console.log(result);
//         })
//     )
//     );
// };

validateFile('C:/Users/cuc22/Documents/Laboratoria/MD-Links/DEV006-md-links/src/index.js');
files('C:/Users/cuc22/Documents/Laboratoria/MD-Links/DEV006-md-links/src/index.js');
files('index.js');
readTextFile('text.txt');
readTextFile('C:/Users/cuc22/Documents/Laboratoria/MD-Links/DEV006-md-links/src/prueba.md');
validateMd('C:/Users/cuc22/Documents/Laboratoria/MD-Links/DEV006-md-links/src/prueba.md');
readDirectory('./pruebas');
extractLinks('C:/Users/cuc22/Documents/Laboratoria/MD-Links/DEV006-md-links/src/pruebas/prueba2.md', 'C:/Users/cuc22/Documents/Laboratoria/MD-Links/DEV006-md-links/src/pruebas/prueba2.md')
// .then((links) => {
//     verifyLinks(links);
// })
// .then((results) => {
//     console.log(results);
// })
// .catch((error) => {
//     console.error(error)
// });
const arrayLinks = [{
    href: 'https://nodejs.org/es/',
    text: 'Node.js',
    fileName: 'C:/Users/cuc22/Documents/Laboratoria/MD-Links/DEV006-md-links/src/pruebas/prueba2.md'},
{
    href: 'https://developers.google.com/v8/',
    text: 'motor de JavaScript V8 de Chrome',
    fileName: 'C:/Users/cuc22/Documents/Laboratoria/MD-Links/DEV006-md-links/src/pruebas/prueba2.md'}
];

verifyLinks(arrayLinks)
  .then((results) => {
    console.log(results);
  })
  .catch((error) => {
    console.error(error);
  });

module.exports = {
            validateFile,
            readTextFile,
            files,
            validateMd,
            readDirectory,
            extractLinks,
        };