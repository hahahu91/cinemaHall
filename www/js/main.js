

import {hall2 as hall} from './halls.js';
import {hall2_68 as hallCheck} from './halls.js';
function draw(img) {
  var canvas = document.getElementById('imgCanvas1');
  var ctx = canvas.getContext('2d');
  //ctx.drawImage(img, 0, 0);
  img.style.display = 'none';
  var zoomctx = document.getElementById('imgCanvas2').getContext('2d');
 
  var train_data = [];
  let vector = [];
  var net = null;

  for (let i = 0; i < hall.length; i++) {     
    let w = hall[i].w;
    let h = hall[i].h; 
    let x = hall[i].x - w/2;
    let y = hall[i].y - h/2;

    zoomctx.drawImage(canvas,
      x,
      y,
      w, h,
      0, 0,
      20, 25);
      let imageData = zoomctx.getImageData(0, 0, 20, 25);
      //console.log(imageData);
//console.log(zoomctx.getImageData(x, y, w, h).data);
    
    vector = preparation(imageData.data);
    ctx.strokeStyle = 'red';
    ctx.strokeRect(x, y, w, h);
    console.log(vector);
    if( confirm('Empty?') )
    {
      train_data.push({
        input: vector,
        output: {Empty: 1}
      });
    } else
    {
      train_data.push({
        input: vector,
        output: {notEmpty: 1}
      });
    } 
  };
  console.log(train_data);
  net = new brain.NeuralNetwork();
  net.train(train_data, { 
    iterations: 20000, // the maximum times to iterate the training data --> number greater than 0
    errorThresh: 0.005, // the acceptable error percentage from training data --> number between 0 and 1
    log: true, // true to use console.log, when a function is supplied it is used --> Either true or a function
    logPeriod: 10, // iterations between logging out --> number greater than 0
    learningRate: 0.3, // scales with delta to effect training rate --> number between 0 and 1
    momentum: 0.1, // scales with next layer's change value --> number between 0 and 1
    callback: null, // a periodic call back that can be triggered while training --> null or function
    callbackPeriod: 10, // the number of iterations through the training data between callback calls --> number greater than 0
    timeout: Infinity,  });

  checkOthersPlace(net);
  //const result = brain.likely(vector, net);
  //alert(result);
  //canvas.addEventListener('mousemove', zoom);
}

var img, img2;
var ctx, ctx2;
var loaded1 = false;
var img_width, img_height;
function compareImages () { //Сравнить рисунки img1 и img2
 var result = document.getElementById('imgResult');
 var string = '';

 if (loaded1==false) {
  string = 'Не загружен файл';
 }
 else {
  //checkPlace()
 } 

}
function checkOthersPlace(net) {
  var canvas = document.getElementById('imgCanvas1');
  var ctx = canvas.getContext('2d');
  //ctx.drawImage(img, 0, 0);
  var zoomctx = document.getElementById('imgCanvas2').getContext('2d');
  let vector = [];

  for (let i = 0; i < hallCheck.length; i++) {     
    let w = hallCheck[i].w;
    let h = hallCheck[i].h; 
    let x = hallCheck[i].x - w/2;
    let y = hallCheck[i].y - h/2;

    zoomctx.drawImage(canvas,
      x,
      y,
      w, h,
      0, 0,
      6, 8);
      let imageData = zoomctx.getImageData(0, 0, 30, 40);
      //console.log(imageData);
//console.log(zoomctx.getImageData(x, y, w, h).data);
    
    vector = preparation(imageData.data);
    const result = brain.likely(vector, net);
    ctx.strokeStyle = 'red';
    ctx.strokeRect(x, y, w, h);

  
    console.log(result);
  }
}
function compareImgPlace(img1data, img2data) {
  let diff = 0;
  let sum = 0
  for (var i = 0; i < img1data.length / 4; i++) {
        sum += Math.abs(img1data[4 * i + 0] - img2data[4 * i + 0]) / 255;
        sum += Math.abs(img1data[4 * i + 1] - img2data[4 * i + 1]) / 255;
        sum += Math.abs(img1data[4 * i + 2] - img2data[4 * i + 2]) / 255;
        if (sum > 0.3) diff += sum;
        sum = 0;
      }
  return diff;
}
function preparation(imgData) {
  let vector = [];
  for (var i = 0; i < imgData.length / 4; i++) {
    var avg = (imgData[i] + imgData[i + 1] + imgData[i + 2]) / 3;
        ;
        vector.push(avg / 255);
      }
  return vector;
}

function resizeImage (img) { //Изменить размеры рисунка img
 var img_width = img.width;
 var img_height = img.height;
 var new_x = 0, new_y = 0;
 if (img_width<=600 && img_height<=450) {
  return [img_width, img_height];
 }
 else if (img_width > img_height) {
  new_x = 600;
  new_y = Math.round((600*img_height)/img_width);
 } 
 else if (img_height > img_width) {
  new_x = Math.round((600*img_width)/img_height);
  new_y = 450;
 }
 else {
  new_x = 600; new_y = 450;
 }
 return [new_x, new_y];
}

$("#file1").change (function (e) {
 var URL = window.webkitURL || window.URL;
 var url = URL.createObjectURL(e.target.files[0]);
 img = new Image();
 var canvas = document.getElementById('imgCanvas1');
 img.src = url;
 img.onload = function() {
  //img_width = img.width;
  //img_height = img.height;
  var resizeResults = resizeImage(img); 
  img_width = resizeResults[0]; img_height = resizeResults[1];
  ctx = canvas.getContext('2d');
  ctx.fillStyle="#999999"; 
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage (img, 0, 0, img_width, img_height);
  loaded1 = true;
  draw(this);

 // compareImages();
 }
});