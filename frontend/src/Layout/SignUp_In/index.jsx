import React, { useState } from 'react'
import { UserRound, Mail, EyeClosed, Eye } from 'lucide-react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'
import './index.scss'
import Logo from '../../Components/Logo';

const SignUp_In = () => {
    const [isSignUp, setIsSignUp] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate();

    // Form data state
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    })

    // Field errors state
    const [fieldErrors, setFieldErrors] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    })

    // Tooltip visibility state
    const [showTooltip, setShowTooltip] = useState({
        name: false,
        email: false,
        password: false,
        confirmPassword: false
    })

    const API_BASE_URL = 'http://localhost:3000'

    const toggleForm = () => {
        setIsSignUp(!isSignUp)
        setFormData({
            name: '',
            email: '',
            password: '',
            confirmPassword: ''
        })
        setFieldErrors({
            name: '',
            email: '',
            password: '',
            confirmPassword: ''
        })
        setShowTooltip({
            name: false,
            email: false,
            password: false,
            confirmPassword: false
        })
    }

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword)
    }

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword)
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))

        // Clear error when user starts typing
        if (fieldErrors[name]) {
            setFieldErrors(prev => ({
                ...prev,
                [name]: ''
            }))
        }
    }

    const handleMouseEnter = (fieldName) => {
        if (fieldErrors[fieldName]) {
            setShowTooltip(prev => ({
                ...prev,
                [fieldName]: true
            }))
        }
    }

    const handleMouseLeave = (fieldName) => {
        setTimeout(() => {
            setShowTooltip(prev => ({
                ...prev,
                [fieldName]: false
            }))
        }, 100)
    }

    const validateForm = () => {
        const errors = {
            name: '',
            email: '',
            password: '',
            confirmPassword: ''
        }

        let isValid = true

        // Email validation
        if (!formData.email) {
            errors.email = 'Email is required'
            isValid = false
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            if (!emailRegex.test(formData.email)) {
                errors.email = 'Please enter a valid email address'
                isValid = false
            }
        }

        // Password validation
        if (!formData.password) {
            errors.password = 'Password is required'
            isValid = false
        } else if (isSignUp && formData.password.length < 6) {
            errors.password = 'Password must be at least 6 characters long'
            isValid = false
        }

        // Sign up specific validations
        if (isSignUp) {
            if (!formData.name) {
                errors.name = 'Name is required for sign up'
                isValid = false
            }

            if (!formData.confirmPassword) {
                errors.confirmPassword = 'Please confirm your password'
                isValid = false
            } else if (formData.password !== formData.confirmPassword) {
                errors.confirmPassword = 'Passwords do not match'
                isValid = false
            }
        }

        setFieldErrors(errors)
        return isValid
    }

    const handleSignUp = async () => {
        try {
            const response = await axios.post(`${API_BASE_URL}/user_signup`, {
                name: formData.name,
                email: formData.email,
                password: formData.password
            })
            
            if (response.status >= 400) {
                throw new Error(response.data.message || 'Failed to create account')
            }

            toast.success('Account created successfully! You can now sign in.')
            setFormData({
                name: '',
                email: '',
                password: '',
                confirmPassword: ''
            })
            
            // Auto switch to sign in after successful signup
            setTimeout(() => {
                setIsSignUp(false)
            }, 2000)

        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || 'An error occurred during sign up'
            
            // Check if it's a specific field error from server
            if (err.response?.data?.field) {
                setFieldErrors(prev => ({
                    ...prev,
                    [err.response.data.field]: errorMessage
                }))
            } else {
                // Show generic server errors as toast
                toast.error(errorMessage)
            }
        }
    }

    const handleSignIn = async () => {
        try {
            const response = await axios.post(`${API_BASE_URL}/user_signin`, {
                email: formData.email,
                password: formData.password
            })
            
            const user = response.data

            toast.success('Sign in successful! Welcome back.')
            navigate('/home'); 
            
            // Store user data
            localStorage.setItem('currentUser', JSON.stringify(user))
            
            // Clear form
            setFormData({
                name: '',
                email: '',
                password: '',
                confirmPassword: ''
            })

        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || 'Invalid email or password'
            
            // For sign in errors, we can assume it's related to email/password
            if (err.response?.status === 401 || err.response?.status === 400) {
                setFieldErrors(prev => ({
                    ...prev,
                    email: 'Invalid email or password',
                    password: 'Invalid email or password'
                }))
            } else {
                toast.error(errorMessage)
            }
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        if (!validateForm()) return

        setIsLoading(true)

        try {
            if (isSignUp) {
                await handleSignUp()
            } else {
                await handleSignIn()
            }
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className='SignUp_In_Container'>
            <div className='SignUp_In_Wrapper'>
                <div className='SignUp_In_Left'>
                    <div className="logo_section">
                        <Logo />
                    </div>
                    <div className='form_section'>
                        <h1 className="form_title">
                            {isSignUp ? 'Sign up' : 'Sign in'}
                        </h1>

                        <form onSubmit={handleSubmit}>
                            <div className='form_fields'>
                                {isSignUp && (
                                    <div className='input_group'>
                                        <label className='input_label'>User Name</label>
                                        <div 
                                            className={`input_field ${fieldErrors.name ? 'error' : ''}`}
                                            onMouseEnter={() => handleMouseEnter('name')}
                                            onMouseLeave={() => handleMouseLeave('name')}
                                        >
                                            <input 
                                                type='text' 
                                                name='name' 
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                className="form_input" 
                                                placeholder='Enter your name' 
                                                disabled={isLoading}
                                            />
                                            <div className='input_icon'><UserRound className="icon" /></div>
                                            {fieldErrors.name && showTooltip.name && (
                                                <div className="error_tooltip">
                                                    {fieldErrors.name}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                                <div className='input_group'>
                                    <label className='input_label'>Email</label>
                                    <div 
                                        className={`input_field ${fieldErrors.email ? 'error' : ''}`}
                                        onMouseEnter={() => handleMouseEnter('email')}
                                        onMouseLeave={() => handleMouseLeave('email')}
                                    >
                                        <input 
                                            type='email' 
                                            name='email' 
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="form_input" 
                                            placeholder='Enter your email' 
                                            disabled={isLoading}
                                        />
                                        <div className='input_icon'><Mail className="icon" /></div>
                                        {fieldErrors.email && showTooltip.email && (
                                            <div className="error_tooltip">
                                                {fieldErrors.email}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className='input_group'>
                                    <label className='input_label'>Password</label>
                                    <div 
                                        className={`input_field ${fieldErrors.password ? 'error' : ''}`}
                                        onMouseEnter={() => handleMouseEnter('password')}
                                        onMouseLeave={() => handleMouseLeave('password')}
                                    >
                                        <input 
                                            type={showPassword ? 'text' : 'password'} 
                                            name='password' 
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            className="form_input" 
                                            placeholder='Enter your password' 
                                            disabled={isLoading}
                                        />
                                        <button 
                                            type="button" 
                                            onClick={togglePasswordVisibility} 
                                            className='input_icon input_icon_button'
                                            disabled={isLoading}
                                        >
                                            {showPassword ? (
                                                <Eye className="icon" />
                                            ) : (
                                                <EyeClosed className="icon" />
                                            )}
                                        </button>
                                        {fieldErrors.password && showTooltip.password && (
                                            <div className="error_tooltip">
                                                {fieldErrors.password}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                {isSignUp && (
                                    <div className='input_group'>
                                        <label className='input_label'>Confirm Password</label>
                                        <div 
                                            className={`input_field ${fieldErrors.confirmPassword ? 'error' : ''}`}
                                            onMouseEnter={() => handleMouseEnter('confirmPassword')}
                                            onMouseLeave={() => handleMouseLeave('confirmPassword')}
                                        >
                                            <input 
                                                type={showConfirmPassword ? 'text' : 'password'} 
                                                name='confirmPassword' 
                                                value={formData.confirmPassword}
                                                onChange={handleInputChange}
                                                className="form_input" 
                                                placeholder='Confirm your password' 
                                                disabled={isLoading}
                                            />
                                            <button 
                                                type="button" 
                                                onClick={toggleConfirmPasswordVisibility} 
                                                className='input_icon input_icon_button'
                                                disabled={isLoading}
                                            >
                                                {showConfirmPassword ? (
                                                    <Eye className="icon" />
                                                ) : (
                                                    <EyeClosed className="icon" />
                                                )}
                                            </button>
                                            {fieldErrors.confirmPassword && showTooltip.confirmPassword && (
                                                <div className="error_tooltip">
                                                    {fieldErrors.confirmPassword}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <button 
                                type="submit" 
                                className="signin_button"
                                disabled={isLoading}
                                style={{ opacity: isLoading ? 0.6 : 1, cursor: isLoading ? 'not-allowed' : 'pointer' }}
                            >
                                {isLoading ? 'Loading...' : (isSignUp ? 'Sign up' : 'Sign in')}
                            </button>
                        </form>

                        <div className='form_signup'>
                            <p className='signup_link'>
                                {isSignUp ? 'Already have an account? ' : "Don't have an account? "} 
                                <button 
                                    type="button"
                                    onClick={toggleForm}
                                    style={{ 
                                        background: 'none', 
                                        border: 'none', 
                                        color: 'inherit', 
                                        textDecoration: 'underline',
                                        cursor: 'pointer',
                                        padding: 0,
                                        font: 'inherit'
                                    }}
                                    disabled={isLoading}
                                >
                                    {isSignUp ? 'Sign in' : 'Sign up'}
                                </button>
                            </p>
                            {!isSignUp && (
                                <a href="#" className="forgot_link">Forgot Password</a>
                            )}
                        </div>
                    </div>
                </div>
                <div className='SignUp_In_Right'>
                    <div className="bg_pattern">
                        <div className="pattern_shape pattern_1"></div>
                        <div className="pattern_shape pattern_2"></div>
                        <div className="pattern_shape pattern_3"></div>
                    </div>

                    <div className="right_logo">
                        <div className="logo">
                            <div className="logo_icon white">
                                <div className="logo_inner dark"></div>
                            </div>
                            <span className="logo_text">NextGenCV</span>
                        </div>
                    </div>

                    <div className="welcome_content">
                        <h2 className="welcome_title">Welcome to NextGenCV</h2>
                        <p className="welcome_description">
                            NextGenCV empowers users to create professional, modern, and impactful resumes with ease. 
                            Join us and craft your career story today.
                        </p>
                        <p className="welcome_stats">
                            More than 10+ people are using NextGenCV, it's your turn
                        </p>

                        <div className="cta_card">
                            <h3 className="cta_title">
                                Build your professional CV in minutes – Start now!
                            </h3>
                            <p className="cta_description">
                                Join thousands crafting job-winning resumes with ease using our smart CV builder.
                            </p>
                            
                            <div className="avatar_stack">
                                <div className="avatar avatar_1">A</div>
                                <div className="avatar avatar_2">B</div>
                                <div className="avatar avatar_3">C</div>
                                <div className="avatar avatar_4">D</div>
                                <div className="avatar avatar_more">+10</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SignUp_In