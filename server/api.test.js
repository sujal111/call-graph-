const request = require("supertest");
const app = require("./index");
const fs = require("fs");
const path = require("path");

describe('API Endpoints', () => {

    beforeEach(() => {
        const testFilePath = path.join(__dirname, 'api.test.js');
        if (fs.existsSync(testFilePath)) {
            fs.unlinkSync(testFilePath);
        }
    });

    it('POST /api/analyze - should analyze code and return call graph', async () => {
        const response = await request(app)
            .post('/api/analyze')
            .send({ filePath: "/path/to/your/codebase" });
        
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('callGraph');
        expect(response.body.message).toMatch(/Test cases generated and saved to/);
        
        // Check if the test file was created
        const testFilePath = path.join(__dirname, 'api.test.js');
        expect(fs.existsSync(testFilePath)).toBe(true);
        
        // Optionally, you can also read and check the contents of the test file
        const testFileContent = fs.readFileSync(testFilePath, 'utf8');
        expect(testFileContent).toContain('describe');
        expect(testFileContent).toContain('it');
    });

    it('POST /api/analyze - should return 400 for invalid file path', async () => {
        const response = await request(app)
            .post('/api/analyze')
            .send({ filePath: "/invalid/path" });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error');
    });
});
