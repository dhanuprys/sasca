import axios from "axios";

function swrFetcherOverride(url: string) {
    return () => {
        axios.get(url).then(res => res.data);
    };
}

async function swrFetcher(url: string) {
    const res = await axios.get(url);
    
    return res.data;
}

export {
    swrFetcher,
    swrFetcherOverride
};