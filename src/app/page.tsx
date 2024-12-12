import * as React from "react";

import Image from "next/image";
import BigButton from "./(BigButton)/BigButton";
import PianoRoll from "./(PianoRoll/PianoRoll";


    
export default function Home() {
    console.log(React.version);
    return (
        <div className="w-screen h-screen flex justify-center items-center">
            <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
                <div className="w-full h-full flex justify-center items-center">
                    <BigButton />
                    {/* <PianoRoll width={1000} height={1000} notes={[]} /> */}
                </div>
            </main>
        </div>
    );
}
