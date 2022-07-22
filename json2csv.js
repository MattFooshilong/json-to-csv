const createCsvWriter = require('csv-writer').createObjectCsvWriter
const fs = require('fs')

const csvWriter = createCsvWriter({
	path: './translateMe.csv',
	alwaysQuote: true,
	fieldDelimiter: ';',
	header: [
		{id: 'header', title: 'Header'},
		{id: 'en', title: 'English'},
		{id: 'cn', title: 'Chinese'},
		{id: 'my', title: 'Malay'}
	]
})

// to this
// {
//   "change_lng": "Change language",
//   'insert_update_job#add_ans': 'Add new answer',
//   'insert_update_job#your_ans': 'Your answer',
//	 'root#dashboard': 'Dashboard'
// }
function flattenObj(obj, parent, res = {}){
	for(let key in obj){
		let propName = parent ? parent + '#' + key : key
		if(typeof obj[key] == 'object'){
			flattenObj(obj[key], propName, res)
		} else {
			res[propName] = obj[key]
		}
	}
	return res
}

// import and flatten
const input = fs.readFileSync('./en/translation.json')
const parsedInput = JSON.parse(input)
const flattenedEnObj = flattenObj(parsedInput)
const inputChinese = fs.readFileSync('./cn/translation.json')
const parsedInputChinese = JSON.parse(inputChinese)
const flattenedCnObj = flattenObj(parsedInputChinese)
const inputMalay = fs.readFileSync('./my/translation.json')
const parsedInputMalay = JSON.parse(inputMalay)
const flattenedMyObj = flattenObj(parsedInputMalay)

function checkMissingKeys(engFile, chiFile, MalFile){
	/// this function checks if a key from the english file is missing in the chinese or malay file
	// treat english as the base file
	let testChi
	let testMal
	// check english and chinese files
	for(const key in engFile){
		if(Object.prototype.hasOwnProperty.call(chiFile, key)){
			testChi = true
		}else{
			console.log('Error: missing key in chinese file', key)
			testChi = false
		}
	}
	// check english and malay files
	for(const key in engFile){
		if(Object.prototype.hasOwnProperty.call(MalFile,key)){
			testMal = true
		}
		else{
			console.log('Error: missing key in malay file', key)
			testMal = false
		}
	}
	if(testMal && testChi) return true
	else return false
}

function toCSV(objEnglish, objChinese, objMalay){
	// 1) Each flattened key in json must be unique for this to work
	// 2) English file is the base file, that means if a key value pair is in the chinese/malay file but not in the english file it will be left out (most likely not used anyway)

	const check = checkMissingKeys(objEnglish, objChinese, objMalay)
	if(!check){
		return 'Please update missing key(s) value(s) before continuing'
	}else{
		let output = []
		for(const key in objEnglish){
			const temp = { 
				header:key, 
				en:objEnglish[key],
				cn:objChinese[key],
				my:objMalay[key]
			}
			output.push(temp)
		}
		return output
	}
}
const toCSVArr = toCSV(flattenedEnObj, flattenedCnObj, flattenedMyObj)
try{
	csvWriter.writeRecords(toCSVArr)       // returns a promise
		.then(() => {
			console.log('...Done')
		})
}catch(error){
	console.log(error)
}
