import Slider from "react-slick";
import {Image} from 'antd';
import React from "react";
import './SliderComponent.css';
function SliderComponent({arrImages}) {
    const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    };
    return ( 
        <Slider className="slider" {...settings}>
            {arrImages.map((image, index) => { 
                return (
                    <Image src={image} alt="slider" key={ index} preview={false} width='100%' />
                )

            }) }
        </Slider>
     );
}

export default SliderComponent;