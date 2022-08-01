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

function checkMissingKeys(engFile, chiFile, malFile){
	/// this function checks if a key from the english file is missing in the chinese or malay file
	// treat english as the base file
	let testChi = true
	let testMal = true
	// check english and chinese files
	for(const key in engFile){
		if(!Object.prototype.hasOwnProperty.call(chiFile, key)){
			console.log('Error: missing key in chinese file', key)
			testChi = false
			break;
		}
	}
	// check english and malay files
	for(const key in engFile){
		if(!Object.prototype.hasOwnProperty.call(malFile,key)){
			console.log('Error: missing key in malay file', key)
			testMal = false
			break;
		}
	}
	if(testMal && testChi) return true
	else return false
}

function toCSV(objEnglish, objChinese, objMalay){
	const check = checkMissingKeys(objEnglish, objChinese, objMalay)
	if(!check){
		return false
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
	if(!toCSVArr) console.log('Please update missing key(s) value(s) before continuing')
	else{
		csvWriter.writeRecords(toCSVArr)       // returns a promise
		.then(() => {
			console.log('...Done')
		})
	}
}catch(error){
	console.log(error)
}
