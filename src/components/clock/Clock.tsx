import {Temporal} from "temporal-polyfill";
import {localDateTimeFormat} from "../../utils/timeUtils";
import {LuClock} from "react-icons/lu";

export interface ClockProps {
    time: Temporal.Instant;
}

export default function Clock(props: ClockProps) {

    return (
        <div className={"clock"}>
            <LuClock className={"icon"}/>
            <span className={"time"}>{localDateTimeFormat.format(props.time)}</span>
        </div>
    );
}
