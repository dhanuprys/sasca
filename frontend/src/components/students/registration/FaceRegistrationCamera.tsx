import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { CiFaceSmile } from "react-icons/ci";
import { FaCheck } from "react-icons/fa";
import { FiCameraOff, FiCamera } from "react-icons/fi";
import { MdOutlineErrorOutline } from "react-icons/md";
import Webcam from "react-webcam";

function FaceRegistrationCamera() {
    const ICON_LOADING = <AiOutlineLoading className="animate-spin text-[4rem] text-blue-500" />;
    const ICON_CHECKING = <CiFaceSmile className="text-[8rem]" />;
    const ICON_SUCCESS = <FaCheck className="icon-enter text-green-500 text-[8rem]" />;
    const ICON_ERROR = <MdOutlineErrorOutline className="icon-enter text-[8rem] text-red-500" />;

    const [cameraError, setCameraError] = useState(false);
    const [isCameraLoading, setCameraLoading] = useState(true);
    const [isDetecting, setDetecting] = useState(false);
    const [detectionMessage, setDetectionMessage] = useState('');
    const [ActiveIcon, setActiveIcon] = useState(ICON_LOADING);
    const [signatures, setSignatures] = useState<string[]>([]);

    const webcamRef = useRef<any>(null);

    // Mengaktifkan kamera ketika halaman sudah selesai dimuat
    useEffect(() => {
        setDetecting(true);
    }, []);

    // Metode dibawah akan membaca setiap perubahan yang terjadi
    // pada state signatures. Apabila dibaca panjang dari signature
    // sudah >= 3 maka dengan otomatis fungsi dibawah akan mematikan
    // kamera dan kemudian melakukan upload seluruh signature ke server
    useEffect(() => {
        if (signatures.length < 3) return;

        setDetecting(false);
        setDetectionMessage('Menyimpan sampel wajah...');

        axios.post('/api/v1/student/face-sample', {
            signatures
        }).then((res) => {
            setActiveIcon(ICON_SUCCESS);
            setDetectionMessage('Berhasil menambahkan sampel wajah');

            setTimeout(() => {
                window.location.href = '/siswa/beranda';
            }, 2500);
        }).catch((err) => {
            // Jika terjadi error pada saat pengiriman data
            // maka pesan error akan ditampilkan pada layar
            setActiveIcon(ICON_ERROR);
            setDetectionMessage('Sampel gagal di upload');
        });
    }, [signatures]);

    // Fungsi capture akan dipanggil ketika user menekan tombol foto
    // Fungsi ini akan merekam gambar pengguna kemudian melakukan checking
    // ke server
    const capture = useCallback(
        () => {
            const imageSrc = webcamRef.current.getScreenshot();

            setDetecting(false);
            setDetectionMessage('');

            // Mengkonversi hasil capture dari base64 menjadi blob
            fetch(imageSrc)
                .then(res => res.blob())
                .then(imageBlob => {
                    const fd = new FormData();

                    fd.append('photo', new File([imageBlob!], 'user'));

                    setActiveIcon(ICON_CHECKING);
                    setDetectionMessage('Memvalidasi wajah');

                    // Melakukan server-side checking
                    axios.post('/api/v1/student/face-sample/signature', fd, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    }).then((res) => {
                        // Memuat daftar signature sebelumnya sebelum melakukan pembaruan
                        let currentSignatures: any[] = [...signatures, res.data.signature];

                        // Memperbarui signature
                        setSignatures(currentSignatures);

                        // Menunggu beberapa detik sebelum menghidupkan kamera kembali
                        // ini disebabkan untuk meminimalisir masalah kamera yang tidak 
                        // mau start setelah terjadi reload
                        setTimeout(() => {
                            if (currentSignatures.length < 3) {
                                setDetecting(true);
                            }
                        }, 2000);
                    }).catch(() => {
                        // Melakukan retake jika terjadi error koneksi ke server
                        setDetecting(true);

                        // Jika terjadi kesalahan pada server, maka pesan kesalahan
                        // akan ditampilkan pada user
                        // setDetectionMessage(res.data.message);
                    }).finally(() => {
                        setDetectionMessage('');
                    });
                });
        },
        // Metode ini hanya akan dijalankan ketika dideteksi ada perubahan pada
        // webcamRef dan signatures
        [webcamRef, signatures]
    );

    const CameraPreview = () => {
        return (
            <>
                <p className="text-sm text-center">Harap swafoto untuk melakukan perekaman</p>

                <div className="flex flex-col items-center justify-center mt-10">
                    <div className="!w-[250px] !h-[250px] relative">
                        {
                            cameraError
                                ? <div className="absolute w-full h-full flex justify-center items-center z-[99]">
                                    <FiCameraOff className="text-[8rem]" />
                                </div>
                                : isCameraLoading
                                    ? <div className="absolute w-full h-full flex justify-center items-center z-[99]">
                                        <FiCamera className="text-[8rem]" />
                                    </div>
                                    : !isDetecting
                                        ? <div className="absolute w-full h-full flex justify-center items-center z-[99]">
                                            {ActiveIcon}
                                        </div>
                                        : null
                        }
                        {
                            isDetecting
                                ? <>
                                    <Webcam
                                        className="object-cover rounded !max-h-full !min-h-full !min-w-full"
                                        ref={webcamRef}
                                        screenshotFormat="image/png"
                                        disablePictureInPicture={true}
                                        mirrored={true}
                                        onError={() => setCameraError(true)}
                                        onLoadedData={() => setCameraLoading(false)} />
                                    <div className="flex mt-2 bg-gray-100 h-[10px] rounded">
                                        {
                                            signatures.map((signature) => {
                                                return (
                                                    <div key={signature} className="basis-1/3 bg-blue-500 rounded h-[10px]"></div>
                                                );
                                            })
                                        }
                                    </div>
                                </>
                                : null
                        }
                    </div>
                    <div className="text-gray-500 mt-5 text-center text-sm">
                        {detectionMessage}
                    </div>
                    {
                        isDetecting
                            ?
                            <>
                                <div className="pt-10">
                                    <div onClick={capture} className="p-4 hover:cursor-pointer rounded-lg bg-blue-500 text-white">
                                        FOTO
                                    </div>
                                </div>
                            </>
                            : null
                    }
                </div>
            </>
        );
    }

    return (
        <div className="flex flex-col p-4 h-full">
            <div className="border-yellow-500 border-red-500 border-blue-500 border-green-500"></div>
            <CameraPreview />
            {/* <button className="w-full bg-green-500 text-white rounded px-4 py-2" onClick={capture}>ABSEN</button> */}
        </div>
    );
}

export default FaceRegistrationCamera;