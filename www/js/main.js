
import {hall2 as hall} from './halls.js';
var img1, img2;
var ctx1, ctx2;
var loaded1 = false, loaded2 = false;
var img1_width, img2_width, img1_height, img2_height;
function compareImages () { //Сравнить рисунки img1 и img2
 var result = document.getElementById('imgResult');
 var string = '';

 if (loaded1==false || loaded2==false) {
  string = 'Не загружены 2 файла';
 }
 else if (img1_width != img2_width || img1_height != img2_height) {
  string = 'Для сравнения размеры рисунков должны совпадать<br>Загружено: ('+
   img1_width + 'x' + img1_height + ') и ('+
   img2_width + 'x' + img2_height + ')';
 }
 else {
  checkPlace()
 } 
 result.innerHTML = string;
}
function checkPlace(){
  for (let j = 0; j < hall.length; j++) {     
      let w = hall[j].w;
      let h = hall[j].h; 
      let x = hall[j].x - w/2;
      let y = hall[j].y - h/2;
      var img1data = ctx1.getImageData(x, y, w, h).data;
      var img2data = ctx2.getImageData(x, y, w, h).data;
      var diff = compareImgPlace(img1data, img2data);

      var r = 100*diff/(w * h * 3);
      var string = "Разница между рисунками: " + r.toFixed(5)+'%';
      if (r  > 10) {
          console.log(hall[j], j, r,diff)
        ctx2.strokeStyle = 'red';
        ctx2.strokeRect(x, y, w, h);
        ctx1.strokeStyle = 'red';
        ctx1.strokeRect(x, y, w, h);
      }
  }
  //console.log(hall);
  //loaded1 = loaded2 = false;
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
 img1 = new Image();
 var canvas1 = document.getElementById('imgCanvas1');
 img1.src = url;
 img1.onload = function() {
  img1_width = img1.width;
  img1_height = img1.height;
  var resizeResults = resizeImage (img1); 
  img1_width = resizeResults[0]; img1_height = resizeResults[1];
  ctx1 = canvas1.getContext('2d');
  ctx1.fillStyle="#999999"; 
  ctx1.fillRect(0, 0, canvas1.width, canvas1.height);
  ctx1.drawImage (img1, 0, 0, img1_width, img1_height);
  loaded1 = true;
  compareImages();
 }
});
$("#file2").change (function (e) {
 var URL = window.webkitURL || window.URL;
 var url = URL.createObjectURL(e.target.files[0]);
 img2 = new Image();
 var canvas2 = document.getElementById('imgCanvas2');
 img2.src = url;
 img2.onload = function() {
  img2_width = img2.width;
  img2_height = img2.height;
  var resizeResults = resizeImage (img2); 
  img2_width = resizeResults[0]; img2_height = resizeResults[1];
  ctx2 = canvas2.getContext('2d');
  ctx2.fillStyle="#999999"; 
  ctx2.fillRect(0, 0, canvas2.width, canvas2.height);
  ctx2.drawImage (img2, 0, 0, img2_width, img2_height);
  loaded2 = true;
  compareImages();
 }
});