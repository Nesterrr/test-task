'use strict';

const getPage = require('./get-page');
const filter = require('./filter');
const fs = require('fs');
const path = require('path');


const twoWeeks = 2 * 7 * 24 * 60 * 60 * 1000;


const getRandTimestampInRange = (range) => {
  return Date.now() - parseInt(Math.random() * range);
};


const preprocessRec = (timestamp, rec) => {
  return Object.assign({created: timestamp}, rec);
};


let preprocessedData = null;


module.exports = {
  read: (filterID, from, to, callback) => {
    return new Promise((resolve, reject) => {
      from = typeof from === 'undefined' ? -Infinity : from;
      to = typeof to === 'undefined' ? Infinity : to;

      fs.readFile(path.resolve(__dirname, 'data.json'), 'utf-8', (err, data) => {
        if (err) {
          reject(err);
          return;
        }

        try {
          data = JSON.parse(data);

          if (!preprocessedData) {
            preprocessedData = data.map(rec => preprocessRec(getRandTimestampInRange(twoWeeks), rec));
          }

          var filteredData = filter(preprocessedData, filterID);
          var pageData = getPage(filteredData, from, to);
          if (callback) {
            var body = JSON.stringify(pageData, null, 2);
    
            pageData = '/**/ ' + callback + '(' + body + ');'
          }
          resolve(pageData);
        } catch (err) {
          reject(err);
        }
      });
    });
  }
};
