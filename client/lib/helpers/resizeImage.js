resizeImage = function(img, maxWidth, maxHeight){

// console.log(img);

tmpImage = new Image();
tmpImage.src = img;
width = tmpImage.width;
height = tmpImage.height;

// console.log(width + "," + height);


if (width > height) {
  if (width > maxWidth) {
    height *= maxWidth / width;
    width = maxWidth;
  }
} else {
  if (height > maxHeight) {
    width *= maxHeight / height;
    height = maxHeight;
  }
}

var canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(tmpImage, 0, 0, width, height);
        return canvas.toDataURL("image/jpeg");

// console.log(width + "," + height);

}