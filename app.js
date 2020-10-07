const fs = require('fs');
const express = require('express');

const app = express();

// middleware
app.use(express.json())

const accessers = JSON.parse(
    fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
)

const getAllAccessers = (req, res) => {
    res.status(200).json({
        status: 'success',
        results: accessers.length,
        data: {
            accessers
        }
    })
}

const getAccesser = (req, res) => {
    const id = req.params.id * 1; 
    const accesser = accessers.find(el => el.id === id);
    if (!accesser) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID'
        })
    }


    res.status(202).json({
        status: 'success',
        data: {
            accesser
        }
    })
}

const createAccesser = (req, res) => {
    const newId = accessers[accessers.length - 1].id + 1;
    const newAccesser = Object.assign({id: newId}, req.body)

    accessers.push(newAccesser);
    console.log(newAccesser)
    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(accessers), err => {
        res.status(201).json({
            status: 'success',
            data: {
                accesser: newAccesser
            }
        })
    })
}

const updateAccesser = (req, res) => {
    const id = req.params.id * 1; 
    const accesser = accessers.find(el => el.id === id);
    if (!accesser) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID'
        })
    }

    res.status(203).json({
        status: 'success',
        data: {
            accesser: '<update accesser here...>'
        }
    })
}

const deleteAccesser = (req, res) => {
    const id = req.params.id * 1; 
    const accesser = accessers.find(el => el.id === id);
    if (!accesser) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID'
        })
    }

    res.status(204).json({
        status: 'success',
        data: null
    })
}

app
    .route('/api/v1/accessers')
    .get(getAllAccessers)
    .post(createAccesser)

app.route('/api/v1/accessers/:id')
    .get(getAccesser)
    .patch(updateAccesser)
    .delete(deleteAccesser)


const port = 8080;
app.listen(port, () => {
    console.log(`App running on port ${port}...`)
})

