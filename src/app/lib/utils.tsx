import { Sprout,Shirt,Glasses } from 'lucide-react';

export const categories =(categoryNumber:number)=>{
    const iconCss = 'flex items-center gap-1'
    const iconSize = "h-3 w-3"
    switch (categoryNumber) {
        case 1:
            return <div className={iconCss}><Sprout className={iconSize} />Plants</div>;
        case 2:
            return <div className={iconCss}><Shirt className={iconSize} />Clothes</div>;
        case 3:
            return <div className={iconCss}><Glasses className={iconSize} />Goods</div>;
        default:
            return "Unknown";
    }
}