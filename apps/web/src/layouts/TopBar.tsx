interface Props{

    title:string;

}

export default function TopBar({

    title,

}:Props){

    return(

        <header
            style={{
                height:72,
                display:"flex",
                alignItems:"center",
                justifyContent:"space-between",
                padding:"0 30px",
                borderBottom:"1px solid #202636",
                background:"#0d1018"
            }}
        >

            <h2
                style={{
                    margin:0,
                    color:"#fff"
                }}
            >
                {title}
            </h2>

        </header>

    );

}
