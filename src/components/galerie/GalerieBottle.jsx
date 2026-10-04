import './GalerieBottle.css';

// Render the original embedded photo directly on mobile. Filtered SVG patterns
// can be rasterized at their small export size by mobile browsers.
export default function GalerieBottle({ desktop, mobile, alt, cropped = false }) {
    return (
        <span className="galerie-tamdao__bottle">
            <img className="galerie-bottle__desktop" src={desktop} alt={alt} width="520" height="670" loading="lazy" />
            <span className={`galerie-bottle__mobile${cropped ? ' galerie-bottle__mobile--cropped' : ''}`}>
                <span className="galerie-bottle__crop">
                    <img src={mobile} alt={alt} loading="lazy" />
                </span>
            </span>
        </span>
    );
}
