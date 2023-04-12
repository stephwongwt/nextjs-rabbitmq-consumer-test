import useSWR from "swr";

function ConsumerPage() {
    const fetcher = (url) => fetch(url).then((res) => res.json());

    const { data, error, isLoading } = useSWR(
        "http://localhost:4000/start-consuming",
        fetcher
    );
    if (error) {
        console.error(error);
        return <p className="center">An error has occurred.</p>;
    }
    if (isLoading) return <p className="center">Loading...</p>;
    console.log(data);

    return (
        <p>
            {data.payload}
        </p>
    )
}

export default ConsumerPage;