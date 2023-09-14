import fs from 'fs';
import path from 'path';
import { JsonSchemaUnifier } from '@lenra/json-schema-unifier';

const srcPath = path.resolve('src');
const distPath = path.resolve('dist');

// Boucler sur les fichiers du dossier src (en ignorant ceux qui commencent par un . et les dossiers)
const files = fs.readdirSync(srcPath).filter(file => !file.startsWith('.') && !fs.lstatSync(path.resolve(srcPath, file)).isDirectory());

if (!fs.existsSync(distPath)) {
    fs.mkdirSync(distPath);
}

// Pour chaque fichier, unifier les schema en un seul fichier
files.forEach(async file => {
    const filePath = path.resolve(srcPath, file);
    const distFilePath = path.resolve(distPath, file);
    const schema = await JsonSchemaUnifier.unify(filePath);
    fs.writeFileSync(distFilePath, JSON.stringify(schema, null, 2));
});