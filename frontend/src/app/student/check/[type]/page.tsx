import FaceScanner from "@/layouts/student/FaceScanner";

function CheckInOutPage({ params }: { params: { type: string } }) {
    return (
        <div>
            <FaceScanner />
        </div>
    );
}

export default CheckInOutPage;