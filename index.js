#!/usr/bin/env node

var fs = require('fs');
var path = require('path');
var request = require('request');
var cheerio = require('cheerio');
var sanitize = require('sanitize-html');
var exec = require('child_process').exec;


var outputDir = './output/';


// var url = 'http://www.hrworks-inc.com/topics-in-hr/articles-by-date';
var localURL = 'http://127.0.0.1:8002/Articles.html';
// we want to use a local downloaded version of the page so we don't affect the analytics

// handle a single article
var articleURL = 'http://127.0.0.1:8002/What%E2%80%99s%20the%20Secret%20Sauce%20to%20Effective%20Performance%20Management_.html';



function outputFile (filename, content) {
    var filePath = path.join(outputDir, filename);

    fs.stat(filePath, function (err, stats) {
        // create file if err
        fs.writeFile(filePath, content, function (err) {
            if (err) throw err;
            console.log(filename + ' written');
        });
    });
}


function getHRWorksArticleURLS (html) {
    var $ = cheerio.load(html);

    var links = $('.blog_more table tr a').toArray();
    var urlStrings = '';

    links.forEach(function (link) {
        urlStrings += link.attribs.href + '\n';
    });

    // create a text file with the array
    outputFile('remaining-hrworks-articles.txt', urlStrings);
}


function processArticle (html) {

    // console.log(html);
    // console.log(typeof html);
    // // raw html we're working with
    // outputFile('article-test--raw.html', html);

    // // sanitize the HTML
    // var article = sanitize(html, {
    //     allowedTags: sanitize.defaults.allowedTags.concat([ 'img', 'h2', 'h3', 'title' ])
    // });
    // outputFile('article-test--sanitized.html', article);


    // var $ = cheerio.load(html);
    // target the correct HTML
    // var article = $('#article').html();


    // tidy it up
    // console.log('tidy it up');
    // outputFile('article-test--sanitizes.html', article);
}



function init () {
    // // get all remaining URLs we have to hit
    // request(localURL, function (error, response, body) {
    //     if (!error && response.statusCode == 200) {
    //         getHRWorksArticleURLS(body);
    //     }
    // });

    request(articleURL, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            processArticle(body);
        }
    });

}


init();
