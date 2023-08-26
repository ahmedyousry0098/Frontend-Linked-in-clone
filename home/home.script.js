let allPosts = []

window.onload = async function() {
    initLoadingPage()
    const response = await getPosts()
    const {posts} = await response.json()
    allPosts = posts
    console.log(allPosts);
    document.getElementById('postContainer').innerHTML = ""
    initPost()
    initSuggContacts()
    initProfileDetails()
}

function getToken() {
    const token = localStorage.getItem('userToken');
    const prefix = 'Bearer__'
    return `${prefix}${token}`
}

function getLloggedUserId () {
    return localStorage.getItem('userId')
}

async function getPosts () {
    const response = await fetch('http://localhost:8000/linkedin/posts', {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            authorization: getToken()
        }
    })
    return response
}

async function getPost() {
    const response = await fetch(`http://localhost:8000/linkedin/posts/`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            authorization: getToken()
        }
    })
    return response
}

async function refreshPosts() {
    const {posts} = await getPost().then(res => res.json())
    allPosts = posts
    console.log(allPosts);
    initPost()
}

async function getUsers () {
    const response = await fetch('http://localhost:8000/linkedin/profile/users', {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            authorization: getToken()
        }
    })
    return response
}

async function getUser () {
    const response = await fetch('http://localhost:8000/linkedin/profile/user', {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            authorization: getToken()
        }
    })
    return response
}

async function createPost(content, image) {
    const formData = new FormData()
    content && formData.append('content', content)
    image && formData.append('image', image)
    const response = await fetch('http://localhost:8000/linkedin/posts/create', {
        method: 'POST', 
        headers: {
            authorization: getToken()
        },
        body: formData
    })
    return response
}

async function toggleLike ({postId, action}) {
    const response = await fetch(`http://localhost:8000/linkedin/posts/${postId}/${action}`, {
        method: 'PATCH',
        headers: {
            "Content-Type": "application/json",
            authorization: getToken()
        }
    })
    return response
}

async function handleLike(postId, likes) {
    const userId = getLloggedUserId()
    const likesList = likes.replace("'", "").split(",").map(id => id.toString())
    const action = likesList.includes(userId) ? 'unlike' : 'like';
    const response = await toggleLike({postId, action})
    if (response.ok) {
        refreshPosts()
    } else {
        alert('something went wrong please try again')
    }
}

function initLoadingPage() {
    document.getElementById('postContainer').innerHTML = `
        <div class="spinner-border text-primary top-100" role="status" style="">
            <span class="visually-hidden">Loading...</span>
        </div>
    `
}

function initPost() {
    const postContainer = document.querySelector('#postContainer')
    postContainer.innerHTML = ""
    const loggedUserId = getLloggedUserId()
    for (let post of allPosts.reverse()) {
        postContainer.innerHTML += `
            <div class="d-flex flex-column post-container mb-2 rounded-4" >
                <div class="d-flex flex-row justify-content-start align-items-center mb-2 p-3" style="">
                    <img height="50px" width="50px" class="border border-2 p-1 me-3 user-img" src="https://static.vecteezy.com/system/resources/previews/000/439/863/original/vector-users-icon.jpg">
                    <div class="my-0">
                        <div>
                            <p class="username-txt fw-bold pb-0">${post.user[0].username}</p>
                            <p class="position-txt">${post.user[0].position}</p>
                            <p class="position-txt"><i class="fa-solid fa-earth-americas me-2"></i>${new Date(post.createdAt).toUTCString()}</p>
                        </div>
                    </div>
                </div>
                <div class="d-flex flex-column mb-2">
                    <p class="px-3">${post?.content}</p>
                    <img src="${post?.image?.secure_url}" class="post-img" >
                </div>
                <div class="mx-3 my-1 d-flex flex-row align-items-center">
                    <i class="fa-solid fa-thumbs-up mx-1" style="color: blue"></i>
                    <p class="mb-0" style="font-size:12px">${post.like.length} people like this</p>
                </div>
                <div class="row px-3 py-2 border-top">
                    <button onclick="handleLike('${post._id}', '${post.like}')" class="col-6 post-interaction border-0 d-flex flex-row justify-content-center align-items-center py-2 interact-post" ">
                        <i id="${post._id}" class="${post.like.includes(loggedUserId)? "fa-solid": "fa-regular"} fa-thumbs-up fa-lg" style="color:#666666"></i>
                        <p class="mb-0 ms-2 fw-bold" style="color:#666666"> Like </p>
                    </button>
                    <button class="col-6 post-interaction border-0 d-flex flex-row justify-content-center align-items-center py-2" style="color:#666666">
                        <i class="fa-regular fa-comment fa-lg" ></i>
                        <p class="mb-0 ms-2 fw-bold" style="color:#666666"> Comment </p>
                    </button>
                </div>
                <div class="w-100 d-flex flex-column comment-container"> 
                    ${post.comments.length? initComments(post): ""}
                </div>
            </div>
        `
    }
}

