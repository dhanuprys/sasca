'use client';

import { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as faceapi from 'face-api.js';
import axios from "axios";
import useScannerStore from "@/context/useScannerStore";
import { mutate } from "swr";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { BsPersonSlash } from "react-icons/bs";
import { MdOutlineErrorOutline } from "react-icons/md";

interface FaceScannerCommonProps {
    checkType: 'in' | 'out' | string;
}

function FaceScannerCommon({ checkType }: FaceScannerCommonProps) {
    const { coordinates } = useScannerStore();

    const videoRef = useRef<HTMLVideoElement>(null);

    const [modelsLoaded, setModelsLoaded] = useState(false);
    const [detectionColor, setDetectionColor] = useState('');
    const [icon, setIcon] = useState<ReactNode | null>(null);
    const [message, setMessage] = useState<{ title?: string, description?: string }>({});
    const [faceDetecting, setFaceDetecting] = useState(false);

    const ICON = useMemo(() => ({
        CHECKING: <AiOutlineLoading3Quarters className="animate-spin" />,
        UNRECOGNIZED: <BsPersonSlash />,
        SUCCESS: <IoIosCheckmarkCircleOutline className="text-green-600" />,
        ERROR: <MdOutlineErrorOutline className="text-red-600" />
    }), []);

    const startCamera = useCallback(() => {
        if (!modelsLoaded) return;

        setMessage({ title: 'Memulai kamera'});
        navigator.mediaDevices
            .getUserMedia({ video: { width: 300 } })
            .then(stream => {
                if (!videoRef.current) return;

                // setCameraLoading(false);

                videoRef.current.srcObject = stream;
                videoRef.current.play();
            })
            .catch(err => {
                // setCameraError(true);
                setMessage({ title: 'Gagal memuat akses kamera'});
            });
    }, [modelsLoaded]);

    const closeWebcam = useCallback(() => {
        if (!videoRef || !videoRef.current) return;
        videoRef.current.pause();
        // @ts-ignore
        videoRef.current.srcObject?.getTracks()[0].stop();
    }, [videoRef])

    const handleVideoOnPlay = useCallback(() => {
        let isLocked = false;

        setMessage({ 
            title: '',
            description: ''
        });

        setFaceDetecting(true);

        let interval = setInterval(async () => {
            if (!videoRef || !videoRef.current || isLocked) {
                return;
            }

            const detection = await faceapi.detectSingleFace(
                videoRef.current,
                new faceapi.TinyFaceDetectorOptions({ scoreThreshold: 0.5 })
            ).withFaceExpressions();

            // setDetecting(true);

            if (!detection) {
                setDetectionColor('gray');
                setMessage({ title: 'Mohon tampilkan wajah' });
                return;
            };

            setMessage({ title: 'Harap senyum' });
            setDetectionColor('blue');

            if ((detection!.detection.score > 0.4 && detection!.expressions.happy > 0.55) && !isLocked) {
                isLocked = true;
                setMessage({ title: 'Harap menahan senyum sekitar 3 detik' });
                setDetectionColor('green');

                setTimeout(async () => {
                    if (!videoRef || !videoRef.current) return;

                    const detection = await faceapi.detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions({ scoreThreshold: 0.4 })).withFaceExpressions();

                    if (!detection) {
                        setMessage({ title: 'Mohon tampilkan wajah' });
                        setDetectionColor('red');
                        isLocked = false;
                        return;
                    }

                    if (detection.detection.score > 0.4 && detection.expressions.happy > 0.55) {
                        clearInterval(interval);

                        let padding = 64;

                        // setDetecting(false);

                        const canvas = document.createElement('canvas');
                        canvas.width = Math.floor(detection?.detection.box.width!) + padding;
                        canvas.height = Math.floor(detection?.detection.box.height!) + padding;

                        canvas.getContext('2d')!.drawImage(videoRef.current!,
                            -Math.floor(detection?.detection.box.x!) + (padding / 2),
                            -Math.floor(detection?.detection.box.y!) + (padding / 2) + 10
                        );

                        setMessage({ title: 'Deteksi berhasil' });

                        canvas.toBlob((result) => {
                            const fd = new FormData();

                            if (!coordinates) {
                                // setDetecting(false);
                                // setActiveIcon(ICON_ERROR);
                                // setMessage({ title: 'Geolokasi tidak bisa dideteksi'});
                                fd.append('loc_lat', '0.0')
                                fd.append('loc_long', '0.0');
                            } else {
                                fd.append('loc_lat', String(coordinates[0]));
                                fd.append('loc_long', String(coordinates[1]));
                            }


                            fd.append('photo', new File([result!], 'user'));
                            fd.append('type', checkType);

                            setIcon(ICON.CHECKING);
                            setMessage({ title: 'Mencocokkan dataset' });
                            setFaceDetecting(false);

                            axios.post('/api/v1/student/attendance', fd, {
                                headers: {
                                    'Content-Type': 'multipart/form-data'
                                }
                            }).then((res) => {
                                mutate('/api/v1/student/attendance');

                                setTimeout(() => {
                                    setIcon(ICON.SUCCESS);
                                    setMessage({ title: 'Absensi berhasil' });
                                    setTimeout(() => {
                                        setMessage({ title: 'Terimakasih sudah melakukan absensi' });

                                        setTimeout(() => {
                                            window.location.href = '/student/home';
                                        }, 500);
                                    }, 1000)
                                }, 3000);
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
                        });

                        closeWebcam();
                    } else {
                        isLocked = false;
                        setMessage({ title: 'Mohon menahan senyum' });
                    }
                }, 2000);
            }
        }, 700);
    }, []);

    // Ini adalah awal mulai kode program dimana aplikasi akan mendownload
    // dataset wajah
    useEffect(() => {
        const loadModels = async () => {
            const MODEL_URL = '/models';

            setMessage({ 
                title: 'Menyiapkan model',
                description: 'Kecepatan proses ini dipengaruhi oleh performa perangkat anda'
            });

            Promise.all([
                faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
                faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
            ]).then(() => {
                setModelsLoaded(true);
            }).catch(e => {
                console.log(e);
            });
        }

        loadModels();
    }, []);

    // Jika modul face recognition sudah di load maka kamera akan dihidupkan
    useEffect(() => {
        startCamera();
    }, [modelsLoaded]);

    return (
        <div className="flex flex-col gap-4 items-center">
            <div className="w-[240px] h-[240px]">
                <video
                    className={`${faceDetecting ? '' : 'hidden'} w-full h-full transition border-8 rounded-full object-cover scale-x-[-1] border-${detectionColor}-600`}
                    ref={videoRef}
                    height={480}
                    width={720}
                    onAbort={(e) => console.log(e)}
                    onPlay={handleVideoOnPlay} />
                <div className={`${faceDetecting ? 'hidden' : ''} [&>*]:w-full [&>*]:h-full`}>
                    {icon}
                </div>
            </div>
            <h3 className="text-center text-lg font-semibold mt-4">{message && message.title}</h3>
            <p className="text-center text-gray-400">{message && message.description}</p>
        </div>
    );
}

export default FaceScannerCommon;