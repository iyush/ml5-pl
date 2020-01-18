let mobilenet;
let imgField;
let img;
let c;
let numberOfClassifications = 5;
let canvasWidth, canvasHeight;

function setup() {
    imgField = select('#dropzone');
    imgField.mousePressed(() => {
        let input = document.createElement('input');
        input.type = 'file';
        input.click();
        let file;
        input.onchange = e => {
            file = e.target.files[0];
            let reader = new FileReader()
            reader.readAsDataURL(file);
            reader.onload = readerEvent => {
                readerEvent.data = readerEvent.target.result;
                gotFile(readerEvent);
            }
        }
    });

    imgField.dragOver(
        () => imgField.style('background-color', '#ccc')
    );

    imgField.dragLeave(
        () => imgField.style('background-color', '#fff')
    );

    imgField.drop(gotFile,
        () => imgField.style('background-color', '#fff')
    );
}

function msgDisplay(txt) {
    document.getElementById("classify").innerHTML = txt;
}

function gotFile(file) {
    img = createImg(
        file.data,
        '',
        '',
        () => {
            msgDisplay("Classifying......... (Please Wait)");
            let ratio = (img.width / img.height);
            canvasHeight = 300;
            canvasWidth = canvasHeight * ratio

            c = createCanvas(canvasWidth, canvasHeight);
            background(0);
            image(img, 0, 0, width, height)
            c.parent('sketch-holder');
            ml5.
                imageClassifier("MobileNet")
                .ready
                .then((classifier) => {
                    classifier.classify(img, numberOfClassifications, gotResults)
                })
                .catch((err) => console.error(err));
        }
    );
    img.hide();
}

function gotResults(error, data) {
    if (error) console.error(error)
    else {
        let label = data[0].label
        let conf = data[0].confidence * 100
        msgDisplay('<b>Label: </b>' + label + "<br>" + "<b>Confidence Score: </b>" + conf);
    }
}