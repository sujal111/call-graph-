// const express = require('express');
// const bodyParser = require('body-parser');
// const { parseCodeAndGenerateCallGraph } = require('./callGraphParser'); // Import the parser

// const app = express();
// app.use(bodyParser.json());

// app.post('/api/analyze', (req, res) => {
//     const { filePath } = req.body;
//     const callGraphData = parseCodeAndGenerateCallGraph(filePath);
//     res.json({ callGraph: callGraphData });
// });

// app.listen(3000, () => console.log('Server is running on port 3000'));



// const express = require('express');
// const bodyParser = require('body-parser');
// const { parseCodeAndGenerateCallGraph } = require('./callGraphParser'); // Import the parser

// const app = express();
// app.use(bodyParser.json());

// app.post('/api/analyze', (req, res) => {
//     const { filePath } = req.body;
//     const callGraphData = parseCodeAndGenerateCallGraph(filePath);
//     res.json({ callGraph: callGraphData });
// });

// // Export the app for testing
// module.exports = app;

// app.listen(3000, () => console.log('Server is running on port 3000'));



const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const { parseCodeAndGenerateCallGraph } = require('./callGraphParser'); // Import the parser

const app = express();
app.use(bodyParser.json());

app.post('/api/analyze', (req, res) => {
    const { filePath } = req.body;
    const { callGraph, testCases } = parseCodeAndGenerateCallGraph(filePath);

    // Save test cases to a file
    const testFilePath = path.join(__dirname, 'api.test.js');
    fs.writeFileSync(testFilePath, testCases, 'utf8');

    res.json({ callGraph, message: `Test cases generated and saved to ${testFilePath}` });
});

app.listen(3000, () => console.log('Server is running on port 3000'));

module.exports = app; // Export app for testing

