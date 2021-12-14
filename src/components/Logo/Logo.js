import React from "react";
import Tilt from 'react-parallax-tilt';
import './Logo.css';
import brain from './brain.png'

const Logo = () => {
    return (
        <div className='ma4 mt0'>
            <Tilt className='Tilt br2 shadow-2 pa3' options={{max: 160}} style={{height: '150px', width:'150px'}}>
                <div >
                    <img src={brain} alt='logo' style={{height: '120px', width:'120px'}}/>
                </div>
            </Tilt>
        </div>
    );
}

export default Logo;