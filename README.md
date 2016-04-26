# Page Scraper

Script to generate markdown files for Articles on the HRWorks site

Pre-reqs:
already created a file with the article URLs we need to hit
working on parsing out the correct stuff

for a single article:
1. get the raw HTML
2. grab only the #article html
3. sanitize HTML
4. tidy up the result
HTML --> sanitize --> tidy --> markdown

loop through a file with urls on each line


1. provide file with urls on each line
2. specify DOM target with a selector, '#article'

Outputs text files with:
- original URL
- article title (grabbed from the page title)
- the article HTML (sanitized and tidied)


We have:
Articles by date: √
Articles by category:  output file
Industry Updates:  create file with target URLs
Press Releases: *, created but the numbers don't match up, might be missing 10
