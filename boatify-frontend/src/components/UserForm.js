import { Link, useNavigate } from 'react-router-dom';
import '../styles/UserForm.css';

const UserForm = ({ isSignUp }) => {
    const navigate = useNavigate();

    const checkPasswordEquality = () => {
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        return password === confirmPassword;
    };

    const isPasswordValid = () => {
        const password = document.getElementById('password').value;

        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        const hasNumber = /[0-9]/.test(password);

        const isValid = password.length >= 8 && hasUpperCase && hasLowerCase && hasSpecialChar && hasNumber;

        if (!isValid) {
            alert('Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one special character, and one number.');
        }

        return isValid;
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (isSignUp && !checkPasswordEquality()) {
            alert('Passwords do not match!');
            return;
        }

        if (isSignUp && !isPasswordValid()) {
            return;
        }

        const formData = {
            firstName: isSignUp ? document.getElementById('firstName').value : undefined,
            lastName: isSignUp ? document.getElementById('lastName').value : undefined,
            email: isSignUp ? document.getElementById('email').value : undefined,
            phone: isSignUp ? document.getElementById('phone').value : undefined,
            username: isSignUp ? document.getElementById('username').value : undefined,
            identifier: !isSignUp ? document.getElementById('username-or-email').value : undefined,
            password: document.getElementById('password').value,
        };

        try {
            const baseUrl = 'http://localhost:3001';
            const endpoint = isSignUp ? '/register' : '/login';
            const response = await fetch(`${baseUrl}${endpoint}`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.message || 'An unexpected error occurred');
                return;
            }

            if (isSignUp && checkPasswordEquality) {
                event.target.reset();
                navigate('/login');
                alert('Registration successful! You can now log in.');
            } else {
                event.target.reset();
                navigate('/home');
                alert('Login successful! Welcome back.');
            }
        } catch (error) {
            console.error('Error during API request:', error);
            alert('An error occurred. Please try again.');
        }
    };

    return (
        <div className='user-form-container'>
            <form onSubmit={handleSubmit} className="user-form">
                <h1 className="form-title">{isSignUp ? 'Sign Up' : 'Sign In'}</h1>
                {isSignUp && (
                    <div>
                        <div className="form-group">
                            <label htmlFor="firstName">First Name:</label>
                            <input type="text" id="firstName" required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="lastName">Last Name:</label>
                            <input type="text" id="lastName" required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email:</label>
                            <input type="email" id="email" required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="phone">Phone Number:</label>
                            <input type="tel" id="phone" required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="username">Username:</label>
                            <input type="text" id="username" required />
                        </div>
                    </div>
                )}
                {!isSignUp && (
                    <div className="form-group">
                        <label htmlFor="username-or-email">Username or email:</label>
                        <input type="text" id="username-or-email" required />
                    </div>
                )}
                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input type="password" id="password" required />
                </div>
                {isSignUp && (
                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm Password:</label>
                        <input type="password" id="confirmPassword" required />
                    </div>
                )}
                <div className="button-group">
                    <button type="submit">{isSignUp ? 'Sign Up' : 'Sign In'}</button>
                </div>
                <div className="link-group">
                    {isSignUp ? (
                        <Link to="/login">Back to Sign In</Link>
                    ) : (
                        <Link to="/register">Sign Up</Link>
                    )}
                </div>
            </form>
        </div>
    );
};

export default UserForm;
