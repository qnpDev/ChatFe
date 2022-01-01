import React, { useEffect, useState } from 'react';
import './style.css'
import img from '../../assets/img-01.png'
import { Link, useNavigate } from 'react-router-dom';
import { CgProfile } from 'react-icons/cg'
import { BsKey } from 'react-icons/bs'
import { BiRename } from 'react-icons/bi'
import api from '../../axios'
import { toast, ToastContainer } from 'react-toastify';

function Signup() {
	document.title = 'qnp | Signup'
	const navigate = useNavigate()
	const [ btnSubmit,  setBtnSubmit ] = useState(false)

	const handleSubmit = e => {
		e.preventDefault()
		const name = e.target.name.value
		const username = e.target.username.value
        const pass = e.target.pass.value
		const pass2 = e.target.pass2.value
		if(name === ''){
			toast.error('Please enter Name!')
            e.target.name.focus()
		}else if(username === '') {
            toast.error('Please enter Username!')
            e.target.username.focus()
        }else if (username.match('^[a-zA-Z0-9][a-zA-Z0-9_]*[a-zA-Z0-9](?<![-?+?*$]{6,}.*)$') === null){
            toast.error('Username must two characters at least and have no special characters!')
            e.target.username.focus()
        }else if(pass === '') {
            toast.error('Please enter Password!')
            e.target.pass.focus()
        }else if(pass2 === ''){
			toast.error('Please enter Password again!')
            e.target.pass2.focus()
		}else if(pass !== pass2){
			toast.error('Password does not match!')
            e.target.pass2.focus()
		}else if(pass.length < 4){
            toast.error('Password must four characters at least!')
            e.target.pass.focus()
        }else{
            toast.promise(new Promise((resolve, reject) => {
                setBtnSubmit(true)
                api.post('/auth/signup', {
                    username,
                    password: pass,
					name,
                }).then(res=>{
                    if (res.data.success){
                        const {token, refreshToken} = res.data
                        localStorage.setItem('token', token)
                        localStorage.setItem('refreshToken', refreshToken)
                        navigate('/')
                        resolve()
                    }else{
						toast.error(res.data.msg)
                        setBtnSubmit(false)
                        reject()
                    }
                })

            }), {
                pending: 'Wait...',
                success: 'Signup successful!',
                error: 'Somethings wrong!'
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

						<form onSubmit={handleSubmit} className="login100-form validate-form">
							<span className="login100-form-title fw-bold">
								Signup
							</span>
							
							<div className="wrap-input100 validate-input" data-validate = "Name is required">
								<input className="input100" type="text" name="name" placeholder="Name"/>
								<span className="focus-input100"></span>
								<span className="symbol-input100">
									<BiRename/>
								</span>
							</div>

							<div className="wrap-input100 validate-input" data-validate = "Valid username is required">
								<input className="input100" type="text" name="username" placeholder="Username"/>
								<span className="focus-input100"></span>
								<span className="symbol-input100">
									<CgProfile/>
								</span>
							</div>

							<div className="wrap-input100 validate-input" data-validate = "Password is required">
								<input className="input100" type="password" name="pass" placeholder="Password"/>
								<span className="focus-input100"></span>
								<span className="symbol-input100">
									<BsKey/>
								</span>
							</div>

							<div className="wrap-input100 validate-input" data-validate = "Password is required">
								<input className="input100" type="password" name="pass2" placeholder="Password again"/>
								<span className="focus-input100"></span>
								<span className="symbol-input100">
									<BsKey/>
								</span>
							</div>
							
							<div className="container-login100-form-btn">
								<button disabled={btnSubmit} className="login100-form-btn">
									Signup
								</button>
							</div>

							<div className="text-center p-t-136 mt-5">
								<Link to='/login' className="txt2" href="#">
									Login with your Account
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

export default Signup;