const form = document.querySelector('.form');
const username = document.getElementById('name');
const email = document.getElementById('email');
const phone = document.getElementById('phone');
const image = document.getElementById('image');
const addWorker = document.querySelector('#addWorker')
let workers = JSON.parse(localStorage.getItem('workers')) || [];
let id = workers.length > 0 ? workers[workers.length - 1].id + 1 : 1;
// popup available workers---------
let addingWorking = document.querySelector('.added_workers');
let divBox = document.querySelector('.added_workers .flex')


let tempWorkers = [...workers];       // used in selection popup
let tempMainWorkers = [...workers];   // used in main workers list





addWorker.addEventListener("click", () => {
    let container = document.querySelector('.form-container');
    container.classList.add('show');
    addingWorking.classList.remove('show')
});

const image_input = document.querySelector('#image')
image_input.addEventListener("change",()=>{
    console.log('text')
    const image =  document.querySelector("#image-input")
    image.src = image_input.value 
})
// Close form only when clicking outside the formDiv
document.addEventListener('click', (e) => {
    const formContainer = document.querySelector('.form-container');
    if (formContainer.classList.contains('show')&&
        !e.target.closest('.formDiv') &&
        e.target !== addWorker) 
    {
        formContainer.classList.remove('show');
    }
   // ---- CLOSE MODAL WHEN CLICKING OUTSIDE ----
    if (modal.classList.contains('show')) {
        const clickInsideModal = e.target.closest('.modal') !== null;

        if (!clickInsideModal) {
            modal.classList.remove('show');
        }
    }
    if (addingWorking.classList.contains('show')) {
        const clickInsideModal = e.target.closest('.added_workers') !== null;

        if (!clickInsideModal) {
            addingWorking.classList.remove('show');
        }
    }
});



form.addEventListener('submit', e => {
    e.preventDefault();

    if (!validateInputs() || !validateExperiences()) {
        return;
    }

    const workerProfile = {
        id: id++,  // make sure id is initialized correctly
        name: document.getElementById('name').value.trim(),
        role: document.getElementById('role').value.trim(),
        image: document.getElementById('image').value.trim(),
        email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        experiences: []
    };

    const experienceSections = document.querySelectorAll('.experience-section');

    experienceSections.forEach(section => {
        const titleInput   = section.querySelector('[id^="title-"]');
        const companyInput = section.querySelector('[id^="company-"]');
        const startInput   = section.querySelector('[id^="start-"]');
        const endInput     = section.querySelector('[id^="end-"]');

        if (titleInput && titleInput.value.trim() !== '') {
            workerProfile.experiences.push({
                title: titleInput.value.trim(),
                company: companyInput ? companyInput.value.trim() : "",
                startDate: startInput ? startInput.value : "",
                endDate: endInput ? endInput.value : ""
            });
        }
    });

    workers.push(workerProfile);

    try {
        localStorage.setItem('workers', JSON.stringify(workers));
        alert('Worker profile saved successfully');
        document.querySelector('.workers').innerHTML = "";
        loadWorkers();
        resetForm();

        document.getElementById('experiences-list').innerHTML = `
            <h3>Professional Experiences</h3>
        `;
        expCount = 1;

    } catch (err) {
        console.error("Error saving to Local Storage:", err);
        alert("Failed to save data. Local Storage might be full or inaccessible.");
    }
});

function loadWorkers() {
    const container = document.querySelector('.workers');
    container.innerHTML = ""; // clear first!

    tempMainWorkers.forEach(worker => {
        const div = document.createElement('div');
        div.className = 'profile-item flex';

        div.innerHTML = `
            <div class="profile-avatar">
                <img src=${worker.image} alt="User">
            </div>
            <div>
                <p class="profile-name">Name: <span>${worker.name}</span></p>
                <p class="profile-name">Role: <span>${worker.role}</span></p>
            </div>
        `;

        container.appendChild(div);
    });
}
loadWorkers()


const setError = (element, message) => {
    const inputControl = element.parentElement;
    const errorDisplay = inputControl.querySelector('.error');

    errorDisplay.innerText = message;
    inputControl.classList.add('error');
    inputControl.classList.remove('success');
};

const setSuccess = element => {
    const inputControl = element.parentElement;
    const errorDisplay = inputControl.querySelector('.error');

    errorDisplay.innerText = '';
    inputControl.classList.add('success');
    inputControl.classList.remove('error');
};

// ---- Regex Validators ----
const isValidEmail = email => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email.toLowerCase());
};

