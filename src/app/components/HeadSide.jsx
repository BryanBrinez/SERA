'use client';
import "rsuite/dist/rsuite.min.css";
import React, { useEffect, useState } from 'react';
import { Avatar } from 'rsuite';

export default function HeadSide() {
    const [currentTime, setCurrentTime] = useState('');
    const [currentDate, setCurrentDate] = useState('');

    useEffect(() => {
        const updateDateTime = () => {
            const now = new Date();
            const optionsDate = {
                weekday: 'long', 
                year: 'numeric', 
                month: 'long',   
                day: 'numeric',  
            };
            const optionsTime = {
                hour: '2-digit',   
                minute: '2-digit', 
                second: '2-digit', 
                hour12: true,      
            };
            
            setCurrentTime(now.toLocaleTimeString([], optionsTime));
            setCurrentDate(now.toLocaleDateString([], optionsDate));
        };

        updateDateTime(); 
        const intervalId = setInterval(updateDateTime, 1000); 

        return () => clearInterval(intervalId); 
    }, []);

    return (
        <header className='flex justify-between items-center w-full h-24 pt-16 pb-16'>
            <section>
                <p className='text-base text-black'>
                    <span className='text-[#A90B0B] font-bold'>HORA: </span>
                    <time dateTime={new Date().toISOString()} className='text-lg'>{currentTime}</time>
                </p>
                <p className='text-base text-black'>
                    <span className='text-[#A90B0B] font-bold'>FECHA: </span>
                    <time dateTime={new Date().toISOString()} className='text-lg'>{currentDate}</time>
                </p>
            </section>

            <section className="flex gap-5 items-center">
                <div className='text-base text-black text-right'>
                    <p className='text-lg font-semibold'>Kevin Victoria</p>
                    <p className='text-lg'>Profesor</p>
                </div>
                <Avatar 
                    size="xl"
                    color="red"
                    bordered
                    circle
                    src="https://i.pravatar.cc/150?u=1"
                    alt="Profile picture of Kevin Victoria"
                />
            </section>
        </header>
    );
}
