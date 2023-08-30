import { Input } from "antd";

function InputComponent({size,placeholder,bordered,style, ...rests}) 
{
    return ( 
        <Input 
            size={size} 
            placeholder={placeholder}
             bordered= {bordered} 
             style={style}
             
             {...rests}/>
     );
}

export default InputComponent
;