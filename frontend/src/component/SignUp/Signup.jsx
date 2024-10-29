import React, { useState } from 'react';
import './Signup.css';

const Signup = () => {
    const [formData, setFormData] = useState({
        username: '',
        fullname: '',
        email: '',
        password: '',
        avatar: null,
        coverImage: null,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        const file = files[0];
        
        if (file) {
            setFormData((prevData) => ({ ...prevData, [name]: file }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();
        data.append('username', formData.username);
        data.append('fullname', formData.fullname);
        data.append('email', formData.email);
        data.append('password', formData.password);
        if (formData.avatar) data.append('avatar', formData.avatar);
        if (formData.coverImage) data.append('coverImage', formData.coverImage);
         console.log(data)
        try {
            const response = await fetch('http://localhost:8000/api/v1/users/register', {
                method: 'POST',
                body: data,
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Signup successful:', result);
            } else {
                console.error('Signup failed:', response.statusText);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="signup-container">
            <h2>Sign Up</h2>
            <form onSubmit={handleSubmit} className="signup-form" encType="multipart/form-data">
                <label>
                    Username:
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    Full Name:
                    <input
                        type="text"
                        name="fullname"
                        value={formData.fullname}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    Email:
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    Password:
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    Avatar:
                    <input
                        type="file"
                        name="avatar"
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                </label>
                <label>
                    Cover Image:
                    <input
                        type="file"
                        name="coverImage"
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                </label>
                <button type="submit">Sign Up</button>
            </form>
        </div>
    );
};

export default Signup;
