import React, { useState } from 'react';
import api from '../../axios'
import { toast } from 'react-toastify';
import { Modal, CloseButton } from 'react-bootstrap';
import { AiFillDelete } from 'react-icons/ai'
function ChangeProfile({ close, data, setData }) {

    const [ avatar, setAvatar ] = useState(data.avatar)
    const [ name, setName ] = useState(data.name)

    const handleUpdate = () => {
        toast.promise(new Promise((resolve, reject) => {
            api.post('/user/profile', {
                name,
                avatar,
            }).then(res=>{
                if (res.data.success){
                    setData(prev => ({...prev, name, avatar}))
                    close()
                    resolve()
                }else{
                    reject(res.data.msg)
                }
            })

        }), {
            pending: 'Wait...',
            success: 'Change successful!',
            error: 'Check your information!'
        })
    }
    return (
        <>

            <Modal 
                show={true}
                size='lg' 
                centered
                onHide={close}
            >
                <Modal.Header className='d-flex justify-content-center bg'>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Change Profile
                    </Modal.Title>
                    <CloseButton onClick={close}/>
                </Modal.Header>
                <Modal.Body >
                    <div className='text fw-bold'>
                        Input link avatar:
                    </div>
                    <div className='row mb-3'>
                        <div className='col-11'>
                            <input
                                value={avatar}
                                onChange={e => setAvatar(e.target.value)}
                                className='form-control input-mind text'
                                placeholder='Type your link Avatar!'
                            />
                        </div>
                        <div className='col-1 d-flex align-items-center m-0 p-0'>
                            <button
                                onClick={() => setAvatar('')}
                                className='btn-transparent text-danger text-center'
                            >
                                <AiFillDelete />
                            </button>
                        </div>
                    </div>
                    <div className='mb-3'>
                        <label className='fw-bold'>
                            Name:
                            <span className='text-danger fw-bold'>
                                *
                            </span>
                        </label>
                        <input 
                            type='text'
                            className='form-control text bg input-mind'
                            value={name}
                            onChange={e => setName(e.target.value)}
                            placeholder='Enter your Name!'
                        />
                    </div>
                    
                </Modal.Body>
                <Modal.Footer>
                    <button onClick={close} className='btn btn-secondary'>
                        Close
                    </button>
                    <button 
                        className={name && avatar && (name.length >= 1) && (avatar.length >= 1) ? 'btn btn-success ' : 'btn btn-secondary ' }
                        disabled={name && avatar && (name.length >= 1) && (avatar.length >= 1) ? false : true}
                        onClick={handleUpdate}
                    >Update</button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default ChangeProfile;