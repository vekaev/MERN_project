import React, { useState, useEffect } from 'react'
import { useHttp} from '../hooks/http.hook'
import { useMessage } from '../hooks/message.hook'

export const AuthPage = () => {
    const message = useMessage()
    const {loading, request, error, clearError} = useHttp()
    const [form, setForm] = useState({
        email:'',password:''
    });

    useEffect(()=>{
        message(error)
        clearError()
    },[error, message, clearError])

    const changeHandler = (event) => {
        setForm({...form, [event.target.name]: event.target.value })
    }
    
    const registerHandler = async () => {
        try{
            const data = await request('/api/auth/register', 'POST', {...form})
            console.log(data)
        } 
        catch(e){}
    }

    return (
        <form className='row'>
           <input 
           type="email"
           placeholder='Email'
           id='email'
           name='email'
           onChange={changeHandler}
           />
           <input 
           type="password"
           placeholder='Password'
           id='Password'
           name='password'
           onChange={changeHandler}
           />
           <button
           disabled={loading}
           >Login</button>
           <button
            onClick={registerHandler}
            disabled={loading}
           >Registration</button>
        </form>
    )
}