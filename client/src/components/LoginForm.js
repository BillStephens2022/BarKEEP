import React from 'react';
import Button from '../components/Button';
import '../styles/Home.css';

const LoginForm = () => {
    return (
        <div className='login_form_page'>
          <h3 className='form_title'>Login Form</h3>
          <form className='login_form'>
            <label className="form_label" htmlFor='eamil'>Email</label>
            <input className="form_input" name='email' placeholder='your email'></input>
            <label className="form_label" htmlFor='password'>Password</label>
            <input className="form_input" name='password' placeholder='your password'></input>
            <Button text='Log In!'></Button>
          </form>
        </div>
    )
}

export default LoginForm;