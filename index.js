#!/usr/bin/env node

var fs = require('fs');
var path = require('path');
var request = require('request');
var cheerio = require('cheerio');
var sanitize = require('sanitize-html');
var tidy = require('htmltidy2').tidy;
var slug = require('slug');
var split = require('split');


var outputDir = './output/';
var hrworksArticlesFile = 'remaining-hrworks-articles.txt';

var baseURL = 'http://www.hrworks-inc.com';

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
    outputFile(hrworksArticlesFile, urlStrings);
}



function processArticle (url, html) {
    // target the correct HTML
    var $ = cheerio.load(html);
    var title = $('title').text();


    $('.contentheading').remove();
    var article = $('#article').html();


    // sanitize the HTML
    article = sanitize(article, {
        allowedTags: sanitize.defaults.allowedTags.concat(['img'])
    });


    // tidy html
    tidy(article, {
        indent: true,
        showBodyOnly: true
    }, function (err, html2) {
        articleOutput(url, title, html2);
    });
}



function articleOutput (url, title, html) {
    var filename = slug(title).toLowerCase() + '.txt';
    var output = '';
    output += 'URL\n';
    output += url;
    output += '\n\n';
    output += 'TITLE\n';
    output += title;
    output += '\n\n';
    output += 'BODY\n';
    output += html;

    outputFile(filename, output);
}



function init () {
    // // get all remaining URLs we have to hit
    // request(localURL, function (error, response, body) {
    //     if (!error && response.statusCode == 200) {
    //         getHRWorksArticleURLS(body);
    //     }
    // });

    // // process a single article
    // request(articleURL, function (error, response, body) {
    //     if (!error && response.statusCode == 200) {
    //         processArticle(articleURL, body);
    //     }
    // });

    // console.log('read the file');
    fs.createReadStream(outputDir + hrworksArticlesFile)
        .pipe(split())
        .on('data', function (line) {
            if (line !== '') {
                console.log(baseURL + line);
            }
        });
}


init();
