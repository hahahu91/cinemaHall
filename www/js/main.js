

import {hall2 as hall} from './halls.js';
function draw(img) {
  var canvas = document.getElementById('imgCanvas1');
  var ctx = canvas.getContext('2d');
  //ctx.drawImage(img, 0, 0);
  img.style.display = 'none';
  var zoomctx = document.getElementById('imgCanvas2').getContext('2d');
 
  var train_data = [];
  let vector = [];
  let net = null;

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
      30, 40);
      
    vector = zoomctx.getImageData(x, y, w, h).data;
    ctx.strokeStyle = 'red';
    ctx.strokeRect(x, y, w, h);

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
        output: {NotEmpty: 1}
      });
    }
};
    console.log(train_data);
    net = new brain.NeuralNetwork();
				net.train(train_data, {log: true});

				const result = brain.likely(vector, net);
				alert(result);
  //}
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