const isValidURL = url => {
    const re = /^(https?:\/\/)[\w.-]+\.[a-z]{2,}.*$/i;
    return re.test(url);
};

const isValidPhone = phone => {
    const re = /^\+?\d[\d\s-]{7,}$/; 
    return re.test(phone);
};

// ---- Validation Logic ----
const validateInputs = () => {
    let isValid = true;
    const usernameValue = username.value.trim();
    const emailValue = email.value.trim();
    const phoneValue = phone.value.trim();
    const imageValue = image.value.trim();

    // username
    if (usernameValue === '') {
        setError(username, 'Name is required');
        isValid = false;
    } 

    if (emailValue === '') {
        setError(email, 'Email is required');
        isValid = false;
    } else if (!isValidEmail(emailValue)) {
        setError(email, 'Provide a valid email');
        isValid = false;
    } 

    if (imageValue == '' && !isValidURL(imageValue)) {
        setError(image, 'Enter a valid URL');
        isValid = false;
    } 

    if (phoneValue == '' && !isValidPhone(phoneValue)) {
        setError(phone, 'Enter a valid phone number');
        isValid = false;
    } 
    return isValid
};


function validateExperiences() {
    let isValid = true;

    // select all experience sections
    const sections = document.querySelectorAll('.experience-section');

    sections.forEach(section => {
        const expId = section.getAttribute('data-exp-id');

        const title = document.querySelector(`#title-${expId}`);
        const company = document.querySelector(`#company-${expId}`);
        const start = document.querySelector(`#start-${expId}`);
        const end = document.querySelector(`#end-${expId}`);

        // reset errors
        section.querySelectorAll('.error').forEach(err => err.innerText = '');

        // Title validation
        if (title.value.trim() === "") {
            title.nextElementSibling.innerText = "Job title is required.";
            isValid = false;
        }

        // Company validation
        if (company.value.trim() === "") {
            company.nextElementSibling.innerText = "Company name is required.";
            isValid = false;
        }

        // Start date
        if (start.value === "") {
            start.nextElementSibling.innerText = "Start date is required.";
            isValid = false;
        }

        // End date
        if (end.value === "") {
            end.nextElementSibling.innerText = "End date is required.";
            isValid = false;
        }

        // Validate chronological order
        if (start.value && end.value && end.value < start.value) {
            end.nextElementSibling.innerText = "End date must be after the start date.";
            isValid = false;
        }
    });

    return isValid;
}

const resetForm = ()=>{
    username.value = '';
    email.value = '';
    phone.value = '';
    image.value = '';
}


let expCount = 1; 
// add experience dynamically--------
function addExperience() {
    const list = document.getElementById('experiences-list');
    
    // Create the new experience HTML structure
    const newExp = document.createElement('div');
    newExp.className = 'experience-section';
    newExp.setAttribute('data-exp-id', expCount);
    
    newExp.innerHTML = `
        <hr style="margin: 15px 0; border: none; border-top: 1px dashed var(--border-color);">

        <div class="experience-header">
            <label>Experience #${expCount}</label>
            <button type="button" class="btn-remove" onclick="removeExperience(${expCount})">Remove</button>
        </div>

        <div class="form-group">
            <label for="title-${expCount}">Job Title</label>
            <input type="text" id="title-${expCount}" name="experience[${expCount}][title]" required>
            <div class="error"></div>
        </div>

        <div class="form-group">
            <label for="company-${expCount}">Company</label>
            <input type="text" id="company-${expCount}" name="experience[${expCount}][company]" required>
            <div class="error"></div>
        </div>

        <div class="exp-row">
            <div class="form-group">
                <label for="start-${expCount}">Start Date</label>
                <input type="date" id="start-${expCount}" name="experience[${expCount}][start]">
                <div class="error"></div>
            </div>
            <div class="form-group">
                <label for="end-${expCount}">End Date</label>
                <input type="date" id="end-${expCount}" name="experience[${expCount}][end]">
                <div class="error"></div>
            </div>
        </div>
    `;
    list.appendChild(newExp);
    expCount++;
}

function removeExperience(id) {
    const expElement = document.querySelector(`.experience-section[data-exp-id="${id}"]`);
    if (expElement) {
      expElement.remove();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const initialSections = document.querySelectorAll('.experience-section');
    if (initialSections.length > 0) {
        
        expCount = parseInt(initialSections[initialSections.length - 1].getAttribute('data-exp-id')) || 1;
    }
});









let selectedRole = null;
let selectedItemsDiv = null;