function initComments(post) {
    let html = ``;
    for (let comment of post.comments) {
        html += `
            <div class="d-flex flex-row justify-content-start align-items-center mb-0 p-1 mx-3 comment-container" style="">
                <img height="50px" width="50px" class="border border-2 p-1 me-3 user-img" src="https://static.vecteezy.com/system/resources/previews/000/439/863/original/vector-users-icon.jpg">
                <div class="my-0">
                    <div>
                        <p class="username-txt fw-bold pb-0">Hi</p>
                        <p class="position-txt">MEARN Stack Developer</p>
                    </div>
                </div>
            </div>
            <div class="d-flex align-items-center flex-column mb-2">
                <p class="px-3">${comment?.content}</p>
            </div>
        `
    }
    return html
}

async function initSuggContacts() {
    const container = document.getElementById('SuggContacts')
    const usersResponse = await getUsers()
    const parsedResponse = await usersResponse.json()
    for (let user of parsedResponse.users.slice(3, 6)) {
        container.innerHTML += `
            <div class="d-flex flex-row justify-content-between align-items-center mb-0 p-1 mx-3 py-3">
                <img height="50px" width="50px" class="border border-2 p-1 me-3 user-img" src="https://static.vecteezy.com/system/resources/previews/000/439/863/original/vector-users-icon.jpg">
                <div class="my-0 d-flex flex-column w-75">
                    <div class="d-flex flex-column">
                        <p class="username-txt fw-bold pb-0">${user.username}</p>
                        <p class="position-txt">${user.position}</p>
                    </div>
                </div>
                <button class="btn btn-outline-dark rounded">
                    contact
                </button>
            </div>
        `
    }
}

async function initProfileDetails() {
    const profileDetailsContainer = document.getElementById('profileDetails')
    const response = await getUser()
    const parsedResponse = await response.json()
    profileDetailsContainer.innerHTML = `
        <div class="d-flex flex-column justify-content-center align-items-center" style="z-index:0">
            <img src="https://img.freepik.com/free-photo/gradient-dark-blue-futuristic-digital-grid-background_53876-129728.jpg?w=2000" class="w-100 top-0 " style="z-index: 1; border-top-left-radius: 15px; border-top-right-radius: 15px;">
            <img height="50px" width="50px" class="border border-2 p-1 me-3 user-img align-self-center" src="https://static.vecteezy.com/system/resources/previews/000/439/863/original/vector-users-icon.jpg" style="z-index:2; margin-top: -30px">
            <div class="my-2">
                <div class="d-flex flex-column justify-content-center">
                    <p class="username-txt fw-bold pb-0">${parsedResponse.user.username}</p>
                    <p class="position-txt">${parsedResponse.user.position}</p>
                </div>
            </div>
            <div class="my-0 w-100">
                <div class="d-flex flex-row align-items-between justify-content-between p-2 border-top">
                    <p class=" pb-0">Who's viewed your profile</p>
                    <p class="mb-0 fw-bold" style="font-size: 12px; color: blue"> 32 </p>
                </div>
            </div>
        </div>
    `
}

