var isMobile = (navigator.userAgent.match(/Android/i)
                 || navigator.userAgent.match(/webOS/i)
                 || navigator.userAgent.match(/iPhone/i)
                 || navigator.userAgent.match(/iPad/i)
                 || navigator.userAgent.match(/iPod/i)
                 || navigator.userAgent.match(/BlackBerry/i)
                 || navigator.userAgent.match(/Windows Phone/i)
                 || navigator.userAgent.match(/iPad/i)
                );

var canvasWidth;
var canvasHeight;
var images = {};
var c;
var canvas;
var htmlCanvas;
var context;
var canvas1;
var images = {};
var widthImage;
var heightImage;
var allDom;
if(isMobile){
  widthImage = 300;
  heightImage = 600;
} else {
  widthImage = 400;
  heightImage = 800; 
}


$( document ).ready(function() {
    choseePhoto()
});

function choseePhoto(){
  $('#emperadorbarbudo').show();
  $('#emperadorbarbudo').on('click', function () {
      var url = 'http://www.emperadorbarbudo.com';
      window.location = url;
  });
  $('#imgInp').change(function(){ 
    loading(true);
    $('.title').text('recorta tu rostro');
    $('#emperadorbarbudo').hide();     
    $('.img-logo').css('display','none');
    $('.fileUpload').css('display','none');
    $('.camBtn').css('display','none');
    $('.editor').css('display','block');
    $('.toolbar').css('display','inherit');
    $('#ok-btn-crop').css('display','block');
    //$('#cancel-btn-crop').css('display','block');
    readURL(this)
});
}

function loading(enable){
  if(enable){
    $('.spinner').css('display','inherit'); 
  } else{
    $('.spinner').css('display','none');
  }
}

function readURL(input) {

    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('.editor').html('<img src="'+e.target.result+'" />');
            var $image = $('.editor > img');
              $image.cropper({
                movable: false,
                zoomable: true,
                rotatable: true,
                scalable: true
              });
              // photo menu
              // $('#crop').on('click', function () {
              //   $image.cropper('crop');
              // });
              $('#zoom-in').on('click', function () {
                $image.cropper('zoom', 0.1);
              });
              $('#zoom-out').on('click', function () {
                $image.cropper('zoom', -0.1);
              });
              $('#rotate-left').on('click', function () {
                $image.cropper('rotate', -90);
              });
              $('#rotate-right').on('click', function () {
                $image.cropper('rotate', 90);
              });             
              $('#ok-btn-crop').on('click', function () {
                loading(true);
                var cropBoxData = $image.cropper('getCropBoxData');

                $image.cropper('setCropBoxData',cropBoxData)
                $image.cropper('setCropBoxData',cropBoxData)
                $image.cropper('setCropBoxData',cropBoxData)
                var canvas = $image.cropper('getCroppedCanvas');
                canvasWidth = canvas.width;
                canvasHeight = canvas.height;
                console.log(canvasWidth+' - '+canvasHeight);
                dataURLOne = canvas.toDataURL();
                $image.cropper('clear');
                
                $('.editor').html('<img src="'+dataURLOne+'" />');
                fabric.Image.fromURL(dataURLOne, function(img){
                    images.base = img;
                    img.scaleToWidth(widthImage).set({evented: false, hasControls: false, selectable: false});
                    // redraw();
                });
                $('.toolbar').css('display','none');
                $(this).css('display','none');
                $('#cancel-btn-crop').css('display','none');
                // $('#undo-btn-crop').css('display','inherit');                
                $('.title').text('elije tu estilo de barba');

                getBeardData(dataURLOne); 
                loading(false);
              });
              $('#cancel-btn-crop').on('click', function () {
                $image.cropper('clear');
                $image.cropper('destroy');
                $('.editor img').remove();
                $('.editor').css('display','none');
                $('.toolbar').css('display','none');
                $('.logo').css('display','inherit');
                $('.fileUpload').css('display','inherit');
                $('.camBtn').css('display','inherit');
                $(this).css('display','none');
                $('#ok-btn-crop').css('display','none');
              });



        }

        reader.readAsDataURL(input.files[0]);
    }

    loading(false);
}

function updateApp(){

$('#imgInp').val('');
var $image = $('.editor > img');
    $image.cropper('clear');
    $image.cropper('destroy');
    delete images.base.canvas;
    delete images.accessory.canvas;
    images = {};
    $('.title').text('<a href="http://www.emperadorbarbudo.com">Tienda en línea</a>');    
    $('.editor img').remove();
    $('.editor').css('display','none');
    $('#download').css('display','none');
    $('#select-beard').css('display','none');
    $('.toolbar').css('display','none');
    $('#go-home').css('display','none');

    $('#emperadorbarbudo').css('display','block');
    $('.img-logo').css('display','block');
    $('.fileUpload').css('display','block');

    $('#canvas').css('width','70%');
    $('#canvas').css('margin','0 15% 0 15%');
    $('.title').text('Finalizar');
    
}

