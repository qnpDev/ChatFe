import React, { useState } from 'react';
import api from '../../axios'
import { toast } from 'react-toastify';
import { Modal, CloseButton } from 'react-bootstrap';
function ChangePass({ close, logout }) {

    const [ oldPass, setOldPass ] = useState('')
    const [ newPass, setNewPass ] = useState('')
    const [ newPassAgain, setNewPassAgain ] = useState('')

    const handleOldPass = e => setOldPass(e.target.value)
    const handleNewPass = e => setNewPass(e.target.value)
    const handleNewPassAgain = e => setNewPassAgain(e.target.value)

    const handleUpdate = () => {
        toast.promise(new Promise((resolve, reject) => {
            api.post('/user/password', {
                oldPassword: oldPass,
                newPassword: newPass,
            }).then(res=>{
                if (res.data.success){
                    close()
                    logout()
                    resolve()
                }else{
                    reject(res.data.msg)
                }
            })

        }), {
            pending: 'Wait...',
            success: 'Change Password successful!',
            error: 'Check your old password'
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
                        Change Password
                    </Modal.Title>
                    <CloseButton onClick={close}/>
                </Modal.Header>
                <Modal.Body >
                        <div className='mb-3'>
                            <label className='fw-bold'>
                                Old Password:
                                <span className='text-danger fw-bold'>
                                    *
                                </span>
                            </label>
                            <input 
                                type='password'
                                className='form-control text bg input-mind'
                                value={oldPass}
                                onChange={handleOldPass}
                                placeholder='Enter old password!'
                            />
                            {oldPass && oldPass.length < 4 && (
                                <label className='text-small text-danger d-flex justify-content-end'>At least 4 character!</label>
                            )}
                        </div>
                        <div className='mb-3'>
                            <label className='fw-bold'>
                                New Password:
                                <span className='text-danger fw-bold'>
                                    *
                                </span>
                            </label>
                            <input 
                                type='password'
                                className='form-control text bg input-mind'
                                value={newPass}
                                onChange={handleNewPass}
                                placeholder='Enter new password!'
                            />
                            {newPass && newPass.length < 4 && (
                                <label className='text-small text-danger d-flex justify-content-end'>At least 4 character!</label>
                            )}
                        </div>
                        <div className='mb-3'>
                            <label className='fw-bold'>
                                New Password again:
                                <span className='text-danger fw-bold'>
                                    *
                                </span>
                            </label>
                            <input 
                                type='password'
                                className='form-control text bg input-mind'
                                value={newPassAgain}
                                onChange={handleNewPassAgain}
                                placeholder='Enter new password again!'
                            />
                            {newPass && newPassAgain && newPass !== newPassAgain && (
                                <label className='text-small text-danger d-flex justify-content-end'>Not match!</label>
                            )}
                        </div>
                    
                </Modal.Body>
                <Modal.Footer>
                    <button onClick={close} className='btn btn-secondary'>
                        Close
                    </button>
                    <button 
                        className={oldPass && newPass && newPassAgain && (oldPass.length >= 4) && (newPass.length >= 4) && (newPass === newPassAgain) ? 'btn btn-success ' : 'btn btn-secondary ' }
                        disabled={oldPass && newPass && newPassAgain && (oldPass.length >= 4) && (newPass.length >= 4) && (newPass === newPassAgain) ? false : true}
                        onClick={handleUpdate}
                    >Change Password</button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default ChangePass;