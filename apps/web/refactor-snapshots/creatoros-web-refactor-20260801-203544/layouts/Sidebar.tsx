interface Props{

    children:React.ReactNode;

}

export default function Sidebar({

    children,

}:Props){

    return(

        <aside
            style={{
                background:"#10141d",
                borderRight:"1px solid #202636",
                padding:24
            }}
        >

            {children}

        </aside>

    );

}
