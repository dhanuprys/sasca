function SplashScreen() {
    return (
        <div className="h-screen flex justify-center items-center bg-sky-800">
            <div className="-translate-y-10 md:translate-y-0 flex justify-center items-center gap-2">
                <h1 className="text-2xl font-bold text-white animate-pulse p-2 border-4 border-orange-500">
                    SASCA
                </h1>
                <div className="text-white text-sm font-semibold animate-pulse">
                    <span>SISTEM ABSENSI<br />SEKOLAH CERDAS</span>
                </div>
            </div>
        </div>
    );
}

export default SplashScreen;