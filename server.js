const fs = require('fs');
const crypto = require('crypto');
const axios = require('axios');

// Add Reg rule
const regofcaddyLog = /((?:\d+\.){3}(?:\d+))(?:(?:\s\-){2}\s)(?:\[)((?:\w|\s|\/|:|\+)+)(?:\])\s\W((?:\w|\s|\/|\.|\-|\?|\%|\=)*)\W\s(\d{3})\s(\d*)\s\W(?:(?:\w|\:|\/|\.|\-|\?|\%|\=|\&|\+)*)\W\s\W((?:\w|\/|\.)*)\s\W((?:\w|\;|\s|\:|\.|-|\/)*)\W\s((?:\w|\/|\s|\.|\/|\:|\(|\,|\)|\;)*)\W/g;
const inputPath = '/var/log/caddy/love_caddy.log';
const outputPath = './data.json';
const nullMd5Hash = 'd41d8cd98f00b204e9800998ecf8427e';
let preMd5Hash = null;
let positionCache = null;

/**
 * State Class accesser 
 * @param {*} remote
 * @param {*} date
 * @param {*} method
 * @param {*} status
 * @param {*} size
 * @param {*} userAgent
 * @param {*} client
 * @param {*} browser
 */
const accesser = class {
    constructor (remote, date, method, status, size, userAgent, client, browser, position) {
        this.remote = remote,
        this.date = date, 
        this.method = method, 
        this.status = status, 
        this.size = size, 
        this.userAgent = userAgent, 
        this.client = client, 
        this.browser = browser,
        this.position = position
    }
};

const readFilePro = file => {
    return new Promise((resolve, reject) => {
        fs.readFile(file, 'utf-8',(err, data) => {
        if (err) reject('I could not find that file!😢');
        resolve(data.trim().split('\n'));
        });
    });
};

const searchPosition = remote => {
    return new Promise((resolve, reject) => {
        if(!positionCache) reject('Have no positionCache data!😢');
        const positionData = JSON.parse(positionCache).find(elem => elem.remote === remote);
        if(positionData) resolve(positionData.position);
        resolve(null);
    })
}

const parseDataPro = data => {
    return new Promise((resolve, reject) => {
        if(!data) reject('LogData is empty! 😢')
        const accessData = data.map(async (singleData) => {
            let position;
            singleData.match(regofcaddyLog);
            const [remote, date, method, status, size, userAgent, client, browser] = 
                [RegExp.$1, RegExp.$2, RegExp.$3, RegExp.$4, RegExp.$5, RegExp.$6, RegExp.$7, RegExp.$8];
                position = await searchPosition(remote);
                if(!position) position = await getPositionPro(remote);
            return new accesser ( remote, 
                                    date, 
                                    method, 
                                    status, 
                                    size, 
                                    userAgent, 
                                    client, 
                                    browser,
                                    position);
        })
        resolve(Promise.all(accessData));
    })
}


const writeFilePro = (file, data) => {
    return new Promise((resolve, reject) => {
      fs.writeFile(file, data, 'utf-8', err => {
        if (err) reject('Could not write file 😢');
        resolve('success');
      });
    });
};


const getPositionPro = (remote) => {
    return new Promise((resolve, reject) => {
        axios.get(`http://ip-api.com/json/${remote}`)
            .then(res => {
                resolve(res.data);
            })
            .catch(err => {
                reject('Request to faster, please try later again!')
            })
    })
};

fs.watch(inputPath, async (type, filename) => {
    try{
        if (!filename) return;
    
        const currMd5Hash = crypto
            .createHash('md5')
            .update(fs.readFileSync(inputPath))
            .digest('hex');

        if(currMd5Hash === preMd5Hash || currMd5Hash === nullMd5Hash) return;
        preMd5Hash = currMd5Hash;
        console.log(`1: ${filename} has changed!, md5: ${currMd5Hash}`)
        /**
         * Read file and parse log data to JSON
         */
        const logData = await readFilePro(inputPath);
        // console.log(logData)
        positionCache = await readFilePro(outputPath);
        console.log('2: Get position data, please wait😜 !')
        const accessData = await parseDataPro(logData);
        // console.log(accessData)
        await writeFilePro(outputPath, JSON.stringify(accessData));
        console.log('3: Bingo🤪 ! Accesser data saved to file.');
        

    } catch (err) {
        console.log(err);

        throw err;
    }
    return console.log('Ready🐶 !');
});