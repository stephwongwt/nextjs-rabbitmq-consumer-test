import Image from 'next/image'
import { Inter } from 'next/font/google'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <ul>
        <li>
          Express
          <ul className='list-disc pl-5 mb-10'>
            <li className='py-2'><Link href="/express/start-consumer" className='underline transition duration-300 ease-in-out hover:decoration-transparent text-primary transition duration-150 ease-in-out'>Start Continuous Consumer</Link></li>
            <li className='py-2'><Link href="/express/consume-once" className='underline transition duration-300 ease-in-out hover:decoration-transparent text-primary transition duration-150 ease-in-out'>Auto Refreshed Consumer (SWR)</Link></li>
          </ul>
        </li>
        <li>
          Server Side Events
          <ul className='list-disc pl-5 mb-10'>
            <li className='py-2'><Link href="/sse/eventsource" className='underline transition duration-300 ease-in-out hover:decoration-transparent text-primary transition duration-150 ease-in-out'>Receive Events from Server</Link></li>
          </ul>
        </li>
      </ul>
    </main>
  )
}
