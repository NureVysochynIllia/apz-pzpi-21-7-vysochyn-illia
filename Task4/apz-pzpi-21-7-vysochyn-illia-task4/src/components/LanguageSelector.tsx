
const LanguageSelector: React.FC<{ setLanguage: (language: string) => void }> = ({ setLanguage }) => {
    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedLanguage = event.target.value;
        localStorage.setItem('language', selectedLanguage);
        setLanguage(selectedLanguage);
        window.location.reload();
    };

    return (
        <select onChange={handleChange} defaultValue={localStorage.getItem('language') || 'EN'}
                className="p-2 border rounded-md bg-white text-gray-800">
            <option value="EN">English</option>
            <option value="UK">Українська</option>
        </select>
    );
};

export default LanguageSelector;