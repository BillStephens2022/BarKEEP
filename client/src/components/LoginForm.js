import React from 'react';
import Button from '../components/Button';

const LoginForm = () => {
    return (
        <div className='login_form_page'>
          <h3>Login Form</h3>
          <form className='login_form'>
            <label className="form_label" htmlFor='eamil'>Email</label>
            <input className="form_input"></input>
            <label className="form_label" htmlFor='password'>Password</label>
            <input className="form_input"></input>
            <Button text='Log In!'></Button>
          </form>
        </div>
    )
}

export default LoginForm;