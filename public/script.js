  const imgDiv = document.querySelector(".profile-pic-div");
  const img = document.querySelector("#photo");
  const file = document.querySelector("#file");
  const uploadBtn = document.querySelector("#uploadBtn");
//   const sign = document.querySelector("#signup");
//   sign.style.display = "none";
  //if user hover on img div

  imgDiv.addEventListener("mouseenter", function () {
    uploadBtn.style.display = "block";
  });

  //if we hover out from img div

  imgDiv.addEventListener("mouseleave", function () {
    uploadBtn.style.display = "none";
  });

  //lets work for image showing functionality when we choose an image to upload

  //when we choose a foto to upload

  file.addEventListener("change", function () {
    //this refers to file
    const choosedFile = this.files[0];

    if (choosedFile) {
      const reader = new FileReader(); //FileReader is a predefined function of JS

      reader.addEventListener("load", function () {
        img.setAttribute("src", reader.result);
      });

      reader.readAsDataURL(choosedFile);
    }
  });

  const form = document.querySelector('form');
  const emailError = document.querySelector('.email.error');
  const fnameError = document.querySelector('.fname.error');
  const lnameError = document.querySelector('.lname.error');
  const phoneError = document.querySelector('.phoneno.error');
  const passwordError = document.querySelector('.password.error');


  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    //Reset Errors
    emailError.textContent = '';
    fnameError.textContent = '';
    lnameError.textContent = '';
    phoneError.textContent = '';
    passwordError.textContent = '';


    // get values
    const email = form.email.value;    
    const fname = form.fname.value;
    const lname = form.lname.value;
    const phoneno = form.phoneno.value;
    const password = form.password.value;

    try {
      const res = await fetch('/signup', { 
        method: 'POST', 
        body: JSON.stringify({ email, fname, lname, phoneno, password }),
        headers: {'Content-Type': 'application/json'}
      });

      const data = await res.json();
      console.log(data);
      if(data.errors){
        emailError.textContent = data.errors.email;
        fnameError.textContent = data.errors.fname;
        lnameError.textContent = data.errors.lname;
        phoneError.textContent = data.errors.phoneno;
        passwordError.textContent = data.errors.password;
      }

      if(data.user){
        location.assign('/');
      }
    }
    catch (err) {
      console.log(err);
    }
  });