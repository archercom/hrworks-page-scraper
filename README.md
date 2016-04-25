# Page Scraper

Script to generate markdown files for Articles on the HRWorks site

Pre-reqs:
already created a file with the article URLs we need to hit
working on parsing out the correct stuff

for a single article:
1. get the raw HTML
2. sanitize HTML
3. tidy up the result
4. grab only the #article html
HTML --> sanitize --> tidy --> markdown

the tidy util already install doesn't seem to do the job nicely

hmm. maybe we have to switch it up

since we'll be making requests against the live site i wonder if it'll have info
on the last edit.
  if we can get the "last editted" info it'll help us accurately get that on the site
