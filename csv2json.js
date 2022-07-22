
const csvFilePath='translateMe.csv'
const fs = require('fs')
const csv=require('csvtojson')
let json
csv({
	delimiter:';'
})
	.fromFile(csvFilePath)
	.then((jsonObj)=>{
		json  = jsonObj
		const objectEn = {}
		const objectCn = {}
		const objectMy = {}

		json.map(item => {
			objectEn[item.Header] = item.English
			objectCn[item.Header] = item.Chinese
			objectMy[item.Header] = item.Malay
		})
		const nestObj = (obj) => {
			let output = {}
			let parentKey = ''
			for(const key in obj){
				if(key.includes('#')){
					const splitString = key.split('#')
					const parent = splitString[0]
					const child = splitString[1]
					const childObj = {
						[child] : obj[key]
					}
					if(parentKey === ''){
						output[parent] = childObj
						parentKey = parent
					}else if(parent === parentKey){
						const newChildObj = Object.assign(output[parent],childObj)
						output[parent] = newChildObj
					}else{
						output[parent] = childObj
						parentKey = parent
					}
				}else{
					//does not include # (means no nested)
					output[key] = obj[key]
				}
			}
			return output
		} 
		const toJSONEn = nestObj(objectEn)
		const toJSONCn = nestObj(objectCn)
		const toJSONMy = nestObj(objectMy)
		fs.writeFile('./enTranslationFile.json', JSON.stringify(toJSONEn, null, 2), err=>{
			if(err) console.log(err)
			else console.log('File successfully written')
		})
		fs.writeFile('./cnTranslationFile.json', JSON.stringify(toJSONCn, null, 2), err=>{
			if(err) console.log(err)
			else console.log('File successfully written')
		})
		fs.writeFile('./myTranslationFile.json', JSON.stringify(toJSONMy, null, 2), err=>{
			if(err) console.log(err)
			else console.log('File successfully written')
		})
	})
