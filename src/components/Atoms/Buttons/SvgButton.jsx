import styles from './SvgButton.module.css'

const SvgButton = ({
    onClick,
    svg
}) => {
    return (
        <button className={styles.svgButton} onClick={onClick}>
            {svg}
        </button>
    );
}

export default SvgButton;