document.querySelector('#postInput').addEventListener('click', async function() {
    const response = await getUser()
    const {user} = await response.json()
    document.getElementById('txtAreaContainer').classList.remove('d-none')
    initPostTextArea(user, false)
})

document.querySelector('#photoPost').addEventListener('click', async function() {
    const response = await getUser()
    const {user} = await response.json()
    document.getElementById('txtAreaContainer').classList.remove('d-none')
    initPostTextArea(user, true)
})


function initPostTextArea(user, media=false) {
    const container = document.getElementById('postTextArea')
    container.innerHTML = `
        <div class="d-flex flex-row justify-content-start align-items-center mb-2 p-3 position-relative" style="">
            <img height="50px" width="50px" class="border border-2 p-1 me-3 user-img" src="https://static.vecteezy.com/system/resources/previews/000/439/863/original/vector-users-icon.jpg">
            <div class="my-0">
                <div>
                    <p class="username-txt fw-bold pb-0">${user.username}</p>
                    <p class="position-txt">Post To Anyone</p>
                </div>
            </div>
            <div id="closePostPopup" class="position-absolute end-0 m-3 p-4 z-2">
                <i class="fa-solid fa-x"></i>
            </div>
        </div>
        <textarea id="postContent" placeholder="What do you want to talk about?" class="w-100 h-50 border-0 p-3 flex-shrink-1"></textarea>
        
        <input type="file" id="uploadImg" accept="image/*" name="media" class="ms-3 btn">
        <hr>
        <div class="d-flex flex-row justify-content-end align-items-center">
            <button id="submitPost" class="btn btn-outline-primary me-3 mb-3 disabled" disabled>
                post
            </button>
        </div>
    `;

    document.body.style.setProperty('overflow', 'hidden')
    const imageInput = document.getElementById('uploadImg')
    const txtArea = document.getElementById('postContent')
    const submitBtn = document.getElementById('submitPost')
    function validatePost() {
        if (txtArea.value) {
            submitBtn.classList.remove('disabled')
            submitBtn.disabled = false;
        } else {
            submitBtn.classList.add('disabled')
            submitBtn.disabled = true
        }
    }
    txtArea.addEventListener('input', validatePost)
    submitBtn.addEventListener('click', async function() {
        this.innerHTML = `
            <div class="spinner-border text-primary top-100" role="status" style="">
                <span class="visually-hidden">Loading...</span>
            </div>`
        const image = imageInput.files[0]
        const content = txtArea.value
        const response = await createPost(content, image)
        if (response.ok) {
            this.innerHTML = "<p>Done</p>"
            window.location.reload()
        } else {
            this.innerHTML = '<p>Post</p>'
        }
    })
    document.getElementById('closePostPopup').addEventListener('click', function(e) {
        document.getElementById('txtAreaContainer').classList.add('d-none');
        document.body.style.removeProperty('overflow', 'hidden')    
    })

    media && imageInput.click()
}

document.getElementById('txtAreaContainer').addEventListener('click', function() {
    this.classList.add('d-none');
    document.body.style.removeProperty('overflow', 'hidden')    
})

document.getElementById('postTextArea').addEventListener('click', function(event) {
    event.stopPropagation()
}) 

// logout
document.getElementById('logout').addEventListener('click', async function() {
    localStorage.clear()
    open('../Authentication/login/login.html', '_self')
})

// function checkScreenWidth() {
//     if (window.innerWidth < 770) {
//         document.getElementById('searchIcon').addEventListener('click', function() {
//             document.getElementById('navbar-sec').classList.add('d-none')
//             document.querySelector('[type="search"]').classList.remove('d-none')
//             document.getElementById('mainSearch').classList.add('active-search')
//         })
//     }
// }

// window.addEventListener('resize', checkScreenWidth)