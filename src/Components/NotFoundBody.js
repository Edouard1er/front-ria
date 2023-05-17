import React from 'react'
import { AiOutlineArrowLeft } from 'react-icons/ai'
import { useNavigate } from 'react-router-dom'

function NotFoundBody() {
    const navigate = useNavigate()
  return (
    <div className='not-found-body'>
        <div className='not-found-content'>
            <div className='not-found-status'>
                <p>404 </p>
                <p>Not Found</p>
            </div>
            <div className='vertical-line'>
            </div>
            <div className='not-found-text'>
                <p className='desole'>sorry !</p>
                <p>La page que vous demandez </p>
                <p>n'est pas trouvée </p>
            </div>
        </div>
        <div className='not-found-back'
        onClick={() => navigate('/')}
        >
            <div><AiOutlineArrowLeft size={30} /></div>
            <p>Retourner</p>
        </div>
    </div>
  )
}

export default NotFoundBody