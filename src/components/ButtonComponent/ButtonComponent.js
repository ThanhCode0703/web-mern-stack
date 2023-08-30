import { Button } from "antd";

function ButtonComponent({size, styleButton, styledTextButton,textButton,icon, ...rests}) {
    return ( 
        <Button 
            size={size} 
            style={styleButton}
            icon={icon} 
            {...rests}
            
            >
                <span style={styledTextButton}>
                {textButton}</span></Button>
     );
}

export default ButtonComponent;