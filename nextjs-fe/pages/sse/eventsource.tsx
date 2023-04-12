import { useEffect, useState } from 'react';

export default function EventSourcePage() {
    const [data, setData] = useState(null);

    useEffect(() => {
        const eventSource = new EventSource('http://localhost:5000/notifs');

        eventSource.onmessage = (event) => {
            setData(event.data);
        };

        return () => {
            eventSource.close();
        };
    }, []);

    return (
        <div>
            <h1>Real-time data:</h1>
            <p>{data}</p>
        </div>
    );
}
