
const Button = ({ text, onclick, disabled = false}: { text: string, onclick?: (...args:any) => void, disabled?: boolean}) => {
    function noop(){}
    return <button onClick={onclick || noop} disabled={disabled} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">{text}</button>

}
export default Button;