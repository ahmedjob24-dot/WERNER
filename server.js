const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

// Middleware to parse JSON data from the request body
app.use(express.json());

// Path to the JSON file where data will be stored
const dataFilePath = path.join(__dirname, 'data.json');

// Utility function to read data from the JSON file
function readDataFromFile() {
    if (fs.existsSync(dataFilePath)) {
        const rawData = fs.readFileSync(dataFilePath);
        return JSON.parse(rawData);
    }
    return [];
}

// Utility function to save data to the JSON file
function saveDataToFile(data) {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
}

// GET endpoint to retrieve data
app.get('/data', (req, res) => {
    const data = readDataFromFile();
    res.json(data);
});

// POST endpoint to add data
app.post('/data', (req, res) => {
    const newData = req.body;
    const data = readDataFromFile();
    data.push(newData);
    saveDataToFile(data);
    res.status(201).json(newData);
});

// PUT endpoint to modify data
app.put('/data/:id', (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;

    let data = readDataFromFile();
    const index = data.findIndex(item => item.id === id);

    if (index !== -1) {
        data[index] = { id, ...updatedData };
        saveDataToFile(data);
        res.json(data[index]);
    } else {
        res.status(404).send('Item not found');
    }
});

// DELETE endpoint to remove data
app.delete('/data/:id', (req, res) => {
    const { id } = req.params;
    let data = readDataFromFile();
    data = data.filter(item => item.id !== id);
    saveDataToFile(data);
    res.status(204).send();
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
