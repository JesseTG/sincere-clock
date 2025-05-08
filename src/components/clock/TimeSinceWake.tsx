import {Temporal} from "temporal-polyfill";
import {format} from "../../utils/timeUtils";
import {ReactElement} from "react";
import {LuCoffee} from "react-icons/lu";
import UnsetTime from "./UnsetTime";

export interface TimeSinceWakeProps {
    wakeTime: Temporal.Instant | null;
    now: Temporal.Instant;
}

export default function TimeSinceWake(props: TimeSinceWakeProps) {
    let component: ReactElement;
    if (props.wakeTime) {
        component = <span className={"duration"}>{format(props.now.since(props.wakeTime))}</span>;
    }
    else {
        component = <UnsetTime/>
    }

    return (
        <div className={"clock"}>
            <LuCoffee className={"icon"}/>
            {component}
        </div>
    );
}
