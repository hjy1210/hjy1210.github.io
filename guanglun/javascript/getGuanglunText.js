// 下面的Javascript，用來將廣論南普陀版、鳳山寺版、廣海明月、南山律在家備覽下載成html檔案，可以用YHIR進行檢索。
function getGuanglunText() {
    var mainDiv = document.getElementsByClassName("jss41 jss42");
    var count = mainDiv[0].children.length;
    var res="<!DOCTYPE html>\n<html>\n<head>\n<meta charset=\"UTF-8\">\n</head>\n<body>\n";
    for (var i=0;i<count;i++){
        var element  = mainDiv[0].children[i];
        var name = element.nodeName;
        if (name == "DIV")
            res = res + "<div>" + element.innerText + "</div>\n"; // + element.innerText+ "\n\n"; 
        if (name == "P"){
            var spans = element.getElementsByTagName("span");
            if (spans.length>0) { //2025/03/17 修改(因為100A，歸依學 處者...)
			    res = res +"<p>"
				for (var j=0;j<spans.length;j++){
				   res = res+ "<b>"+spans[j].innerText+"</b>"; //**"+spans[0].innerText+"**"+"\n\n";
				}
				res = res +"</p>"
            } else {
                res = res+ element.outerHTML+"\n"; //element.innerText+"\n\n";
            }
        }
    }
    return res+"</body>\n</html>\n";
}

async function saveFile(text) {
  // create a new handle
  const newHandle = await window.showSaveFilePicker();

  // create a FileSystemWritableFileStream to write to
  const writableStream = await newHandle.createWritable();

  // write our file
  await writableStream.write(text);

  // close the file and write the contents to disk.
  await writableStream.close();
}

function getGuangHaimMingYueText() {
    var mainDiv = document.getElementsByClassName("wrap-div");
    var count = mainDiv[0].children.length;
    var res = "<!DOCTYPE html>\n<html>\n<head>\n<meta charset=\"UTF-8\">\n</head>\n<body>\n";
    for (var i = 0; i < count; i++) {
        var element = mainDiv[0].children[i];
        var name = element.nodeName;
        //console.log(name)
        if (name == "DIV")
            res = res + "<div>" + element.innerText + "</div>\n"; // + element.innerText+ "\n\n"; 
        if (name == "P") {
            res = res + element.outerHTML + "\n"; //element.innerText+"\n\n";
        }
        if (name == "BLOCKQUOTE") {
            res = res + element.outerHTML + "\n";
        }
    }
    return res + "</body>\n</html>\n";
}

function getZaiJiaBeiLanText() {
    var mainDiv = document.getElementsByClassName("jss407 jss408");
    var count = mainDiv[0].children.length;
    var res = "<!DOCTYPE html>\n<html>\n<head>\n<meta charset=\"UTF-8\">\n</head>\n<body>\n";
    for (var i = 0; i < count; i++) {
        var element = mainDiv[0].children[i];
        var name = element.nodeName;
        //console.log(name)
        if (name == "DIV")
            res = res + "<div>" + element.innerText + "</div>\n"; // + element.innerText+ "\n\n"; 
        if (name == "P") {
            var spans = element.getElementsByTagName("span");
            if (spans.length > 0) {
                res = res + "<p><b>" + spans[0].innerText + "</b></p>\n"; //**"+spans[0].innerText+"**"+"\n\n";
            } else {
                res = res + element.outerHTML + "\n"; //element.innerText+"\n\n";
            }
        }
    }
    return res + "</body>\n</html>\n";
}

// 瀏覽 https://lamrim.xyz/player2/ 的南普陀/鳳山寺版檔案，在 console 中，執行擷取本程式saveFile(getGuanglunText())，存成 .html 檔案。
saveFile(getGuanglunText())
// 瀏覽 https://lamrim.xyz/player2/ 的廣海明月檔案，在 console 中，執行擷取本程式saveFile(getGuangHaimMingYueText())，存成 .html 檔案。
saveFile(getGuangHaimMingYueText())
// 瀏覽 https://lamrim.xyz/player2/ 的南山律在家備覽檔案，在 console 中，執行擷取本程式saveFile(getZaiJiaBeiLanText())，存成 .html 檔案。
saveFile(getZaiJiaBeiLanText())