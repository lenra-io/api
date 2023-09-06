import { readFileSync, readdirSync } from 'fs';
import YAML from 'yaml';
import { JsonSchemaUnifier } from '@lenra/json-schema-unifier';
import { resolve } from 'path';
import Ajv from 'ajv';

const ajv = new Ajv();
const compiledSchemata = {};
const tests = readdirSync('cases').filter(f => f.endsWith('.yml'));

describe("Unify", () => {
    tests.forEach(testCase => {
        it(`Validate ${testCase}`, async () => {
            const test = YAML.parse(readFileSync(`cases/${testCase}`, 'utf-8'));
            const schemaPromise = getSchema(resolve("../src", test.schema));
            const content = JSON.parse(readFileSync(`cases/${testCase.replace(/yml$/, "content.json")}`, 'utf-8'));

            const unifiedSchema = await schemaPromise;

            const validate = ajv.compile(unifiedSchema);
            const valid = validate(content);
            expect(YAML.stringify(validate.errors)).toEqual(YAML.stringify(test.errors));
            expect(valid).toEqual(test.valid);
        });
    });
});


async function getSchema(schemaPath) {
    if (compiledSchemata[schemaPath]) {
        return compiledSchemata[schemaPath];
    }
    const schema = await JsonSchemaUnifier.unify(schemaPath);
    compiledSchemata[schemaPath] = schema;
    return schema;
}