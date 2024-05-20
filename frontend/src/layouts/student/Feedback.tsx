'use client';

import { swrFetcher } from "@/utils/swrFetcher";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaRegStar } from "react-icons/fa";
import { FaStar } from "react-icons/fa6";
import useSWR, { mutate } from "swr";
import useSWRImmutable from "swr/immutable";

function Feedback() {
    const router = useRouter();
    const [stars, setStars] = useState(0);
    const [message, setMessage] = useState('');
    const [isShow, setShow] = useState(true);

    const { data: feedback, error, isLoading } = useSWRImmutable(
        '/api/v1/student/feedback?today=1',
        swrFetcher
    );

    const sendFeedback = () => {
        axios.post('/api/v1/student/feedback', {
            stars,
            message
        }).then(async () => {
            await mutate('/api/v1/student/feedback');
            setShow(false);
        }).catch(() => {

        });
    };

    if (!isShow || feedback || (error && error.response.status !== 404)) {
        return null;
    }

    return (
        <div className="border rounded-xl bg-white shadow-md p-4 flex flex-col gap-4">
            <h1 className="text-xl text-center font-semibold">Ulasan & Saran</h1>
            <div>
                <label className="block mb-2 font-semibold">Ulasan</label>
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
                <label className="block mb-2 font-semibold">Saran</label>
                <textarea onChange={(e) => setMessage(e.target.value)} className="px-4 py-2 border rounded-xl w-full" placeholder="Masukkan saran dan masukkan"></textarea>
            </div>
            <div>
                <button onClick={sendFeedback} className="w-full bg-sky-800 text-white px-4 py-2 rounded-xl">KIRIM</button>
            </div>
        </div>
    );
}

export default Feedback;