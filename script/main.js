const form = document.querySelector('.form');
const username = document.getElementById('name');
const email = document.getElementById('email');
const phone = document.getElementById('phone');
const image = document.getElementById('image');
const addWorker = document.querySelector('#addWorker')
const workers = JSON.parse(localStorage.getItem('workers')) || [];


addWorker.addEventListener("click", () => {
    let container = document.querySelector('.form-container');
    container.classList.add('show');
});

// Close form only when clicking outside the formDiv
document.addEventListener('click', (e) => {
    const formContainer = document.querySelector('.form-container');
    if (formContainer.classList.contains('show')&&
        !e.target.closest('.formDiv') &&
        e.target !== addWorker) 
    {
        formContainer.classList.remove('show');
    }
});



form.addEventListener('submit', e => {
    e.preventDefault();
    validateInputs();
    validateExperiences();

    const workerProfile = {
       
        name: document.getElementById('name').value,
        role: document.getElementById('role').value,
        image: document.getElementById('image').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        experiences: [] 
    };

    const experienceSections = document.querySelectorAll('.experience-section');
    
    experienceSections.forEach(section => {

        const titleInput = section.querySelector('[id^="title-"]');
        const companyInput = section.querySelector('[id^="company-"]');
        const startInput = section.querySelector('[id^="start-"]');
        const endInput = section.querySelector('[id^="end-"]');

        if (titleInput && titleInput.value.trim() !== '') {
            workerProfile.experiences.push({
                title: titleInput.value,
                company: companyInput ? companyInput.value : '',
                startDate: startInput ? startInput.value : '',
                endDate: endInput ? endInput.value : ''
            });
        }
    });

    workers.push(workerProfile);

    try {
        localStorage.setItem('workers', JSON.stringify(workers)); 
        alert('Worker profile saved successfully');
        resetForm() 
        document.getElementById('experiences-list').innerHTML = `
            <h3>Professional Experiences</h3>   `
        expCount = 1; 

    } catch (e) {
        console.error("Error saving to Local Storage:", e);
        alert("Failed to save data. Local Storage might be full or inaccessible.");
    }
});



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
    const usernameValue = username.value.trim();
    const emailValue = email.value.trim();
    const phoneValue = phone.value.trim();
    const imageValue = image.value.trim();

    // username
    if (usernameValue === '') {
        setError(username, 'Name is required');
    } 
    // email
    if (emailValue === '') {
        setError(email, 'Email is required');
    } else if (!isValidEmail(emailValue)) {
        setError(email, 'Provide a valid email');
    } 

    if (imageValue == '' && !isValidURL(imageValue)) {
        setError(image, 'Enter a valid URL');
    } 

    if (phoneValue == '' && !isValidPhone(phoneValue)) {
        setError(phone, 'Enter a valid phone number');
    } 
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