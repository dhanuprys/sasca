'use client';

import Skeleton from "@/components/Skeleton";
import { swrFetcher } from "@/utils/swrFetcher";
import useSWRImmutable from "swr/immutable";

interface FaceSampleProps {
    studentId: number;
}

function FaceSample({ studentId }: FaceSampleProps) {
    const { data: samples, error: sampleError, isLoading } = useSWRImmutable(
        `/api/v1/counselor/student/${studentId}/sample`,
        swrFetcher
    );

    if (sampleError && sampleError.response.status === 404) {
        return null;
    }

    if (isLoading) {
        return <Skeleton style={{ height: '150px' }} />;
    }

    return (
        <div className="p-4 border rounded-xl bg-white">
            <div>

            </div>
            <div className="grid grid-cols-3 gap-2">
                {
                    samples.map((sample: any) => {
                        return (
                            <img className="w-full h-[90px] sm:h-[100px] md:h-[140px] lg:h-[170px] rounded-xl bg-slate-200" src={`/api/_static/samples/${sample.sample_path}`} />
                        );
                    })
                }
            </div>
        </div>
    );
}

export default FaceSample;