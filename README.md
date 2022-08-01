# json-csv-json-translation

1) npm install
2) put your translation files in their folders like so: en/translation.json, cn/translation.json, my/translation.json before running json2csv.js
3) node json2csv.js
4) node csv2json.js

Using json2csv.js
1) Each child key in a .json file must be unique for this to work (should already be)
2) Json to csv: Best usage is to make sure all the keys in the english .json file are in other files as well.



Notes: 
- The translation.json file in the en folder is the base file, 
- that means if a key value pair is in the chinese/malay .json file but not in the english file it will be left out (most likely not used anyway)

For example, "month": "Bulan" is in the malay file but not in the english file. This pair will not be converted to csv and subsequently back to json. Include in the english file if you want to keep it. 
