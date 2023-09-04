import { readFileSync, readdirSync } from 'fs';
import Ajv from "ajv"


const tests = readdirSync('test/cases').filter(f => f.endsWith('.txt'));

describe("Unify", () => {
    tests.forEach(test => {
        it(`should unify ${test}`, async () => {
            const file = readFileSync(`test/cases/${test}`, 'utf-8');
            
            const caseResult = JSON.parse(readFileSync(`test/cases/${test.replace('.txt', '.result.json')}`, 'utf-8'));
            expect(await result).toEqual(caseResult);
        });
    });
});