// show available workers in popup---------
function loadWorkersList(list) {
    divBox.innerHTML = "";

    list.forEach(worker => {
        const div = document.createElement('div');
        div.className = 'profile-item flex';

        div.innerHTML = `
            <div class="profile-avatar">
                <img src=${worker.image} alt="User">
            </div>
            <div>
                <p class="profile-name"><span>${worker.name}</span></p>
            </div>
            <span class="add worker-add"><i class="fa-solid fa-plus"></i>Add</span>
        `;
        divBox.appendChild(div);

        div.querySelector('.worker-add').addEventListener('click', () => {
        const added = addWorkerToItems(worker);
        if (!added) return;
            removeFromTemp(worker); 
            filterAndLoad(selectedRole);
        });
    });
}



function removeFromTemp(worker) {
    // return the only items that not equal id to worker id ------
    tempWorkers = tempWorkers.filter(w => w.id !== worker.id);

    tempMainWorkers = tempMainWorkers.filter(w => w.id !== worker.id);
    // update main display immediately
    loadWorkers();
}



// add worker button--------
let addbtn = document.querySelectorAll('.floorPlan .add');
addbtn.forEach(btn => {
    btn.addEventListener('click', (e) => {
        addingWorking.classList.toggle('show')
        e.stopPropagation();
        const container = e.target.closest('.boxItem');
        selectedRole = container.dataset.role;
        selectedItemsDiv = container.querySelector('.items');
        filterAndLoad(selectedRole);
    });
});

function filterAndLoad(role) {
    let result = [];

    switch (role) {
        case "it":
            result = tempWorkers.filter(w => w.role === "it" || w.role === "manager" || w.role === "cleaner");
            break;
        case "security":
            result = tempWorkers.filter(w => w.role === "security" || w.role === "manager" || w.role === "cleaner");
            break;

        case "reception":
            result = tempWorkers.filter(w => w.role === "receptionist" || w.role === "manager" || w.role === "cleaner");
            break;
        case "conference":
            result = tempWorkers.filter(w => w.role === "receptionist" || w.role === "security" || w.role === "manager" || w.role === "it" || w.role === "cleaner" || w.role ==='other');
            break;
        case "archive":
            result = tempWorkers.filter(w => w.role === "manager");
            break;
        case "stuff":
            result = tempWorkers.filter(w => w.role === "manager" || w.role === "receptionist" || w.role === "cleaner");
            break;
        default:
            result = [];
    }

    loadWorkersList(result);
}

// add workers to modal-----------
let modal = document.querySelector('.modal')
function addWorkerToItems(worker) {
    if (!selectedItemsDiv) return;
    // get parent boxItem
    const boxItem = selectedItemsDiv.closest(".boxItem");
    // read max allowed
    const max = parseInt(boxItem.dataset.max);

    const currentCount = selectedItemsDiv.querySelectorAll(".added-worker").length;

    // 🚫 limit reached
    if (currentCount >= max) {
        alert(`Maximum number reached (${max}) for this section!`);
        return  false;;
    }

    // ---------- add worker normally ----------
    const item = document.createElement('div');
    item.className = "added-worker profile-item flex";

    item.innerHTML = `
        <div class="profile-avatar image">
            <img src=${worker.image} alt="User">
        </div>
        <span class="remove"><i class="fa-solid fa-delete-left"></i></span>
    `;

    selectedItemsDiv.appendChild(item);

    // open modal on click
    item.querySelector('.profile-avatar').addEventListener('click', (e) => {
        e.stopPropagation();
        modal.classList.add('show');
        modal.querySelectorAll('.profile-item').forEach(el => el.remove());

        const profile = document.createElement('div');
        profile.className = "profile-item flex";

        profile.innerHTML = `
            <div class="profile-avatar">
               <img src=${worker.image} alt="User">
            </div>
            <div>
                <p class="profile-name">Name: <span>${worker.name}</span></p>
                <p class="profile-name">Position: <span>${worker.role}</span></p>
                <p class="profile-name">Email: <span>${worker.email}</span></p>
                <p class="profile-name">Phone Number: <span>${worker.phone}</span></p>
            </div>
        `;
        modal.append(profile);
    });

    // remove button
    item.querySelector('.remove').addEventListener('click', () => {
        if (!tempWorkers.some(w => w.id === worker.id)) {
            tempWorkers.push(worker);
        }
        if (!tempMainWorkers.some(w => w.id === worker.id)) {
            tempMainWorkers.push(worker);
        }
        loadWorkers();
        filterAndLoad(selectedRole);
        item.remove();
    });
     return true; 
}




