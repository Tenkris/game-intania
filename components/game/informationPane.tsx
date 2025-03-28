type infoState = {
    name: string;
    attack: number;
    defense: number;
    currentHP: number;
    maxHP: number;
}


export default function InformationPane({ info }: { info: infoState }) {
    return (
        <div className ="bg-blue-600 w-full h-full p-2 flex flex-col">
            <div className="w-full h-12 bg-sky-400 flex items-center justify-center z-10">
                {/* Red Health Bar */}
                <div className="h-full bg-red-600 transition-all ease-in duration-250" style={{ width : `${(info.currentHP / info.maxHP) * 100}%` }} />      
                {/* Black Health Bar */}
                <div className={`h-full bg-black transition-all ease-in duration-250`} style={{ width : `${100 - (info.currentHP / info.maxHP) * 100}%` }}/>
            </div>
            <div>
                Name : {info.name}
            </div>
            <div>
                HP : {info.currentHP} / {info.maxHP}
            </div>
            <div>
                Attack : {info.attack}
            </div>
            <div>
                Defense : {info.defense}
            </div>
        </div>
    
    );
}