function getBeardData(urlBack){
  $('#select-beard').css('display','inline-block');

  $.getJSON( "beard-data.json", function( data ){
    var items = [];
    $.each( data.data, function( key, val ) {
      $( "#select-beard ul" ).append('<li img="'+val.text+'"><a id="'+val.id+'" href="javascript:void(0)" url="'+val.url+'"><img width="25" height="20" src="'+val.icon+'" />  '+val.text+'</a></li>');
      $('#'+val.id).on('click', function () {
        $('#canvas').css('width','100%');
        $('#canvas').css('margin',0);
        $('.title').text('Finalizar');
        $('#go-home').css('display','inherit');
        $('#go-home').on('click', function () {
          updateApp()
        });
        loading(true);
        
        var url = $(this).attr('url');
        setAccessory(url,urlBack); 
        $('#select-beard button').html('<img width="25" height="25" src="'+val.icon+'" /> <span class="caret"></span>');
        $('#download').css('display','inherit');
        $('#download').on('click', function () {
            loading(true);
            toImage();
        });

      });
    });  
  });

}

function setAccessory(url,urlBack) {
  if($('#c').length==0){
      $('.editor').append('<canvas id="c"></canvas>')
      c = $('.editor').find('canvas')[0];
      canvas = new fabric.Canvas(c);
      htmlCanvas = document.getElementById('c');
      context = htmlCanvas.getContext('2d');

      fabric.Image.fromURL(url, function(img) {
       img.scaleToWidth(200)
        images.accessory = img;
        images.accessory.set({
            top:460/2 - images.accessory.height*images.accessory.scaleY/2,
            left:300/2 - images.accessory.width*images.accessory.scaleX/2,
            borderColor: '#FFF',
            cornerColor: '#FFF',
            cornerSize: 12,
            transparentCorners: true
        });

         if (isMobile) { images.accessory.set({ cornerSize: 32 }); }

        canvas.add(images.base);
        canvas.add(images.accessory);
      });


        canvas.setHeight(heightImage)
        canvas.setWidth(widthImage);   

      $('.editor img').remove();
    
  } else {
    canvas.clear();
    fabric.Image.fromURL(url, function(img) {
        img.scaleToWidth(200)
        images.accessory = img;

        images.accessory.set({
            top:460/2 - images.accessory.height*images.accessory.scaleY/2,
            left:300/2 - images.accessory.width*images.accessory.scaleX/2,
            borderColor: '#FFF',
            cornerColor: '#FFF',
            cornerSize: 12,
            transparentCorners: true
        });

        canvas.add(images.base);
        canvas.add(images.accessory);
    });


        canvas.setHeight(heightImage)
        canvas.setWidth(widthImage);   
  }

  canvas.renderAll();
  canvas.calcOffset();
  loading(false);
}


function toImage(){
    // var fullQuality = canvas.toDataURL("image/jpeg", 1.0);
    // data:image/jpeg;base64,/9j/4AAQSkZJRgABAQ...9oADAMBAAIRAxEAPwD/AD/6AP/Z"
    // var mediumQuality = canvas.toDataURL("image/jpeg", 0.5);
    // var lowQuality = canvas.toDataURL("image/jpeg", 0.1);
    var bounds = getImageBounds(true);
    var finalImage = canvas.toDataURL({
        format: 'png',
        left: bounds.left,
        top: bounds.top,
        width: bounds.width,
        height: bounds.height,
        quality: 1.0
    });
    var blob = dataURLtoBlob(finalImage);
    console.log('blob',blob);
    var objurl = URL.createObjectURL(blob);
    console.log('image:',objurl);
    var random = Math.floor(Math.random() * 10000000000000) + 1  
    $('#download').attr('download','img-'+random+'.png').attr('href',objurl);
    loading(false);
}

function dataURLtoBlob(dataurl) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type:mime});
}

