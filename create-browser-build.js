import fs from 'fs';

fs.copyFile('./dist/lambda.min.cjs', './dist/lambda.min.js', error => {
    if (error) throw error;
    console.log('./dist/lambda.min.js created as a copy of ./dist/lambda.min.cjs');
});