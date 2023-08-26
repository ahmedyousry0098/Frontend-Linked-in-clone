const emailInp = document.getElementById('emailInput')
const passInp = document.getElementById('passInput')
const agreeBtn = document.getElementById('agreeBtn')
const alertStatus = document.querySelector('[role="alert"]')

const validateEmail = (email) => {
    const pattern = /^[A-Za-z0-9._]{3,25}@(gmail|outlook|yahoo).(com|org|net)$/
    return pattern.test(email)
}

const validatePass = (password) => {
    const pattern = /^[A-Za-z0-9@-_$%]{5,30}$/
    return pattern.test(password)
}

const resetInput = (resetValue, ...input) => {
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

const disAppearAlert = (alertDiv, duration=3000) => {
    return setTimeout(function() {
        alertDiv.innerHTML = ''
        alertDiv.classList.remove('alert-success', 'alert-danger')
        alertDiv.classList.add('d-none')
    }, duration)
}

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

emailInp.addEventListener('focus', function(e) {
    e.preventDefault()
    resetInput(false, this)
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

passInp.addEventListener('focus', function(e) {
    e.preventDefault()
    resetInput(false, this)
})

function realTimeValidate() {
    const [email, password] = [emailInp.value, passInp.value]
    if ( !validateEmail(email) || !validatePass(password) ) {
        agreeBtn.disabled = true;
        agreeBtn.classList.replace('btn-primary', 'disabled')
    } else {
        agreeBtn.disabled = false
        agreeBtn.classList.replace('disabled', 'btn-primary')
    }
}

[emailInp, passInp].forEach(inp => inp.addEventListener('input', realTimeValidate))

async function action(endpoint, email, password) {
    const response = await fetch(`http://localhost:8000/linkedin/${endpoint}`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email,
            password
        }),
    })
    .catch(err => console.log(err))
    return response
}

async function handleLogin () {
    toggleDisableBtn(agreeBtn, true)
    const email = document.getElementById('emailInput').value
    const password = document.getElementById('passInput').value
    const response = await action('login', email, password);
    const parsedRes = await response.json()
    if (response.ok && parsedRes.token && parsedRes.id) {
        localStorage.setItem('userToken', parsedRes.token)
        localStorage.setItem('userId', parsedRes.id)
        window.open('../../home/home.html', '_self')
    } else {
        alertStatus.classList.remove('d-none')
        alertStatus.innerHTML = parsedRes.message || '<p>Something Went Wrong Please Try Again!</p>';
        alertStatus.classList.add('alert-danger')
        toggleDisableBtn(agreeBtn, false, 'Sign In')
        disAppearAlert(alertStatus, 5000)
    }
}