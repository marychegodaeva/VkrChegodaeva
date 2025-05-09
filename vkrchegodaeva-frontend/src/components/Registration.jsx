import React, { useEffect, useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import useDocumentTitle from '../useDocumentTitle';
import axios from "axios";
import { config } from "../config.jsx";
import '../css/basic.css';
import '../css/registration_authorization.css';

export function Registration () {
  useDocumentTitle('Регистрация');
  const location = useLocation();
  const [login, setLogin] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loginDirty, setLoginDirty] = useState(false)
  const [emailDirty, setEmailDirty] = useState(false)
  const [passwordDirty, setPasswordDirty] = useState(false)
  const [loginError, setLoginError] = useState('Логин не может быть пустым')
  const [emailError, setEmailError] = useState('Email не может быть пустым')
  const [passwordError, setPasswordError] = useState('Пароль не может быть пустым')
  const navigate = useNavigate()
  const [formValid, setFormValid] = useState(false)

  useEffect(() => {
    const hash = location.hash.substring(1); 
    if (hash) {
      const element = document.getElementById(hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location]);

  const blurHandler = (e) => {
    switch (e.target.name) {
        case 'login':
            setLoginDirty(true)
            break
        case 'email':
            setEmailDirty(true)
            break
        case 'password':
            setPasswordDirty(true)
            break
    }
  }

  const loginHandler = (e) => {
      setLogin(e.target.value)
      if (e.target.value.length < 5 || e.target.value.length > 11) {
          setLoginError('Логин должен быть длиннее 4 и короче 12 символов')
          if (!e.target.value) setLoginError('Логин не может быть пустым')
      }
      else setLoginError('')
  }

  const emailHandler = (e) => {
      setEmail(e.target.value)
      const re = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu;
      if (!re.test(String(e.target.value).toLowerCase())) setEmailError('Некорректный email')
      else setEmailError('')
  }

  const passwordHandler = (e) => {
      setPassword(e.target.value)
      if (e.target.value.length < 5 || e.target.value.length > 11) {
          setPasswordError('Пароль должен быть длиннее 4 и короче 12 символов')
          if (!e.target.value) setPasswordError('Пароль не может быть пустым')
      }
      else setPasswordError('')
  }

  useEffect(() => {
    if (emailError || loginError || passwordError) setFormValid(false)
    else setFormValid(true)
  }, [emailError, loginError, passwordError])

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = {
        login: login,
        email: email,
        password: password
    }

    try {
        const respose = await axios.post(`${config.API_BASE_URL}/api/Auth/register`, user)
        console.log(respose.data)
        navigate('/authorization')
    } catch (error) {
        console.log(error)
    }
  };

  return (
    <main className='registration'>
    <nav className='nav-registration'>
      <Link className="lk" to="/lk" target="_blank">
        <svg width="32.000000" height="32.000000" viewBox="0 0 32 32" fill="none">
          <defs/>
          <rect id="background-lk" rx="16.000000" width="32.000000" height="32.000000" fill="#EBF7FF" fill-opacity="1.000000"/>
          <path d="M16 27.37C17.99 27.37 19.95 26.85 21.68 25.85L21.68 22.12C21.68 21.08 21.27 20.07 20.53 19.34C19.79 18.6 18.79 18.18 17.75 18.18L14.25 18.18C13.2 18.18 12.2 18.6 11.46 19.34C10.72 20.07 10.31 21.08 10.31 22.12L10.31 25.85C12.04 26.85 14 27.37 16 27.37ZM24.31 22.12L24.31 23.76C25.82 22.14 26.83 20.11 27.2 17.93C27.58 15.74 27.31 13.5 26.43 11.46C25.55 9.43 24.09 7.7 22.23 6.48C20.38 5.27 18.21 4.62 16 4.62C13.78 4.62 11.61 5.27 9.76 6.48C7.9 7.7 6.44 9.43 5.56 11.46C4.68 13.5 4.41 15.74 4.79 17.93C5.16 20.11 6.17 22.14 7.68 23.76L7.68 22.12C7.68 20.77 8.1 19.45 8.88 18.34C9.66 17.23 10.76 16.4 12.03 15.94C11.37 15.18 10.94 14.24 10.8 13.25C10.65 12.25 10.8 11.23 11.22 10.32C11.64 9.4 12.31 8.62 13.15 8.08C14 7.53 14.99 7.24 16 7.24C17 7.24 17.99 7.53 18.84 8.08C19.68 8.62 20.35 9.4 20.77 10.32C21.19 11.23 21.34 12.25 21.19 13.25C21.05 14.24 20.62 15.18 19.96 15.94C21.23 16.4 22.33 17.23 23.11 18.34C23.89 19.45 24.31 20.77 24.31 22.12ZM16 30C19.71 30 23.27 28.52 25.89 25.89C28.52 23.27 30 19.71 30 16C30 12.28 28.52 8.72 25.89 6.1C23.27 3.47 19.71 2 16 2C12.28 2 8.72 3.47 6.1 6.1C3.47 8.72 2 12.28 2 16C2 19.71 3.47 23.27 6.1 25.89C8.72 28.52 12.28 30 16 30ZM18.62 12.5C18.62 13.19 18.34 13.86 17.85 14.35C17.36 14.84 16.69 15.12 16 15.12C15.3 15.12 14.63 14.84 14.14 14.35C13.65 13.86 13.37 13.19 13.37 12.5C13.37 11.8 13.65 11.13 14.14 10.64C14.63 10.15 15.3 9.87 16 9.87C16.69 9.87 17.36 10.15 17.85 10.64C18.34 11.13 18.62 11.8 18.62 12.5Z" fill="#48547C" fill-opacity="1.000000" fill-rule="evenodd"/>
        </svg>          
      </Link>
      <div className="lk section">
        <Link className="lk section item" to="/#block2" target="_blank">оборудование</Link>
      </div>
    </nav>
    <div className="registration-form">
        <h2>Регистрация</h2>
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                {(emailError) && <div style={{color: '#8B9DD8', fontSize: '20px', textAlign: 'right', paddingRight: '40px', fontStyle: 'italic'}}>{emailError}</div>}
                <label for="email">Email</label>
                <input type="email" onChange={e => emailHandler(e)} value={email} onBlur={e => blurHandler(e)} name="email" required placeholder="электронная почта"/>
            </div>
            <div className="form-group">
                {(loginError) && <div style={{color: '#8B9DD8', fontSize: '20px', textAlign: 'right', paddingRight: '40px', fontStyle: 'italic'}}>{loginError}</div>}
                <label for="login">Login</label>
                <input type="text" onChange={e => loginHandler(e)} value={login} onBlur={e => blurHandler(e)} name="login" required placeholder="логин"/>
            </div>
            <div className="form-group">
                {(passwordError) && <div style={{color: '#8B9DD8', fontSize: '20px', textAlign: 'right', paddingRight: '40px', fontStyle: 'italic'}}>{passwordError}</div>}
                <label for="password">Password</label>
                <input type="password" onChange={e => passwordHandler(e)} value={password} onBlur={e => blurHandler(e)} name="password" required placeholder="пароль"/>
            </div>
            <button disabled={!formValid} className={formValid ? 'button-registration' : 'button-registration-disabled'} type="submit">Зарегистрироваться</button>
        </form>
        <div className="additional-info">
            <p>Есть аккаунт? <Link to="/authorization">Войдите&nbsp;в&nbsp;личный&nbsp;кабинет!</Link></p>
        </div>
    </div>
    </main>
  )
}