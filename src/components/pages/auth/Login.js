import React, { useEffect, useState } from 'react';
import './style.css'
import img from '../../assets/img-01.png'
import { Link, useNavigate } from 'react-router-dom';
import { CgProfile } from 'react-icons/cg'
import { BsKey } from 'react-icons/bs'
import { toast, ToastContainer } from 'react-toastify';
import api from '../../axios'
function Login() {
	document.title = 'qnp | Chat Realtime'
	const navigate = useNavigate()
	const [ btnSubmit,  setBtnSubmit ] = useState(false)
	
	const handleSubmit = e => {
		e.preventDefault()
		const username = e.target.username.value
        const password = e.target.password.value
		if(username === '') {
            toast.error('Please enter Username!')
            e.target.username.focus()
        }else if (username.match('^[a-zA-Z0-9][a-zA-Z0-9_]*[a-zA-Z0-9](?<![-?+?*$]{6,}.*)$') === null){
            toast.error('Username must two characters at least and have no special characters!')
            e.target.username.focus()
        }else if(password === '') {
            toast.error('Please enter Password!')
            e.target.password.focus()
        }else if(password.length <= 3){
            toast.error('Password must four characters at least!')
            e.target.password.focus()
        }else{
            toast.promise(new Promise((resolve, reject) => {
                setBtnSubmit(true)
                api.post('/auth/login', {
                    username,
                    password
                }).then(res=>{
                    if (res.data.success){
                        const {token, refreshToken} = res.data
                        localStorage.setItem('token', token)
                        localStorage.setItem('refreshToken', refreshToken)
                        navigate('/')
                        resolve()
                    }else{
                        setBtnSubmit(false)
                        reject()
                    }
                })

            }), {
                pending: 'Wait...',
                success: 'Login successful!',
                error: 'Invalid username or password!'
            })
        }
	}

	useEffect(() => {
        if (localStorage.getItem('token') || localStorage.getItem('refreshToken')){
            api.get('/user/id').then(res=> {
                if(res.data.success)
                    navigate('/')
            })
        }
    }, [navigate])
	
    return (
        <>
			<ToastContainer
                key='login'
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme='colored'
            />
            <div className='header' style={{justifyContent: 'center'}}>
                <div className='header-title'>qnp | Chat App</div>
            </div>
			<div className="limiter">
				<div className="container-login100">
					<div className="wrap-login100">
						<div className="login100-pic js-tilt" data-tilt>
							<img src={img} alt="IMG"/>
                            <div className='mt-4 text-center'>
                                <span className='text-secondary'>Made by: </span>
                                <span onClick={() => navigate('/about')} className='text-info fw-bold cursor-pointer'>
                                    qnp
                                </span>
                            </div>
						</div>

						<form
							onSubmit={handleSubmit}
						 	className="login100-form validate-form">
							<span className="login100-form-title fw-bold">
								Login
							</span>

							<div className="wrap-input100 validate-input" data-validate = "Valid username is required">
								<input 
									name='username'
									className="input100" type="text" placeholder="Username"/>
								<span className="focus-input100"></span>
								<span className="symbol-input100">
									<CgProfile/>
								</span>
							</div>

							<div className="wrap-input100 validate-input" data-validate = "Password is required">
								<input 
									name='password'
									className="input100" type="password" placeholder="Password"/>
								<span className="focus-input100"></span>
								<span className="symbol-input100">
									<BsKey/>
								</span>
							</div>
							
							<div className="container-login100-form-btn">
								<button disabled={btnSubmit} className="login100-form-btn">
									Login
								</button>
							</div>

							<div className="text-center p-t-136 mt-5">
								<Link to='/signup' className="txt2" href="#">
									Create your Account
									<i className="fa fa-long-arrow-right m-l-5" aria-hidden="true"></i>
								</Link>
							</div>
                            
						</form>
					</div>
				</div>
			</div>
        </>
    );
}

export default Login;