import FaceScanner from "@/layouts/student/FaceScanner";

function CheckInOutPage({ params }: { params: { type: string } }) {
    return (
        <div>
            <FaceScanner checkType={params.type} />
        </div>
    );
}

export default CheckInOutPage;