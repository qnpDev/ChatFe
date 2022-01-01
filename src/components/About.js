import React, { useRef, useState } from 'react';
import { 
    FaFacebook,
    FaFacebookMessenger,
    FaYoutube,
    FaDiscord,
} from 'react-icons/fa'
import { FiSmartphone } from 'react-icons/fi'
import { SiGmail } from 'react-icons/si'
import { useNavigate } from 'react-router-dom';
import { BiArrowBack } from 'react-icons/bi'

function About() {
    const navigate = useNavigate()
    const list = useRef([
        {name: 'Front-end', value: 'ReactJS'},
        {name: 'Back-end', value: 'NodeJS'},
        {name: 'Database', value: 'MongoDB'},
        {name: 'Designed & Coded', value: 'Nguyễn Phú Quí'},
    ])
    const [ data, setData ] = useState()
    document.title = 'About Me'
    return (
        <>
            <div className='about'>
            <div className='header d-flex justify-content-between'>
                <div onClick={() => navigate(-1)} 
                    className='fw-bold mx-3 text-primary cursor-pointer'>
                    <BiArrowBack />
                    Back
                </div>
                <div className='header-title text-danger'>qnp | CHAT REALTIME</div>
                
            </div>
            <div className='my-2'>.</div>
            <div className='card mx-2 mt-5'>
                <div className='card-header text-center'>
                    <div className='mt-3'>
                        <h1 className='text-info'>Chat App</h1>
                    </div>
                    <div className='text-secondary text-small'>
                        Advanced Web Programming
                    </div>
                </div>
                <div className='card-body text-center mb-4'>
                    <div className='mt-3'>
                        {list.current.map((v, k) => (
                            <div className='row' key={k}>
                                <div className='col-6 fw-bold d-inline-flex justify-content-end'>
                                    {v.name}: 
                                </div>
                                <div className='col-6 fst-italic fw-light d-inline-flex justify-content-start'>
                                    {v.value}
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    <div className='mt-3'>
                        <img 
                            className='user-avatar'
                            src='https://scontent.fdad3-2.fna.fbcdn.net/v/t1.6435-9/118674062_427946914852685_5667450515899727291_n.jpg?_nc_cat=107&ccb=1-5&_nc_sid=174925&_nc_ohc=VRA7Ie15N6AAX9w1QEz&_nc_ht=scontent.fdad3-2.fna&oh=00_AT8WWjF1ZxKHP0Xrx8qrojatQy_IT2egDDKwAHiptw6J0g&oe=61E5E35A'
                            alt='Avatar'
                        />
                    </div>
                    <div className='mt-1'>
                        <h3 className='text-success'>Nguyễn Phú Quí</h3>
                        <p className='text-small text-secoondary'>( qnp )</p>
                    </div>

                    <div className='mt-3'>
                        <a 
                            href='https://facebook.com/100029121395944'
                            className='m-2 text-primary cursor-pointer'
                        >
                            <FaFacebook/>
                        </a>
                        <a 
                            href='https://m.me/100029121395944'
                            className='m-2 text-info cursor-pointer'>
                            <FaFacebookMessenger/>
                        </a>
                        <span className='m-2 text-danger cursor-pointer'>
                            <FaYoutube/>
                        </span>
                        <span 
                            onClick={() => setData('qnp#0980')}
                            className='m-2 text-warning cursor-pointer'>
                            <FaDiscord/>
                        </span>
                        <span 
                            onClick={() => setData('08.2222.6618')}
                            className='m-2 text-success cursor-pointer'>
                            <FiSmartphone/>
                        </span>
                        <span 
                            onClick={() => setData('qnpdev@gmail.com')}
                            className='m-2 text-danger cursor-pointer'>
                            <SiGmail/>
                        </span>
                        {data && (
                            <div className='input-mind mt-1 p-3 fw-bold'>
                                {data}
                            </div>
                        )}
                        

                    </div>
                </div>
            </div>
            </div>
        </>
    );
}

export default About;