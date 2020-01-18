let mobilenet;
let imgField;
let img;
let c;
let numberOfClassifications = 5;
let canvasWidth, canvasHeight;

function setup() {
    imgField = select('#dropzone');
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

function gotFile(file) {
    img = createImg(
        file.data,
        '',
        '',
        () => {
            console.log(img.width, img.height);
            let ratio = (img.width / img.height);
            canvasHeight = 300;
            canvasWidth = canvasHeight * ratio
            
            c = createCanvas(canvasWidth, canvasHeight);
            background(0);
            image(img, 0, 0, width, height)
            c.parent('sketch-holder');
        }
    );
    img.hide();
    ml5.
        imageClassifier("MobileNet")
        .ready
        .then((classifier) => {
            classifier.classify(img, numberOfClassifications, gotResults)
        })
        .catch((err) => console.error(err));
}

function gotResults(error, data) {
    if (error) console.error(error)
    else {
        let label = data[0].label
        let conf = data[0].confidence * 100
        document.getElementById("nameOfClassification").innerHTML = '<b>Label: </b>' + label + "<br>";
        document.getElementById("probofClassification").innerHTML = "<b>Confidence Score: </b>" + conf;
    }
}