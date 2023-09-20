import fs from 'fs';
import path from 'path';
import { JsonSchemaUnifier } from '@lenra/json-schema-unifier';
import * as YAML from 'yaml';

const srcPath = path.resolve('src');
const distPath = path.resolve('dist');

// Boucler sur les fichiers du dossier src (en ignorant ceux qui commencent par un . et les dossiers)
const files = getFiles(srcPath);

if (!fs.existsSync(distPath)) {
    fs.mkdirSync(distPath);
}

// Pour chaque fichier, unifier les schema en un seul fichier
files.forEach(async filePath => {
    const isApi = filePath.endsWith('-api.yml');
    let distFilePath = filePath.replace(srcPath, distPath);
    if (isApi) {
        distFilePath = distFilePath.replace(/\.yml$/, ".schema.json");
    }
    const schema = await JsonSchemaUnifier.unify(
        filePath,
        {
            definitionsPath: isApi ? "components/schemas" : "definitions",
            definitionsPathSeparator: "."
        }
    );
    const distDirPath = path.dirname(distFilePath);
    if (!fs.existsSync(distDirPath)) {
        fs.mkdirSync(distDirPath, { recursive: true });
    }
    fs.writeFileSync(
        distFilePath,
        isApi ? YAML.stringify(schema) : JSON.stringify(schema, null, 2)
    );
});

function getFiles(dirPath, ignore = true) {
    let files = fs.readdirSync(dirPath);
    if (ignore) {
        files = files.filter(file => !file.startsWith('.'));
    }
    return files.flatMap(file => {
        const filePath = path.resolve(dirPath, file);
        const stat = fs.lstatSync(filePath);
        if (stat.isDirectory()) {
            return getFiles(filePath);
        } else {
            return [filePath];
        }
    });
}