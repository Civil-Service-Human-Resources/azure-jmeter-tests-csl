# Course scrambler
## Overview  
The course scrambler is a script used to populate the elastic database with sufficient testing data. It accepts an JSON input of elastic data and will sanitise, replacing with sample content (links, files, e-learning packages).  

## Getting started  
### Prerequisites
The following prerequisites are required:
* npm/node installed
* access to elastic database on an integrated environment

### Getting data payload  
Get data from elasticsearch by making a HTTP GET to the following URL:
```
https://[env]-elastic.cshr.digital:9200/courses/course/_search?size=999
```  
Basic auth with elastic username and password will be need to be sent in the authentication header.

Save the output of this data into `data/input.ndjson`.

### Installation
Install dependencies for the script  
```
npm install

```

### Usage  
Run the script   
```
npm run start
```

The file `output.ndjson` should now be populated with data.

## Next steps
