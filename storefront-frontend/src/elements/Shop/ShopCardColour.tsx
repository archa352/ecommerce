export default function ShopCardColour(){
    return(
        <>
            <div className="form-check">
                <input className="form-check-input" type="radio" name="radioNoLabel" id="radioNoLabel21" value="#24262B" defaultChecked />
                <span style={{backgroundColor:"#24262B"}}></span>
            </div>
            <div className="form-check">
                <input className="form-check-input" type="radio" name="radioNoLabel" id="radioNoLabel22" value="#8CB2D1" />
                <span style={{backgroundColor:"#8CB2D1"}}></span>
            </div>
            <div className="form-check">
                <input className="form-check-input" type="radio" name="radioNoLabel" id="radioNoLabel23" value="#0D775E" />
                <span style={{backgroundColor:"#0D775E"}}></span>
            </div>
            <div className="form-check">
                <input className="form-check-input" type="radio" name="radioNoLabel" id="radioNoLabel24" value="#FEC4C4" />
                <span style={{backgroundColor:"#FEC4C4"}}></span>
            </div>
        </>
    )
}