/*
* require the user to enter a password that is 8 or more characters AND contains at least
1 upper case letter AND 1 number and 1 of the following special characters ( / * - + ! @
# $ ^ & * ).
 */
const form = document.querySelector("form");

let username = form.elements.namedItem("Username");
let password = form.elements.namedItem("Password");
let confirmedPass = form.elements.namedItem("Confirm-Password");
let email = form.elements.namedItem("Email");
let userFormula = /^[A-Za-z][A-Za-z0-9]{2,}$/;
let passwordFormula = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\/*-+!@#$^&*])[A-Za-z\d\/*-+!@#$^&*]{8,}$/;
let mUsername = document.getElementById("messageUser");
let mPass = document.getElementById("messagePassword");
let mPassConfirm = document.getElementById("messageConfirmPass");
let mEmail = document.getElementById("messageEmail");
let emailFormula = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

let userNameValid = false;
username.addEventListener('focus', validateUser);
username.addEventListener('input', validateUser);
username.addEventListener('focusout', validateUserOut);
let emailValid = false;
email.addEventListener('input', validateEmail);
email.addEventListener('focus', validateEmail);
email.addEventListener('focusout', validateEmailOut);
let passwordValid = false;
password.addEventListener('input', validatePassword);
password.addEventListener('focus', validatePassword);
password.addEventListener('focusout', validatePassOut);
let confirmPasswordValid = false;
confirmedPass.addEventListener('input', validateConfPassword);
confirmedPass.addEventListener('focus', validateConfPassword);
confirmedPass.addEventListener('focusout', validateConfPassOut);


document.addEventListener('click', (e)=>{
    if(username==document.activeElement){
        mUsername.style.visibility = "visible";
    }else{
        mUsername.style.visibility = "hidden";
    }

    if(password==document.activeElement){
        mPass.style.visibility = "visible";
    }else{
        mPass.style.visibility = "hidden";
    }

    if(confirmedPass==document.activeElement){
        mPassConfirm.style.visibility = "visible";
    }else{
        mPassConfirm.style.visibility = "hidden";
    }

    if(email==document.activeElement){
        mEmail.style.visibility = "visible";
    }else{
        mEmail.style.visibility = "hidden";
    }



});
form.addEventListener('submit', (e) => {

    e.preventDefault();

    if(userNameValid && passwordValid && confirmPasswordValid && emailValid){
        alert('Submitted');
        form.reset();
        return true;
    }else{
        console.log(userNameValid);
        console.log(emailValid);
        console.log(passwordValid);
        console.log(confirmPasswordValid);
        alert('Fill the required fields');
        return false;
        }
})

function validateUser (e){

        if(!username.value.match(userFormula)){
            username.style.border = "3px solid red";
            mUsername.style.color = "rgb(172, 0, 0)";
            if(!username.value.charAt(0).match(/[A-Za-z]/)){
                mUsername.textContent = "Your username starts with \'" + (username.value.charAt(0)) + "\'. It should start with a character";
            }else if(username.value.length<3){
                mUsername.textContent = "Your username has only " + (username.value.length) + " character(s). It needs at least 3.";
            }
            mUsername.style.visibility = "visible";
            return false;
        }else {
            username.style.border = "3px solid rgb(5, 245, 108)";
            mUsername.style.color = "rgb(5, 245, 108)";
            mUsername.textContent = "This is a valid Username";
            mUsername.style.visibility = "visible";
            userNameValid = true;
            return true;
        }

};

function validateUserOut(e) {
    mUsername.style.visibility = "hidden";
    mUsername.textContent = "";
};

function validateEmail(e) {
    if(!email.value.match(emailFormula)){
        email.style.border = "3px solid red";
        mEmail.style.color = "rgb(172, 0, 0)";
        mEmail.textContent = "Invalid Email";
        mEmail.style.visibility = "visible";
        return false;
    }else{
        email.style.border = "3px solid rgb(5, 245, 108)";
        mEmail.style.color = "rgb(5, 245, 108)";
        mEmail.textContent = "Valid Email";
        mEmail.style.visibility = "visible";
        emailValid = true;
        return true;
    }
};

function validateEmailOut(e) {
    mEmail.style.visibility = "hidden";
    mEmail.textContent = "";
};

function validatePassword(e) {
    mPass.textContent = "";
    if(!password.value.match(passwordFormula)){
        password.style.border = "3px solid red";
        mPass.style.color = "rgb(172, 0, 0)";
        if(password.value.length<8){
            mPass.textContent = "Password is too short. ";
        }
        if(password.value.search(/[A-Z]/)==(-1)){
            mPass.textContent += "Add a capital letter. "
        }
        if(password.value.search(/[a-z]/)==(-1)){
            mPass.textContent += "Add a lower case letter. "
        }
        if(password.value.search(/[*-+!@#$^&*]/)==(-1)){
            mPass.textContent += "Add a special character. "
        }
        if(password.value.search(/[0-9]/)==(-1)){
            mPass.textContent += "Add a digit. "
        }
        mPass.style.visibility = "visible";
        return false;
    }else{
        password.style.border = "3px solid rgb(5, 245, 108)";
        mPass.style.color = "rgb(5, 245, 108)";
        mPass.textContent = "Valid Password";
        mPass.style.visibility = "visible";
        passwordValid = true;
        return true;
    }
};

function validatePassOut(e) {
    mPass.style.visibility = "hidden";
    mPass.textContent = "";
};

function validateConfPassword(e) {
    if(password.value!=confirmedPass.value){
        confirmedPass.style.border = "3px solid red";
        mPassConfirm.style.color = "rgb(172, 0, 0)";
        mPassConfirm.textContent = "Passwords don't match";
        mPassConfirm.style.visibility = "visible";
        return false;
    }else{
        confirmedPass.style.border = "3px solid rgb(5, 245, 108)";
        mPassConfirm.style.color = "rgb(5, 245, 108)";
        mPassConfirm.textContent = "Passwords match";
        mPassConfirm.style.visibility = "visible";
        confirmPasswordValid = true;
        return true;
    }
};

function validateConfPassOut(e) {
    mPassConfirm.style.visibility = "hidden";
    mPassConfirm.textContent = "";
};











