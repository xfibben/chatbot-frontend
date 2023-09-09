
import Suma from "@/app/components/suma";
import Menu from "@/app/components/menus";
export default function Home() {


    return (
        <main className={'w-full grid'}>
            <Menu/>
            <h1 className={'mx-auto text-6xl'}>Home</h1>
            <Suma x={parseInt(5)} y={parseInt(10)}> </Suma>
        </main>

    )
}