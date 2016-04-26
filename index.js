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

// files to read from
var articlesByDateFile = 'remaining-hrworks-articles.txt';


// urls
var baseURL = 'http://www.hrworks-inc.com';
// we want to use a local downloaded version of the page so we don't affect the analytics
var articlesByDateURL = 'http://127.0.0.1:8002/Articles.html';

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
    // get all remaining URLs we have to hit
    // ----------------------------------------
    // // articles by date
    // request(articlesByDateURL, function (error, response, body) {
    //     if (!error && response.statusCode == 200) {
    //         getHRWorksArticleURLS(body, '.blog_more table tr a', articlesByDateFile);
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

    // articles by category
    request('http://127.0.0.1:8002/Articles%20by%20Category.html', function (error, response, body) {
        if (!error && response.statusCode == 200) {
            getHRWorksArticleURLS(
                body,
                '#component .articles a',
                'articles-by-category-urls.txt'
            );
        }
    });

    // // process a single article
    // request(articleURL, function (error, response, body) {
    //     if (!error && response.statusCode == 200) {
    //         processArticle(articleURL, body);
    //     }
    // });


    // do the thing
    // // fs.createReadStream(articlesByDateFile)
    // fs.createReadStream('press-release-urls.txt')
    //     .pipe(split())
    //     .on('data', function (line) {
    //         if (line !== '') {
    //             var url = baseURL + line;
    //             // process a single article
    //             // request(url, function (error, response, body) {
    //             request(line, function (error, response, body) {
    //                 if (!error && response.statusCode == 200) {
    //                     processArticle(url, body);
    //                 }
    //             });
    //         }
    //     });
}


init();