function getImageBounds(fitToCanvas) {
  var objs = canvas.getObjects();

  if (objs.length === 0) {
    return {
      top: 0, left: 0, height: 0, width: 0
    };
  }

  // Fabric.js bug getting an objects bounds when all objects are selected
  canvas.deactivateAll();
  var bounds = objs[0].getBoundingRect();

  // Find maximum bounds
  for (var i = 0; i < objs.length; i++) {
    var obj = objs[i];
    var rect = getObjBounds(obj);

    if (rect.left < bounds.left) {
      bounds.width += bounds.left - rect.left;
      bounds.left = rect.left;
    }

    if (rect.top < bounds.top) {
      bounds.height += bounds.top - rect.top;
      bounds.top = rect.top;
    }

    var right = rect.left + rect.width;
    var bottom = rect.top + rect.height;

    if (right > bounds.left + bounds.width) {
      bounds.width = right - bounds.left;
    }

    if (bottom > bounds.top + bounds.height) {
      bounds.height = bottom - bounds.top;
    }
  }

  if (fitToCanvas) {
    // Fit to canvas
    if (bounds.left < 0) {
      bounds.width -= Math.abs(bounds.left);
      bounds.left = 0;
    }

    if (bounds.top < 0) {
      bounds.height -= Math.abs(bounds.top);
      bounds.top = 0;
    }

    if (bounds.left + bounds.width > canvas.width) {
      bounds.width = canvas.width - bounds.left;
    }

    if (bounds.top + bounds.height > canvas.height) {
      bounds.height = canvas.height - bounds.top;
    }
  }

  // Don't show selection tools
  //selectAll();
  canvas.deactivateAll();
  canvas.renderAll();

  return bounds;
}

function getObjBounds(obj) {
  var bounds = obj.getBoundingRect();
  var shadow = obj.getShadow();

  if (shadow !== null) {
    var blur = shadow.blur;
    var mBlur = blur * Math.abs(obj.scaleX + obj.scaleY) / 4;
    var signX = shadow.offsetX >= 0.0 ? 1.0 : -1.0;
    var signY = shadow.offsetY >= 0.0 ? 1.0 : -1.0;
    var mOffsetX = shadow.offsetX * Math.abs(obj.scaleX);
    var mOffsetY = shadow.offsetY * Math.abs(obj.scaleY);
    var offsetX = mOffsetX + (signX * mBlur);
    var offsetY = mOffsetY + (signY * mBlur);

    if (mOffsetX > mBlur) {
      bounds.width += offsetX;
    } else if (mOffsetX  < -mBlur) {
      bounds.width -= offsetX;
      bounds.left += offsetX;
    } else {
      bounds.width += mBlur * 2;
      bounds.left -= mBlur - mOffsetX;
    }

    if (mOffsetY > mBlur) {
      bounds.height += offsetY;
    } else if (mOffsetY < -mBlur) {
      bounds.height -= offsetY;
      bounds.top += offsetY;
    } else {
      bounds.height += mBlur * 2;
      bounds.top -= mBlur - mOffsetY;
    }
  }

  return bounds;
}

function initialize(){
  window.addEventListener('resize', resizeCanvas, false);
  resizeCanvas();
}

function redraw() {
  context.strokeStyle = 'blue';
  context.lineWidth = '5';
  context.strokeRect(0, 0, window.innerWidth, window.innerHeight);
}

function resizeCanvas() {
  htmlCanvas.width = window.innerWidth;
  htmlCanvas.height = window.innerHeight;
  redraw();
}


// function setAccessory(url,urlBack) {
//   $('.editor').append('<canvas id="c"></canvas>')
//   c = $('.editor').find('canvas')[0];
//   canvas = new fabric.Canvas(c);
//   fabric.Image.fromURL(url, function(img) {
//     img.scaleToWidth(canvasWidth)

//    canvas.add(img);
//   });
//   $('.editor img').remove();
  
// }
// function setAccessory(url,urlBack) {
//   console.log('entra a setAccessory');
//   $('.editor').append('<canvas id="c"></canvas>')
//   c = $('.editor').find('canvas')[0];
//   canvas = new fabric.Canvas(c).setWidth(canvasWidth);
//   // canvas.selection = false;
//   if (!url) { images.accessory = null; redraw(urlBack); return; }
//   fabric.Image.fromURL(url, function(img){
//     images.accessory = img;
//     images.accessory.scaleToWidth(canvasWidth/2);
//       images.accessory.set({
//           top:canvas.height/2 - images.accessory.height*images.accessory.scaleY/2,
//           left:canvasWidth/2 - images.accessory.width*images.accessory.scaleX/2,
//           borderColor: '#FFF',
//           cornerColor: '#FFF',
//           cornerSize: 12,
//           transparentCorners: true
//       });
//       if (isMobile) { images.accessory.set({ cornerSize: 32 }); }
//       redraw(urlBack);
//   });
//   console.log('sale de setAccessory');
// }

// function redraw(urlBack) {
//   $('.canvas-container').append('<img src="'+urlBack+'" />');
//   $('.editor img').remove();
//   console.log('entra a redraw');
//   // loading.show();
//   // container.find('.bs-instructions-container').hide();
//   canvas.clear();

//   if(images.base) {
//       canvas.setHeight(images.base.height * images.base.scaleY);
//       canvas.add(images.base);
//   } else { canvas.setHeight(canvasWidth * 0.75); }

//   if (images.accessory) { canvas.add(images.accessory); }

//   canvas.renderAll()
//   canvas.calcOffset();
//   console.log('sale de redraw');
//   // container.find('.bs-canvas-container').show();
//   // loading.hide();
// }


