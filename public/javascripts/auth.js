document.addEventListener('DOMContentLoaded', () => {
    //  to validate email address
    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    //  to validate phone number
    const validatePhone = (phone) => {
        const re = /^\d{10}$/;
        return re.test(phone);
    }

    // Submit Signup Form
    const signupForm = document.getElementById('signupForm');
    signupForm.addEventListener('submit', (event) => {
        event.preventDefault();

        // Validate fields
        const signUpName = document.getElementById('signUpName').value;
        const signUpEmail = document.getElementById('signUpEmail').value;
        const signUpPhone = document.getElementById('signUpPhone').value;
        const signUpPassword = document.getElementById('signUpPassword').value;
        const signUpcPassword = document.getElementById('signUpcPassword').value;

        if (signUpName.trim() === '') {
            alert('Please enter a name');
            return;
        }

        if (signUpEmail.trim() === '' || !validateEmail(signUpEmail)) {
            alert('Please enter a valid email address');
            return;
        }

        if (signUpPhone.trim() === '' || !validatePhone(signUpPhone)) {
            alert('Please enter a valid phone number');
            return;
        }

        if (signUpPassword.trim() === '') {
            alert('Please enter a password');
            return;
        }

        if (signUpPassword !== signUpcPassword) {
            alert('Passwords do not match');
            return;
        }

        fetch("/backend/createUser", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: signUpName,
                email: signUpEmail,
                phone: signUpPhone,
                password: signUpPassword
            }),
        }).then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        }).then(res => {
            if (res.success) {
                alert(res.data.message);
                window.location.href = "/";
            } else {
                alert(res.error);
            }
        }).catch(error => {
            console.error('Error:', error);
        });
    });

    // Submit Login Form
    const loginForm = document.getElementById('loginForm');
    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const loginEmail = document.getElementById('loginEmail').value;
        const loginPassword = document.getElementById('loginPassword').value;

        fetch("/backend/verifyUser", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: loginEmail,
                password: loginPassword
            }),
        }).then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        }).then(res => {
            if (res.success) {
                localStorage.setItem("userName", res.data.name);
                window.location.href = "/chat-room";
            } else {
                alert(res.error);
            }
        }).catch(error => {
            console.error('Error:', error);
        });
    });
});
