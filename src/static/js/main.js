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
                //xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
                xhr.onload = function(e) { };

                xhr.send(formData)
            }else{
                console.log("不明な入力")
            }
        }
        let files = event.dataTransfer.files;
    });

    dropArea.addEventListener('dragover',function(event){
        event.preventDefault();
        event.dataTransfer.dropEffect = 'copy';
    });
};

