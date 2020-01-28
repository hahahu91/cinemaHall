import {TrainingHall2 as trainingData } from './hall2.js';
import {hall2 as hall} from './halls.js';
import {hall2_68 as hallCheck} from './halls.js';
var net = null;

function trainNet() {
	net = new brain.NeuralNetwork();
	net.train(trainingData, { 
		iterations: 1000, // the maximum times to iterate the training data --> number greater than 0
		errorThresh: 0.005, // the acceptable error percentage from training data --> number between 0 and 1
		log: true, // true to use console.log, when a function is supplied it is used --> Either true or a function
		logPeriod: 10, // iterations between logging out --> number greater than 0
		hiddenLayers: 2,
		learningRate: 0.3, // scales with delta to effect training rate --> number between 0 and 1
		momentum: 0.1, // scales with next layer's change value --> number between 0 and 1
		callback: null, // a periodic call back that can be triggered while training --> null or function
		callbackPeriod: 10, // the number of iterations through the training data between callback calls --> number greater than 0
		timeout: Infinity,  });
}

function draw(img, needTrain = false) {
	const canvas = document.getElementById('imgCanvas1');
	const ctx = canvas.getContext('2d');
	let train_data = [];
	if (!needTrain) {
		trainNet();
	}
	
	const zoomctx = document.getElementById('imgCanvas2').getContext('2d');

	for (let i = 0; i < hall.length; i++) {     
		const w = hall[i].w;
		const h = hall[i].h; 
		const x = hall[i].x - w/2;
		const y = hall[i].y - h/2;

		zoomctx.drawImage(canvas,
		x,
		y,
		w, h,
		0, 0,
		10, 12);
		const imageData = zoomctx.getImageData(0, 0, 10, 12);
		const vector = preparation(imageData.data);
		if(needTrain) {			
			ctx.strokeStyle = 'red';
			ctx.strokeRect(x, y, w, h);
			if( confirm('Empty?') ) {
				train_data.push({
					input: vector,
					output: {Empty: 1}
				});
			} else {
				train_data.push({
					input: vector,
					output: {notEmpty: 1}
				});
			} 
		} else {
			const result = brain.likely(vector, net);
			if (result === "Empty") {
				ctx.strokeStyle = 'red';
				ctx.strokeRect(x, y, w, h);
			}
			console.log(result);
		}
		
	};
	if (train_data) {
		const str = JSON.stringify(train_data);
		console.log(str);
	}
}

function preparation(imgData) {
	let vector = [];
	for (var i = 0; i < imgData.length / 4; i++) {
		const avg = (imgData[i] + imgData[i + 1] + imgData[i + 2]) / 3;
		vector.push(avg / 255);
	  }
	return vector;
	  /*
	  Нужно пробегать рисунок даже разного размера и приводить его к 1 размеру, если в данном блоке есть разные пиксели ставить 1 если все пиксели примерно одинаковые тогда 0
  */
}

function resizeImage (img) { //Изменить размеры рисунка img
	const img_width = img.width;
	const img_height = img.height;
	let new_x = 0, new_y = 0;
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
	const URL = window.webkitURL || window.URL;
	const url = URL.createObjectURL(e.target.files[0]);
	const img = new Image();
	const canvas = document.getElementById('imgCanvas1');
	img.src = url;
	img.onload = function() {
		const resizeResults = resizeImage(img); 
		const img_width = resizeResults[0];
		const  img_height = resizeResults[1];
		const ctx = canvas.getContext('2d');
		ctx.fillStyle="#999999"; 
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		ctx.drawImage (img, 0, 0, img_width, img_height);
		const NeedTrain = false;
		draw(this, NeedTrain);
	}
});