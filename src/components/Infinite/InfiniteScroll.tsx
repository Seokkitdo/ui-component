import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import './InfiniteScroll.css'

interface Airline {
    id: number;
    name: string;
    country: string;
    logo: string;
    slogan: string;
    head_quaters: string;
    website: string;
    established: string;
}

interface Passenger {
    _id: string;
    name: string;
    trips: number;
    airline: Airline;
    __v: number;
}

const InfiniteScroll = () => {

    const currentPageRef = useRef<number>(0);
    const listRef = useRef<HTMLUListElement | null>(null)

    const [passengers, setPassengers] = useState<Array<Passenger>>([]);
    const [isLast, setIsLast] = useState<boolean>(false)
    const [isScrollBottom, setIsScrollBottom] = useState<boolean>(false);



    const getPassengers = async (init?: boolean) => {

        const params = {page: 0, size: 30}
        try {
            const response = await axios.get('https://api.instantwebtools.net/v1/passenger', {params});

            const passengers = response.data.data;
            const isLast = response.data.totalPages === currentPageRef.current;

            init ? setPassengers(passengers) : setPassengers(prev => [...prev, ...passengers])
            setIsLast(isLast)
        } catch (e) {
            console.log(e)
        }
    }

    
    
    const handleScroll = () => {
        if(listRef.current) {
            const {scrollHeight, offsetHeight, scrollTop} = listRef.current;
            
            const offset = 50;
            
            console.log(scrollTop, scrollHeight, offsetHeight)
            
            setIsScrollBottom(scrollHeight - offsetHeight - scrollTop < offset)
        }
    }
    
    useEffect(() => {
        if (isScrollBottom) {
          currentPageRef.current += 1;
          !isLast && getPassengers();
        }
      }, [isScrollBottom, isLast]);
    
      useEffect(() => {
        getPassengers(true);
      }, []);
    
console.log(passengers)
  return (
    <div>
        <ul className="list" ref={listRef} onScroll={handleScroll}>
            {
                passengers?.map(passenger => (
                    <li key={passenger._id}>{passenger.name}</li>
                ))
            }
        </ul>
    </div>
  )
}

export default InfiniteScroll