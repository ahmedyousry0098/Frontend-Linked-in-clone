const emailInp = document.getElementById('emailInput')
const passInp = document.getElementById('passInput')

const validateEmail = (email) => {
    const pattern = /^[A-Za-z0-9]{3,25}@(gmail|outlook|yahoo).(com|org|net)$/
    return pattern.test(email)
}

const validatePass = (password) => {
    const pattern = /^[A-Za-z0-9@-_]{5,30}$/
    return pattern.test(password)
}

emailInp.addEventListener('blur', function (e) {
    e.preventDefault()
    const emailValidatePar = document.getElementById('emailValidate')
    if (!validateEmail(this.value)) {
        emailValidatePar.innerHTML = "In-valid Email";
        emailValidatePar.classList.add('text-danger')
        this.classList.add('is-invalid')
    }
    else {
        emailValidatePar.innerHTML = "Looks Good";
        emailValidatePar.classList.add('text-sucess')
        this.classList.add('is-valid')
    }
})

emailInp.addEventListener('focus', function(e) {
    e.preventDefault()
    const emailValidatePar = document.getElementById('emailValidate')
    emailValidatePar.innerHTML = "";
    emailValidatePar.classList.remove('text-danger', 'text-success')
    this.classList.remove('is-invalid', "is-valid")
})

passInp.addEventListener('blur', function (e) {
    e.preventDefault()
    const passValidatePar = document.getElementById('passValidate')
    if (!validatePass(this.value)) {
        passValidatePar.innerHTML = "Password Must be Between 5 and 30 character";
        passValidatePar.classList.add('text-danger')
        this.classList.add('is-invalid')
    }
    else {
        passValidatePar.innerHTML = "Looks Good";
        passValidatePar.classList.add('text-success')
        this.classList.add('is-valid')
    }
})

passInp.addEventListener('focus', function(e) {
    e.preventDefault()
    const passValidatePar = document.getElementById('passValidate')
    passValidatePar.innerHTML = "";
    passValidatePar.classList.remove('text-danger', 'text-success')
    this.classList.remove('is-invalid', "is-valid")
})