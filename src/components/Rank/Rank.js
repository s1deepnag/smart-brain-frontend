import React from "react";

const Rank = ({ name, entries}) => {
    return (
        <div>
           <div className='f3 white'>
                {`${name}, Your Current Entry Count is ...`}
           </div>
           <div className='f1 white'>
                {entries}
           </div>
        </div>
    );
}

export default Rank;