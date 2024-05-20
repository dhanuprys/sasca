'use client';

import { swrFetcher } from "@/utils/swrFetcher";
import axios from "axios";
import { useState } from "react";
import { FaRegStar } from "react-icons/fa";
import { FaStar } from "react-icons/fa6";
import useSWR, { mutate } from "swr";
import useSWRImmutable from "swr/immutable";

function Feedback() {
    const [stars, setStars] = useState(0);
    const [message, setMessage] = useState('');
    const [phone, setPhone] = useState('');
    const [isShow, setShow] = useState(true);
    const [isSubmitting, setSubmitting] = useState(false);

    const { data: feedback, error } = useSWRImmutable(
        '/api/v1/student/feedback?today=1',
        swrFetcher
    );

    const sendFeedback = () => {
        setSubmitting(true);

        axios.post('/api/v1/student/feedback', {
            stars,
            message,
            contact: phone
        }).then(async () => {
            await mutate('/api/v1/student/feedback');
            setShow(false);
        }).catch(() => {
            setSubmitting(false);
        });
    };

    if (!isShow || feedback || (error && error.response.status !== 404)) {
        return null;
    }

    return (
        <div className="border rounded-xl bg-white shadow-md p-4 flex flex-col gap-6">
            <h1 className="text-xl text-center font-semibold">Ulasan & Saran</h1>
            <div>
                <label className="block mb-3 font-semibold">Ulasan</label>
                <div className="grid grid-cols-5">
                    <div className="flex justify-center">
                        {
                            stars >= 1
                                ? <FaStar onClick={() => setStars(1)} className="text-2xl text-yellow-500" />
                                : <FaRegStar onClick={() => setStars(1)} className="text-2xl text-yellow-500" />
                        }
                    </div>
                    <div className="flex justify-center">
                        {
                            stars >= 2
                                ? <FaStar onClick={() => setStars(2)} className="text-2xl text-yellow-500" />
                                : <FaRegStar onClick={() => setStars(2)} className="text-2xl text-yellow-500" />
                        }
                    </div>
                    <div className="flex justify-center">
                        {
                            stars >= 3
                                ? <FaStar onClick={() => setStars(3)} className="text-2xl text-yellow-500" />
                                : <FaRegStar onClick={() => setStars(3)} className="text-2xl text-yellow-500" />
                        }
                    </div>
                    <div className="flex justify-center">
                        {
                            stars >= 4
                                ? <FaStar onClick={() => setStars(4)} className="text-2xl text-yellow-500" />
                                : <FaRegStar onClick={() => setStars(4)} className="text-2xl text-yellow-500" />
                        }
                    </div>
                    <div className="flex justify-center">
                        {
                            stars >= 5
                                ? <FaStar onClick={() => setStars(5)} className="text-2xl text-yellow-500" />
                                : <FaRegStar onClick={() => setStars(5)} className="text-2xl text-yellow-500" />
                        }
                    </div>
                </div>
            </div>
            <div>
                <label className="block mb-3 font-semibold">No. Whatsapp</label>
                <p className="text-slate-400 text-sm my-2">Kami akan menghubungi anda jika diperlukan. <span className="text-red-500">Harap memasukkan data valid</span></p>
                <input onChange={(e) => setPhone(e.target.value)} type="number" className="px-4 py-2 border rounded-xl w-full" placeholder="6282xxxxxx" />
            </div>
            <div>
                <label className="block mb-3 font-semibold">Saran</label>
                <textarea onChange={(e) => setMessage(e.target.value)} className="px-4 py-2 border rounded-xl w-full" placeholder="Masukkan saran dan masukkan"></textarea>
            </div>
            <div>
                <button disabled={isSubmitting} onClick={sendFeedback} className="disabled:bg-sky-500 w-full bg-sky-800 text-white px-4 py-2 rounded-xl">KIRIM</button>
            </div>
        </div>
    );
}

export default Feedback;