import {Temporal} from "temporal-polyfill";
import {format} from "../../utils/timeUtils";
import {ReactElement} from "react";
import {LuGamepad2} from "react-icons/lu";
import UnsetTime from "./UnsetTime";

export interface TimeSinceGameStartedProps {
    startTime: Temporal.Instant | null;
    now: Temporal.Instant;
}

export default function TimeSinceGameStarted(props: TimeSinceGameStartedProps) {
    let component: ReactElement;
    if (props.startTime) {
        component = <span className={"duration"}>{format(props.now.since(props.startTime))}</span>;
    }
    else {
        component = <UnsetTime/>;
    }

    return (
        <div className={"clock"}>
            <LuGamepad2 className={"icon"}/>
            {component}
        </div>
    );
}
