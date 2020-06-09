function onClearButtonClick(){
    let xhr = new XMLHttpRequest();
    xhr.open('POST','http://localhost:8080/clear');
    xhr.onload = function(e) { };
    xhr.send();
}

window.onload = function() {
    let dropArea = document.getElementById('droparea');

    dropArea.addEventListener('drop',function(event){
        event.preventDefault();
        let dataType = event.dataTransfer.types;
        console.log(dataType)
        
        for(let i=0,l=dataType.length;l>i;i++){
            if(dataType[i] === "Files"){
                
            }else if(dataType[i] === "text/plain"){
                let inputText = event.dataTransfer.getData("text/plain")
                console.log(inputText)
                let formData = new FormData();
                formData.append('input_text',inputText);
                let xhr = new XMLHttpRequest();
                xhr.open('POST','http://localhost:8080/upload_text');
                xhr.onload = function(e) { };

                xhr.send(formData);
            }else{
                console.log("不明な入力");
            }
        }
        let xhr = new XMLHttpRequest();
        xhr.open('GET','http://localhost:8080/items',true);
        xhr.onload = function(e) { 
            //console.log(xhr.response);
            let responseItems = xhr.response["items"];
            console.log(responseItems);
            for(let i = 0;i<responseItems.length;i++){
                stage.addChild(createDynamicText(stageWidth/2+(Math.random()-0.5)*200,stageHeight/2-i*100,responseItems[i]["text"]));
            }
        };
        xhr.onerror = function (e) {
            console.error(xhr.statusText);
          };
        xhr.responseType = 'json';
        xhr.send(null);
    });

    dropArea.addEventListener('dragover',function(event){
        event.preventDefault();
        event.dataTransfer.dropEffect = 'copy';
    });
};

