let upload1 = document.querySelector('#image_input1')
let upload2 = document.querySelector('#image_input2')
let result1 = document.querySelector('#result1')
let result2 = document.querySelector('#result2')
let submit = document.getElementById("combine_btn")
let image1 = ""
let image2 = ""
let image1X1, image1X2,  image1Y1, image1Y2
let image2X1, image2X2,image2Y1, image2Y2
let phaseCheckbox = document.getElementById("uniform-phase")
let magnitudeCheckbox = document.getElementById("uniform-Magnitude")
let options = document.getElementById("image1_info")


phaseCheckbox.addEventListener('change', e=>{
  send()
})


upload1.addEventListener('change', e => {
  if (e.target.files.length) {

    // start file reader
    const reader = new FileReader();
    reader.onload = e => {
      if (e.target.result) {
        // create new image
        let img = document.createElement('img');
        img.id = 'image';
        img.src = e.target.result;
        img.style.resize=200;
        
        // clean result before
        result1.innerHTML = '';
        // append new image
        result1.appendChild(img)
        // origial image
        image1 = e.target.result

        // init cropper
        cropper1 = new Cropper(img, {
          zoomOnWheel: false,
          movable: false,
          guides: false,
          crop: function (e) {

            image1X1 = e.detail.x; image1Y1 = e.detail.y; image1X2 = e.detail.width + e.detail.x; image1Y2 = e.detail.height + e.detail.y;
            }
        });
      }
    };
    reader.readAsDataURL(e.target.files[0]);
  }
});
magnitudeCheckbox.addEventListener('change', e=>{
  send()
})

options.addEventListener('change',  e=>{
  send()
})

upload2.addEventListener('change', e => {
  if (e.target.files.length) {
    // start file reader
    const reader = new FileReader();
    reader.onload = e => {
      if (e.target.result) {
        // create new image
        let img2 = document.createElement('img');
        img2.id = 'image';
        img2.src = e.target.result;
        image2 = e.target.result
        // clean result before
        result2.innerHTML = '';
        // append new image
        result2.appendChild(img2)
        // init cropper
        cropper2 = new Cropper(img2, {
          zoomOnWheel: false,
          movable: false,
          guides: false,
          crop: function (e) {
            image2X1 = e.detail.x; image2Y1 = e.detail.y; image2X2 = e.detail.width + e.detail.x; image2Y2 = e.detail.height + e.detail.y;
             }
        });
      }
    };
    reader.readAsDataURL(e.target.files[0]);
  }
});


submit.addEventListener('click', e => {
  e.preventDefault();
  send()
}
)


function send(){
  
  // to handle if the user not enter two images
  try {
    const option = document.getElementById("image1_info");
    if (image1 == "" || image2 == "") {
      throw "error : not enought images "
    }
    let phaseCheckboxValue = document.querySelector('#uniform-phase').checked;
    console.log(phaseCheckboxValue)
    let magnitudeCheckboxValue = document.querySelector('#uniform-Magnitude').checked;
    console.log(magnitudeCheckboxValue)
    
    
    let formData = new FormData();
    formData.append('image1',image1)
    formData.append('image1X1',image1X1)
    formData.append('image1X2',image1X2)
    formData.append('image1Y1',image1Y1)
    formData.append('image1Y2',image1Y2)
    formData.append('image2',image2)
    formData.append('image2X1',image2X1)
    formData.append('image2X2',image2X2)
    formData.append('image2Y1',image2Y1)
    formData.append('image2Y2',image2Y2)

    formData.append('option', option.value)
    formData.append('phaseCheckboxValue',phaseCheckboxValue)
    formData.append('magnitudeCheckboxValue',magnitudeCheckboxValue)


  
    $.ajax({
      type: 'POST',
      url: '/saveImg',
      data: formData,
      cache: false,
      contentType: false,
      processData: false,
      async: true,
      success: function (backEndData) {
        var responce = JSON.parse(backEndData)

        var big_cont = document.getElementById("images_container")
        const cont12 = document.getElementById("cont1")
        // const cont22 = document.getElementById("cont2")
        // const cont32 = document.getElementById("cont3")

        cont12.remove()
        // cont22.remove()
        // cont32.remove()

        var img_1 = document.createElement("div")
        img_1.className = "container"
        img_1.id = "cont1"
        img_1.innerHTML = responce[1]
        

        // var img1Label = document.createElement("label")
        // img1Label.for = "cont1"
        // img1Label.id = "img1Label"
        // img1Label.append("lpf")
        // img_1.appendChild(img1Label)

        // var img_2 = document.createElement("div")
        // img_2.className = "container"
        // img_2.id = "cont2"
        // img_2.innerHTML = responce[2]

        // var img2Label = document.createElement("label")
        // img2Label.for = "cont2"
        // img2Label.id = "img2Label"
        // img2Label.append("hpf")
        // img_2.appendChild(img2Label)

        // var img_3 = document.createElement("div")
        // img_3.className = "container"
        // img_3.id = "cont3"
        // img_3.innerHTML = responce[3]
        // var img3Label = document.createElement("label")
        // img3Label.for = "cont3"
        // img3Label.id = "img3Label"
        // img3Label.append("mix")
        // img_3.appendChild(img3Label)



        big_cont.appendChild(img_1)
        // big_cont.appendChild(img_2)
        // big_cont.appendChild(img_3)

      }


    })
  } catch (error) {
    console.log("please upload two images")
  }

  
}





// $(document).ready(function(e){
//     $('#submit').on('click',function(){
//        let form_data = new FormData();
//     //    var file1 = document.getElementById('file1')
       
//        form_data.append("file1",document.getElementById('file1').files[0]);
//        form_data.append("file2",document.getElementById('file2').files[0]);
       
       
        

   


//        $.ajax({
//         url: '/',
//         cache: false,
//         contentType: false,
//         processData: false,
//         data: form_data,
//         async: true,
//         type: 'post',
//         success: function(data){
//             console.log(data);
//             document.getElementById("image1").innerHTML= images();
//         }
        

//        });

//     });

// });



// function images(){
//     var timestamp = new Date().getTime(); 
//     var im1 = document.getElementById("image1"); 
//     var im2 = document.getElementById("image2"); 
    
// 	im1.src = "/static/images/image1.jpg?t=" + timestamp;    
// 	im1.classList.remove("hidden");
// 	im2.src = "/static/images/image2.jpg?t=" + timestamp;    
// 	im2.classList.remove("hidden");



// };

