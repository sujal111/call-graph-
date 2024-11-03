// const fs = require('fs');
// const path = require('path');

// /**
//  * Parses the codebase at the given path to generate call graph data.
//  * @param {string} filePath - Path to the directory containing the codebase.
//  * @returns {string} - Mermaid-formatted call graph data.
//  */
// const parseCodeAndGenerateCallGraph = (filePath) => {
//     const callGraph = [];

//     // Read all files in the directory
//     const codeFiles = fs.readdirSync(filePath);
//     codeFiles.forEach(file => {
//         const fullPath = path.join(filePath, file);
//         const stats = fs.statSync(fullPath);

//         // Check if the current item is a file
//         if (stats.isFile()) {
//             const fileContent = fs.readFileSync(fullPath, 'utf8');

//             // Parse fileContent to detect functions and calls
//             const functionNames = detectFunctions(fileContent);
//             const callDependencies = detectFunctionCalls(fileContent, functionNames);

//             callGraph.push(...callDependencies);
//         } else {
//             console.log(`${fullPath} is not a file and will be skipped.`);
//         }
//     });

//     // Convert callGraph array to Mermaid format
//     const mermaidGraph = generateMermaidGraph(callGraph);
//     return mermaidGraph;
// };

// /**
//  * Detects functions in the provided file content.
//  * @param {string} content - The content of a file.
//  * @returns {string[]} - List of detected function names.
//  */
// const detectFunctions = (content) => {
//     // Mock logic - Replace with actual logic to detect functions
//     return ['functionA', 'functionB'];
// };

// /**
//  * Detects function calls in the provided file content.
//  * @param {string} content - The content of a file.
//  * @param {string[]} functionNames - List of functions in the file.
//  * @returns {Object[]} - List of call dependencies (from-to relationships).
//  */
// const detectFunctionCalls = (content, functionNames) => {
//     // Mock logic - Replace with actual logic to detect function calls
//     return [
//         { from: 'functionA', to: 'functionB' },
//         { from: 'functionB', to: 'functionC' }
//     ];
// };

// /**
//  * Converts call dependencies into a Mermaid-formatted graph.
//  * @param {Object[]} callGraph - Array of call dependencies.
//  * @returns {string} - Mermaid-formatted graph data.
//  */
// const generateMermaidGraph = (callGraph) => {
//     let mermaidData = 'graph TD;\n';
//     callGraph.forEach(call => {
//         mermaidData += `${call.from} --> ${call.to};\n`;
//     });
//     return mermaidData;
// };

// module.exports = { parseCodeAndGenerateCallGraph };






const fs = require('fs');
const path = require('path');

/**
 * Parses the codebase at the given path to generate call graph data.
 * @param {string} filePath - Path to the directory containing the codebase.
 * @returns {string} - Mermaid-formatted call graph data and Jest test cases.
 */
const parseCodeAndGenerateCallGraph = (filePath) => {
    const callGraph = [];
    const routes = [];

    // Read all files in the directory
    const codeFiles = fs.readdirSync(filePath);
    codeFiles.forEach(file => {
        const fullPath = path.join(filePath, file);
        const stats = fs.statSync(fullPath);

        // Check if the current item is a file
        if (stats.isFile()) {
            const fileContent = fs.readFileSync(fullPath, 'utf8');

            // Parse fileContent to detect functions and calls
            const functionNames = detectFunctions(fileContent);
            const callDependencies = detectFunctionCalls(fileContent, functionNames);
            callGraph.push(...callDependencies);

            // Detect API routes
            const apiRoutes = detectApiRoutes(fileContent, fullPath);
            routes.push(...apiRoutes);
        } else {
            console.log(`${fullPath} is not a file and will be skipped.`);
        }
    });

    // Convert callGraph array to Mermaid format
    const mermaidGraph = generateMermaidGraph(callGraph);
    const testCases = generateTestCases(routes);
    return { mermaidGraph, testCases };
};

/**
 * Detects API routes in the provided file content.
 * @param {string} content - The content of a file.
 * @param {string} filePath - Path to the file.
 * @returns {Array} - List of detected API routes.
 */
const detectApiRoutes = (content, filePath) => {
    const routeRegex = /app\.(get|post|put|delete|patch)\s*\(\s*['"]([^'"]+)['"]\s*,/g;
    const routes = [];
    let match;

    while ((match = routeRegex.exec(content)) !== null) {
        routes.push({
            method: match[1],
            path: match[2],
            file: filePath,
        });
    }

    return routes;
};

/**
 * Generates Jest-style test cases based on detected API routes.
 * @param {Array} routes - List of detected API routes.
 * @returns {string} - Generated Jest test cases as a string.
 */
const generateTestCases = (routes) => {
    let testCases = 'const request = require("supertest");\n';
    testCases += 'const app = require("./index");\n\n'; // Assuming the app is exported from index.js

    routes.forEach(route => {
        testCases += `describe('API ${route.method.toUpperCase()} ${route.path}', () => {\n`;
        testCases += `    it('should respond with JSON', async () => {\n`;
        testCases += `        const response = await request(app).${route.method}('${route.path}').send({});\n`; // Adjust send data as needed
        testCases += `        expect(response.status).toBe(200);\n`;
        testCases += `        expect(response.headers['content-type']).toMatch(/json/);\n`;
        testCases += `    });\n`;
        testCases += `});\n\n`;
    });

    return testCases;
};

/**
 * Detects functions in the provided file content.
 * @param {string} content - The content of a file.
 * @returns {string[]} - List of detected function names.
 */
const detectFunctions = (content) => {
    // Mock logic - Replace with actual logic to detect functions
    return ['functionA', 'functionB'];
};

/**
 * Detects function calls in the provided file content.
 * @param {string} content - The content of a file.
 * @param {string[]} functionNames - List of functions in the file.
 * @returns {Object[]} - List of call dependencies (from-to relationships).
 */
const detectFunctionCalls = (content, functionNames) => {
    // Mock logic - Replace with actual logic to detect function calls
    return [
        { from: 'functionA', to: 'functionB' },
        { from: 'functionB', to: 'functionC' }
    ];
};

/**
 * Converts call dependencies into a Mermaid-formatted graph.
 * @param {Object[]} callGraph - Array of call dependencies.
 * @returns {string} - Mermaid-formatted graph data.
 */
const generateMermaidGraph = (callGraph) => {
    let mermaidData = 'graph TD;\n';
    callGraph.forEach(call => {
        mermaidData += `${call.from} --> ${call.to};\n`;
    });
    return mermaidData;
};

module.exports = { parseCodeAndGenerateCallGraph };

