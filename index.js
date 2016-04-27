#!/usr/bin/env node

var fs = require('fs');
var path = require('path');
var request = require('request');
var cheerio = require('cheerio');
var sanitize = require('sanitize-html');
var tidy = require('htmltidy2').tidy;
var slug = require('slug');
var split = require('split');



// output things to:
var outputDir = './output/';
var logFile = outputDir + 'log.txt';



// urls
var baseURL = 'http://www.hrworks-inc.com';
// we want to use a local downloaded version of the page so we don't affect the analytics
var articlesByDateURL = 'http://127.0.0.1:8002/Articles.html';
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



function getHRWorksArticleURLS (html, selectorString, outputFilename) {
    var $ = cheerio.load(html);

    var links = $(selectorString).toArray();
    var urlStrings = '';

    links.forEach(function (link) {
        urlStrings += link.attribs.href + '\n';
    });

    // create a text file with the array
    outputFile(outputFilename, urlStrings);
}



function processArticle (url, html) {

    // create filename based on url, more unique (there can only be 1 url)
    var urlSplitArray = url.split('/');
    var filename = urlSplitArray[urlSplitArray.length - 1] + '.txt';

    // target the correct HTML
    var $ = cheerio.load(html);
    var title = $('title').text();


    $('.contentheading').remove();
    $('.contentheading_pr').remove();
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
        articleOutput(filename, url, title, html2);
    });
}



function processLastModified (url, lastModified) {
    var lastModifiedFile = 'output/last-modified.txt';
    // var lastModifiedFile = 'output/last-modified--test.txt';
    var output = '';
    output += lastModified;
    output += '\t';
    output += url;
    output += '\n';
    // console.log(output);
    fs.appendFile(lastModifiedFile, output, function (err) {
        if (err) throw err;
        console.log('wrote last-modified date for: ' + url);
    });
}



function articleOutput (filename, url, title, html) {
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
    // console.log('code in init() function is commented out');

    // get all remaining URLs we have to hit
    // ----------------------------------------
    // // articles by date
    // request(articlesByDateURL, function (error, response, body) {
    //     if (!error && response.statusCode == 200) {
    //         getHRWorksArticleURLS(
    //             body,
    //             '.blog_more table tr a',
    //             'remaining-hrworks-articles.txt'
    //         );
    //     }
    // });

    // // press releases
    // request('http://127.0.0.1:8002/Press%20Releases.html', function (error, response, body) {
    //     if (!error && response.statusCode == 200) {
    //         getHRWorksArticleURLS(
    //             body,
    //             '#component table tr a',
    //             'press-release-urls.txt'
    //         );
    //     }
    // });

    // // articles by category
    // request('http://127.0.0.1:8002/Articles%20by%20Category.html', function (error, response, body) {
    //     if (!error && response.statusCode == 200) {
    //         getHRWorksArticleURLS(
    //             body,
    //             '#component .articles li > a',
    //             'articles-by-category-urls.txt'
    //         );
    //     }
    // });

    // // industry updates
    // request('http://127.0.0.1:8002/Industry%20Updates.html', function (error, response, body) {
    //     if (!error && response.statusCode == 200) {
    //         getHRWorksArticleURLS(
    //             body,
    //             '#component .articles li > a',
    //             'industry-updates-urls.txt'
    //         );
    //     }
    // });


    // // ----------------------------------------
    // // process a single article
    // request(articleURL, function (error, response, body) {
    //     if (!error && response.statusCode == 200) {
    //         // processLastModified(articleURL, response.headers['last-modified']);
    //         processArticle(articleURL, body);
    //     }
    // });
    // // ----------------------------------------


    // do the thing
    // fs.createReadStream('url-files/articles-by-category-urls.txt')
    // fs.createReadStream('url-files/articles-by-date-urls.txt')
    // fs.createReadStream('url-files/industry-updates-urls.txt')
    // fs.createReadStream('url-files/press-release-urls.txt')
    // fs.createReadStream('url-files/missing-article-urls.txt')
    //     .pipe(split())
    //     .on('data', function (line) {
    //         if (line !== '') {
    //             // var url = baseURL + line; // NOTE: press release URLs have full paths
    //             var url = line; // use this if grabbing from press-release-urls.txt or missing-articles

    //             // process a single article
    //             request(url, function (error, response, body) {
    //                 if (!error && response.statusCode == 200) {
    //                     processArticle(url, body);
    //                     // processLastModified(url, response.headers['last-modified']);
    //                 } else {
    //                     // // for error reporting, not very accurate...
    //                     // fs.appendFile(logFile, url + '\n', function (err) {
    //                     //     if (err) throw err;
    //                     //     console.log('updated logfile, error: ' + url);
    //                     //     // console.log('wrote last-modified date for: ' + url);
    //                     // });
    //                 }
    //             });
    //         }
    //     });
}


init();
