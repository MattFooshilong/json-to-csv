
const csvFilePath = 'translateMe.csv'
const fs = require('fs')
const csv = require('csvtojson')
csv({
	delimiter: ';'
})
	.fromFile(csvFilePath)
	.then((jsonObj) => {
		jsonObj
		const toArrEn = []
		const toArrCn = []
		const toArrMy = []
		jsonObj.map(item => {
			let objectEn = {}
			let objectCn = {}
			let objectMy = {}

			objectEn[item.Header] = item.English
			objectCn[item.Header] = item.Chinese
			objectMy[item.Header] = item.Malay

			toArrEn.push(objectEn)
			toArrCn.push(objectCn)
			toArrMy.push(objectMy)

		})
		const unFlatten = (obj) => {
			let res = {}
			for (let key in obj) {
				if (key.includes('#')) {
					const splitString = key.split('#')
					const parent = splitString.splice(0,1).join('')
					const child = splitString.join('#')
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
		const unFlattenedArrEn = toArrEn.map((obj) => unFlatten(obj))
		const unFlattenedArrCn = toArrCn.map((obj) => unFlatten(obj))
		const unFlattenedArrMy = toArrMy.map((obj) => unFlatten(obj))

		function toJson(arr) {
			let obj1 = arr[0]
			function merge(obj1, obj2) {
				const key = Object.keys(obj2)[0]
				if (obj1.hasOwnProperty(key)) {
					if(typeof obj1[key] === 'object' && typeof obj2[key] === 'object') 
					obj1[key] = merge(obj1[key], obj2[key])
					else 
					//replace when keys are the same
					obj1[key] = obj2[key]
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
		const outputEn = toJson(unFlattenedArrEn)
		const outputCn = toJson(unFlattenedArrCn)
		const outputMy = toJson(unFlattenedArrMy)

		fs.writeFile('./enTranslationFile.json', JSON.stringify(outputEn, null, 2), err => {
			if (err) console.log(err)
			else console.log('File successfully written')
		})
		fs.writeFile('./cnTranslationFile.json', JSON.stringify(outputCn, null, 2), err => {
			if (err) console.log(err)
			else console.log('File successfully written')
		})
		fs.writeFile('./myTranslationFile.json', JSON.stringify(outputMy, null, 2), err => {
			if (err) console.log(err)
			else console.log('File successfully written')
		})
	})
