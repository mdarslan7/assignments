const fs = require('fs');

fs.writeFile('test.txt', 'I like playing guitar also', (err) => {
    if (err) {
        console.log(err);
    }

    else {
        console.log('File written successfully');
    }
});