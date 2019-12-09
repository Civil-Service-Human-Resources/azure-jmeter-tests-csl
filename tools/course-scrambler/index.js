const ndjson = require('ndjson')
const fs = require('fs')
const filePath = process.env.FILE_PATH || 'file.ndjson'
const fileOutPath = process.env.FILE_OUT_PATH || 'fileout.ndjson'

let content = ''
fs.createReadStream(filePath)
  .pipe(ndjson.parse())
  .on('data', function(document) {
	  if (document.modules !== undefined) {
		document.modules = document.modules.map((item) => {
			switch (item.type) {
				case "file":
				case "link":
				case "video":
					return handleItem(item);
				case "elearning":
					return handleElearningItem(item);
				default:
					return item;
			}
		})
	  }
	  content = content + JSON.stringify(document) + '\n'
  })
  .on("end", () => {
	console.log('Done: parsing file');
	fs.writeFileSync(fileOutPath, content + '\n');
	console.log('Done: writing file');
 });


function handleItem(item) {
	var itemsDictionary = {
		"link": ["link1", "link2"],
		"file": ["file1", "file2"],
		"video": ["video1", "video2"],
		"elearning": ["elearning1", "elearning2"]
	}

	const items = itemsDictionary[item.type]
	const index = Math.floor((Math.random() * items.length))
	const url = items[index]
	item.url = url
	return item
}

function handleElearningItem(item) {
	item.startPage = '/'
	return handleItem(item)
}
