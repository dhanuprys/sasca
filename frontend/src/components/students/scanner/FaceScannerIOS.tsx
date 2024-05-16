'use client';

import useScannerStore from "@/context/useScannerStore";
import axios from "axios";
import { ReactNode, useCallback, useMemo, useRef, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { BsPersonSlash } from "react-icons/bs";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { MdOutlineErrorOutline } from "react-icons/md";
import Webcam from "react-webcam";

function FaceScannerIOS({ checkType }: { checkType: string }) {
    const [icon, setIcon] = useState<ReactNode | null>(null);
    const [message, setMessage] = useState<{ title?: string, description?: string }>({});
    const [faceDetecting, setFaceDetecting] = useState(false);

    const ICON = useMemo(() => ({
        CHECKING: <AiOutlineLoading3Quarters className="animate-spin" />,
        UNRECOGNIZED: <BsPersonSlash />,
        SUCCESS: <IoIosCheckmarkCircleOutline className="text-green-600" />,
        ERROR: <MdOutlineErrorOutline className="text-red-600" />
    }), []);

    const { coordinates } = useScannerStore();

    const webcamRef = useRef<any>(null);
    const capture = useCallback(
        () => {
            const imageSrc = webcamRef.current.getScreenshot();

            fetch(imageSrc)
                .then(res => {
                    console.log(res);
                    return res.blob()
                })
                .then(captureBlob => {
                    const fd = new FormData();

                    if (!coordinates) {
                        fd.append('loc_lat', '0.0');
                        fd.append('loc_long', '0.0');
                    } else {
                        fd.append('loc_lat', String(coordinates[0]));
                        fd.append('loc_long', String(coordinates[1]));
                    }

                    fd.append('photo', new File([captureBlob], 'user'));
                    fd.append('type', checkType);

                    setFaceDetecting(false);
                    setIcon(ICON.CHECKING);
                    setMessage({ title: 'Mencocokkan dataset' });

                    axios.post('/api/v1/student/attendance', fd, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    }).then((res) => {
                        setIcon(ICON.SUCCESS);

                        setTimeout(() => {
                            setMessage({ title: 'Absensi berhasil' });
                            setTimeout(() => {
                                setMessage({ title: 'Terimakasih sudah melakukan absensi' });

                                setTimeout(() => {
                                    window.location.href = '/student/home';
                                }, 500);
                            }, 1000)
                        }, 2000);

                    }).catch((err) => {
                        if (err.response.status !== 404) {
                            setIcon(ICON.ERROR);
                            setMessage({ title: 'Server sedang mengalami masalah' });
                            return;
                        }

                        setIcon(ICON.UNRECOGNIZED);
                        setMessage({
                            title: 'Wajah tidak dikenali',
                            description: 'Ini mungkin terjadi karena beberapa faktor, harap untuk mencoba lagi'
                        })
                    });
                })
                .catch(() => {
                    alert('ERROR PARSING');
                });
        },
        [webcamRef]
    );

    return (
        <div className="flex flex-col gap-4 items-center">
            <div className="w-[240px] h-[240px]">
                <div className={`${faceDetecting ? 'hidden' : ''} [&>*]:w-full [&>*]:h-full`}>
                    {icon}
                </div>
                <Webcam
                    className={`${!faceDetecting ? 'hidden' : ''} object-cover rounded !max-h-full !min-h-full !min-w-full`}
                    ref={webcamRef}
                    screenshotFormat="image/png"
                    disablePictureInPicture={true}
                    mirrored={true}
                    // onLoadedData={() => setCameraLoading(false)}
                    onCanPlay={() => setFaceDetecting(true)} />
            </div>
            <h3 className="text-center text-lg font-semibold mt-4">{message && message.title}</h3>
            <p className="text-center text-gray-400">{message && message.description}</p>
            {
                !faceDetecting
                    ? null
                    : <div className="pt-10">
                        <div onClick={capture} className="p-4 hover:cursor-pointer rounded bg-blue-500 text-white">
                            ABSEN
                        </div>
                    </div>
            }
        </div>
    );
}

export default FaceScannerIOS;