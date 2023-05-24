import React from 'react';
import Button from '../components/Button';
import '../styles/Home.css';

const RegisterForm = () => {
    return (
        <div className='register_form_page'>
          <h3 className='form_title'>Register Form</h3>
          <form className='register_form'>
            <label className="form_label" htmlFor='username'>Username</label>
            <input className="form_input" name='username' placeholder='username'></input>
            <label className="form_label" htmlFor='email'>Email</label>
            <input className="form_input" name='email' placeholder='email'></input>
            <label className="form_label" htmlFor='password'>Password</label>
            <input className="form_input" name='password' placeholder='password'></input>
            <Button text='Log In!'></Button>
          </form>
        </div>
    )
}

export default RegisterForm;