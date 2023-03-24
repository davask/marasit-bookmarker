import { useSelector } from 'react-redux';

const __ = (text) => {
    const translations = useSelector((store) => store.translations);
    if (typeof translations !== "undefined" && typeof translations[text] === "undefined") {
      text = translations[text];
    }
    return text;
}

export { __ } 