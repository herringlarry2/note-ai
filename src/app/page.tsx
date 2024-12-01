import Image from 'next/image'
import BigButton from './(BigButton)/BigButton'
export default function Home() {
    return (
        <div className="w-screen h-screen flex justify-center items-center">
            <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
                <div className="w-full h-full flex justify-center items-center">
                    <BigButton />
                </div>
            </main>
        </div>
    )
}
