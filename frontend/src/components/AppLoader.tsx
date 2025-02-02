import React from 'react';
import { MoonLoader } from "react-spinners"

const AppLoader: React.FC = () => {
    return <div style={{width: '100%', height: '100vh', background: 'white', display: 'grid', placeItems: 'center'}}>
        <MoonLoader />
    </div>
}

export default AppLoader;