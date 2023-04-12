import useSWR from "swr";

function ConsumerPage() {
    const fetcher = (url) => fetch(url).then((res) => res.json());

    const { data, error, isLoading } = useSWR(
        "http://localhost:4000/consume-once",
        fetcher, { refreshInterval: 5000 }
    );

    if (error) {
        console.error(error);
        return <p className="center">An error has occurred.</p>;
    }

    if (isLoading) return <p className="center">Loading...</p>;
    console.log(data);

    return (
        <ul>
            {data.payload.map((str) => {
                return <li key={str}>{str}</li>;
            })}
        </ul>
    )
}

export default ConsumerPage;