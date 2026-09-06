const Rating = ({ style }) => {
    return (
        <>
            <ul className={`rating ${style}`}>
                <li>
                    <i className="fas fa-star theme-color"></i>
                </li>
                <li>
                    <i className="fas fa-star theme-color"></i>
                </li>
                <li>
                    <i className="fas fa-star theme-color"></i>
                </li>
                <li>
                    <i className="fas fa-star theme-color"></i>
                </li>
                <li>
                    <i className="fas fa-star theme-color"></i>
                </li>
            </ul>
        </>
    )
}
export default Rating;