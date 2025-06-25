import { cssTransition } from "react-toastify";
import './index.scss'

const SlideDownUp = cssTransition({
    enter: "slide-in-down",
    exit: "slide-out-up",
    duration: [400, 400],
});

export default SlideDownUp;