const emailInp = document.getElementById('emailInput')
const passInp = document.getElementById('passInput')
const usernameInp = document.getElementById('usernameInput')
const positionInput = document.getElementById('positionInput')
const agreeBtn = document.getElementById('agreeBtn')
const alertStatus = document.querySelector('[role="alert"]')

const validateUsername = (username) => {
    const pattern = /^[a-zA-Z0-9]{3,}( [a-zA-Z0-9]{3,}){0,2}$/
    return pattern.test(username)
}

const validatePosition = (username) => {
    const pattern = /^[a-zA-Z0-9]+( [a-zA-Z0-9]+){0,5}$/
    return pattern.test(username)
}

const validateEmail = (email) => {
    const pattern = /^[A-Za-z0-9._]{3,25}@(gmail|outlook|yahoo).(com|org|net)$/
    return pattern.test(email)
}

const validatePass = (password) => {
    const pattern = /^[A-Za-z0-9@-_$%]{5,30}$/
    return pattern.test(password)
}

const resetInput = (resetValue=false, ...input) => {
    for (let inp of input) {
        if (resetValue) {
            inp.value = ""
        }
        const validatePar = inp.nextElementSibling
        validatePar.innerHTML = "";
        validatePar.classList.remove('text-danger', 'text-success')
        inp.classList.remove('is-invalid', "is-valid", "border-danger", 'border-success')
        inp.classList.add('border-black')
    }
}

const toggleDisableBtn = (btn, isDisable, title="") => {
    btn.setAttribute('disable', isDisable)
    if (isDisable) {
        btn.classList.replace('btn-primary', 'disabled')
        btn.innerHTML = `<div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>`
    } else {
        btn.classList.replace('disabled', 'btn-primary')
        btn.innerHTML = `${title}`
    }
}

const disAppearAlert = (alertDiv, duration=3500) => {
    return setTimeout(function() {
        alertDiv.innerHTML = ''
        alertDiv.classList.remove('alert-success', 'alert-danger')
        alertDiv.classList.add('d-none')
    }, duration)
}

usernameInp.addEventListener('blur', function (e) {
    e.preventDefault()
    const usernameValidationPar = document.getElementById('usernameValidate')
    if (!validateUsername(this.value)) {
        usernameValidationPar.innerHTML = "In-valid username";
        usernameValidationPar.classList.add('text-danger')
        this.classList.add('is-invalid')
        this.classList.replace('border-black', 'border-danger')
    }
    else {
        usernameValidationPar.innerHTML = "Looks Good";
        usernameValidationPar.classList.add('text-success')
        this.classList.add('is-valid')
        this.classList.replace('border-danger', 'border-black')
    }
})

positionInput.addEventListener('blur', function (e) {
    e.preventDefault()
    const positionValidationPar = document.getElementById('positionValidate')
    if (!validatePosition(this.value)) {
        positionValidationPar.innerHTML = "In-valid Position";
        positionValidationPar.classList.add('text-danger')
        this.classList.add('is-invalid')
        this.classList.replace('border-black', 'border-danger')
    }
    else {
        positionValidationPar.innerHTML = "Looks Good";
        positionValidationPar.classList.add('text-success')
        this.classList.add('is-valid')
        this.classList.replace('border-danger', 'border-black')
    }
})

emailInp.addEventListener('blur', function (e) {
    e.preventDefault()
    const emailValidatePar = document.getElementById('emailValidate')
    if (!validateEmail(this.value)) {
        emailValidatePar.innerHTML = "In-valid Email";
        emailValidatePar.classList.add('text-danger')
        this.classList.add('is-invalid')
        this.classList.replace('border-black', 'border-danger')
    }
    else {
        emailValidatePar.innerHTML = "Looks Good";
        emailValidatePar.classList.add('text-success')
        this.classList.add('is-valid')
        this.classList.replace('border-danger', 'border-black')
    }
})

passInp.addEventListener('blur', function (e) {
    e.preventDefault()
    const passValidatePar = document.getElementById('passValidate')
    if (!validatePass(this.value)) {
        passValidatePar.innerHTML = "Password Must be Between 5 and 30 character";
        passValidatePar.classList.add('text-danger')
        this.classList.add('is-invalid')
        this.classList.replace('border-black', 'border-danger')
    }
    else {
        passValidatePar.innerHTML = "Looks Good";
        passValidatePar.classList.add('text-success')
        this.classList.add('is-valid')
        this.classList.replace('border-danger', 'border-black')
    }
})

for (let input of [usernameInp, emailInp, passInp, positionInput]) {
    input.addEventListener('focus', function(e) {
        e.preventDefault()
        resetInput(false, this)
    })
}


function realTimeValidate() {
    const [email, password, username, position] = [emailInp.value, passInp.value, usernameInp.value, positionInput.value]
    console.log(email, password, username, position);
    if ( !validateEmail(email) || !validatePass(password) || !validateUsername(username) || !validatePosition(position) ) {

        agreeBtn.disabled = true;
        agreeBtn.classList.replace('btn-primary', 'disabled')
    } else {
        agreeBtn.disabled = false
        agreeBtn.classList.replace('disabled', 'btn-primary')
    }
}

[emailInp, passInp, usernameInp, positionInput].forEach(inp => inp.addEventListener('input', realTimeValidate))

async function action(endpoint, email, password, username, position) {
    const response = await fetch(`http://localhost:8000/linkedin/${endpoint}`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email: email.toLowerCase(),
            password,
            username,
            position
        }),
    })
    .catch(err => console.log(err))
    return response
}

async function handleRegister() {
    toggleDisableBtn(agreeBtn, true)
    const [email, password, username, position] = [
        document.getElementById('emailInput').value, 
        document.getElementById('passInput').value,
        document.getElementById('usernameInput').value,
        document.getElementById('positionInput').value,
    ]
    const response = await action('register', email, password, username, position)
    const parsedRes = await response.json()
    alertStatus.classList.remove('d-none')
    if (response.ok) {
        alertStatus.innerHTML = parsedRes.message
        alertStatus.classList.add('alert-success')
        resetInput(true, emailInp, passInp)
    } else {
        alertStatus.innerHTML = parsedRes.message
        alertStatus.classList.add('alert-danger')
    }
    toggleDisableBtn(agreeBtn, false, 'Agree, Join')
    disAppearAlert(alertStatus, 5000)
}
