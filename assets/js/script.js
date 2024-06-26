// Select your form for submition
let form = document.getElementById("form");
//creates a file which we will use globally
let file;
//the link from response
let link;
//form submitting to prevent double submission
let formSubmiting = false;
// Select your input type file and store it in a variable
let input = document.getElementById("file");

//UPLOAD FILE and send response to a variable
//browse file
const button = document.getElementById("browseFile");
button.onclick = () => input.click(); //on click open file selector

// submit file button
const submitBtn = document.getElementById("submit-btn");


//submit the form
form.addEventListener("submit", async function (event) {
  event.preventDefault();
  // create a formdata object
  // console.log("formdata"+" what is uploaded")
  // console.log(input.files[0]);
  // console.log(file);
  // console.log("formdata"+" what has been uploaded")

  //check if form has been uploaded/ and if file is empty
  if(file!==undefined && formSubmiting===false){
    //makes sure that the form submission starts
  formSubmiting= true

  submitBtn.disabled= true;

  //create a form data for post
  let data = new FormData();
  // data.append("file", input.files[0]);
  data.append("file", file);
  // console.log(data);
  await fetch("https://file.io", {
    // Your POST endpoint
    
    method: "POST", // or 'PUT'
    headers: {
      /*One needs to omit content-type header for the Fetch request. 
        Then the browser will automatically add the Content type header including the Form Boundary which looks like:
         "Content-Type": 'multipart/form-data; boundary=—-WebKitFormBoundaryfgtsKTYLsT7PNUVD',*/
    },
    body: data, // This is your file object
  })
    .then((response) => response.json()) // if the response is a JSON object
    .then((result) => {
      console.log("Success:", result); // Handle the success response object
      if (result) {
        link = result.link;
        //progress bar called
        progressBar();
        //returns link
        linkView();
      } // Handle the success response object}
    })
    .catch((error) => {
      console.error("Error:", error); // Handle the error response object
      alert("Error! Try again later \n" + error.message);
    });
  }
  else{
    alert("File not Found")
  }
});

//drag and drop
const dropArea = document.querySelector(".drag-area"),
  dragText = dropArea.querySelector(".dragHeader");

input.addEventListener("change", function () {
  
  file = input.files[0];
  dropArea.classList.add("active");
  console.log(file);
  let fileNameText = document.querySelector(".fileName p");
  fileNameText.innerHTML = file.name;
  showFile(); //calling function
});

//If user Drag File Over DropArea
dropArea.addEventListener("dragover", (event) => {
  event.preventDefault(); //preventing from default behaviour
  dropArea.classList.add("active");
  dragText.textContent = "Release to Upload File";
});

//If user leave dragged File from DropArea
dropArea.addEventListener("dragleave", () => {
  dropArea.classList.remove("active");
  dragText.textContent = "Drag & Drop to Upload File";
});

//If user drop File on DropArea
dropArea.addEventListener("drop", (event) => {
  event.preventDefault(); //preventing from default behaviour
  //getting user select file and [0] this means if user select multiple files then we'll select only the first one
  file = event.dataTransfer.files[0];
  showFile(); //calling function
});

//file preview
function showFile() {
    let fileName = file.name; // Get the name of the selected file
    let fileType = file.type; // Get the type of the selected file
  
    // Check if the file type is in the list of valid extensions
    let validExtensions = [
        "image/jpeg", "image/jpg", "image/png", // Image formats
        "application/zip", "application/pdf", // Document formats
        "video/mp4", "video/webm", "video/ogg" // Video formats
    ];
    
    // Check if the file type is in the list of valid extensions
    if (validExtensions.includes(fileType) || fileName.toLowerCase().endsWith(".zip") || fileName.toLowerCase().endsWith(".pdf")) {
      // If it's a supported file type, display the file name
      dropArea.innerHTML = `<p>${fileName}</p>`;
      console.log("File type: " + fileType);
      console.log("File name: " + fileName);
    } else {
      // If it's not a supported file type, display an error message
      alert("Unsupported file type! Please upload an image (JPEG, JPG, PNG), a ZIP file, a PDF, or a video (MP4, WebM, Ogg).");
      dropArea.classList.remove("active");
      dragText.textContent = "Drag & Drop to Upload File";
    }
}

  

//hide progressBar div
const fileViewProgress = document.querySelector(".fileView");

fileViewProgress.style.display = "none";


const progressSpeed =6000
//progressBar
function progressBar() {
fileViewProgress.style.display = "block";

  let progressIndicator = document.querySelector(".progressIndicator");
  progressIndicator.style.animation = "progress 6s";
  progressIndicator.style.width = "100%";
  setTimeout(function () {
    document.querySelector(".close").style.display = "none";
    document.querySelector(".success").style.display = "block";
  }, progressSpeed);
  progressBarPercent();
}

const speed = progressSpeed / 100;

function progressBarPercent() {
  let progressValue = 0;
  let progressText = document.querySelector(".progressPerc p");
  let progress = setInterval(() => {
    progressValue++;
    progressText.innerHTML = `${progressValue}%`;
    if (progressValue === 100) {
      clearInterval(progress);
    }
  }, speed);
}

//show link
function linkView() {
  let linkView = `<div class="linkView">
 <div id="sample">${link}</div>
 <br />
 <div class="button">
   <button type="button" id="copyText">
     Copy
   </button>
 </div>`;
  dropArea.innerHTML = linkView;
}
// const copyText = document.getElementById("copyText");

//selecting appended button
document.addEventListener('click', function(e){
  // console.log(e.target.id)
  //selects the clicked target with id
  if(e.target.id === 'copyText'){
       //do something
       e.preventDefault();
       setTimeout(function(){
       document.getElementById('copyText').textContent = 'Copied';
       }, 30);

       /* Copy text into clipboard */
       navigator.clipboard.writeText(`${link}`);
      }
});