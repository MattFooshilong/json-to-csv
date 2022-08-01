
const csvFilePath = 'translateMe.csv'
const fs = require('fs')
const csv = require('csvtojson')
let json
csv({
	delimiter: ';'
})
	.fromFile(csvFilePath)
	.then((jsonObj) => {
		json = jsonObj
		const objectEn = {}
		const objectCn = {}
		const objectMy = {}

		json.map(item => {
			objectEn[item.Header] = item.English
			objectCn[item.Header] = item.Chinese
			objectMy[item.Header] = item.Malay
		})
		//console.log(objectEn)

		const nestObj = (obj) => {
			let output = {}
			let parentKey = ''
			for (const key in obj) {
				if (key.includes('#')) {
					const splitString = key.split('#')
					const parent = splitString[0]
					const child = splitString[1]
					const childObj = {
						[child]: obj[key]
					}
					if (parentKey === '') {
						output[parent] = childObj
						parentKey = parent
					} else if (parent === parentKey) {
						const newChildObj = Object.assign(output[parent], childObj)
						output[parent] = newChildObj
					} else {
						output[parent] = childObj
						parentKey = parent
					}
				} else {
					//does not include # (means no nested)
					output[key] = obj[key]
				}
			}
			return output
		}
		const toJSONEn = nestObj(objectEn)
		const toJSONCn = nestObj(objectCn)
		const toJSONMy = nestObj(objectMy)
		// fs.writeFile('./enTranslationFile.json', JSON.stringify(toJSONEn, null, 2), err => {
		// 	if (err) console.log(err)
		// 	else console.log('File successfully written')
		// })
		// fs.writeFile('./cnTranslationFile.json', JSON.stringify(toJSONCn, null, 2), err => {
		// 	if (err) console.log(err)
		// 	else console.log('File successfully written')
		// })
		// fs.writeFile('./myTranslationFile.json', JSON.stringify(toJSONMy, null, 2), err => {
		// 	if (err) console.log(err)
		// 	else console.log('File successfully written')
		// })
	})
const objImported = {
	choose_lng: 'Choose a language',
	change_lng: 'Change language',
	'insert_update_job#cho_employment_type': 'Choose employment type(s)'

}
const unFlatten = (obj) => {
	let res = {}
	for (let key in obj) {
		if (key.includes('#')) {
			const splitString = key.split('#')
			const parent = splitString[0]
			const child = splitString[1]
			const childObj = {
				[child]: obj[key]
			}
			res[parent] = unFlatten(childObj)
		} else {
			res[key] = obj[key]
		}
	}
	return res
}
const arrOfObj = [

	{ choose_lng: 'Choose a language' },
	{ change_lng: 'Change language' },
	{ 'insert_update_job#your#1': 'Choose employment type(s)' },
	{ 'insert_update_job#your#2': 'Your' }
]
const newArr = arrOfObj.map((obj) => unFlatten(obj))//check this
console.log(newArr)
function test(arr) {
	let obj1 = arr[0]
	function merge(obj1, obj2) {
		const key = Object.keys(obj2)[0]
		if (obj1.hasOwnProperty(key)) {
			obj1[key] = merge(obj1[key], obj2[key])
		} else {
			obj1[key] = obj2[key]
		}
		return obj1
	}
	for (let i = 1; i < arr.length; i++) {

		const obj2 = arr[i]
		obj1 = merge(obj1, obj2)
	}
	return obj1
}

//console.log(test(newArr))




// function merge(obj1, obj2) {
// 	const key = Object.keys(obj2)[0]
// 	if (obj1.hasOwnProperty(key)) {
// 		obj1[key] = merge(obj1[key], obj2[key])
// 	} else {
// 		obj1[key] = obj2[key]
// 	}
// 	return obj1
// }
// const res = merge({ choose_lng: 'Choose a language', change_lng: 'Change language', insert_update_job: { cho_employment_type: { 1: 'Choose employment type(s)' } } },
// 	{ insert_update_job: { cho_employment_type: { 2: 'Your' } } }
// )
// console.log(res)