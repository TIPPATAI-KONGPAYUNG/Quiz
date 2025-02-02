import React from 'react'
import { Link } from 'react-router-dom';
import AddCart from '../AddCart';

const BookCard = ({ data }) => {
    console.log(data.image);
    return (
        <>
            <div className='h-full bg-zinc-800 rounded p-4 flex flex-col'>
                <Link to={`/view-book-detail/${data._id}`}>
                    <div className='bg-zinc-900 rounded  flex items-center justify-center'>
                    <img src={`http://localhost:1000/upload/${data.image}`} alt="/" className='h-[20vh]' />
                    </div>
                    <h2 className='mt-4 text-xl text-yellow-100 line-clamp-1'>{data.title}</h2>
                    <p className='mt-2 text-zinc-200 font-semibold'>by {data.author}</p>
                    <p className='mt-2 text-zinc-200 font-semibold text-xl'>{data.price} THB</p>
                </Link>
                    <div className='mt-6'>
                            <AddCart bookid={data._id} image={data.image} title={data.title} author={data.author} price={data.price} quantity={1}/>
                    </div>
                </div>
            
        </>
    );
};

export default BookCard
