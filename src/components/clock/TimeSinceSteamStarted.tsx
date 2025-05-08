import {Temporal} from "temporal-polyfill";
import {format} from "../../utils/timeUtils";
import {ReactElement} from "react";
import {FaSteam} from "react-icons/fa6";
import UnsetTime from "./UnsetTime";

export interface TimeSinceSteamStartedProps {
    startTime: Temporal.Instant | null;
    now: Temporal.Instant;
}

export default function TimeSinceSteamStarted(props: TimeSinceSteamStartedProps) {
    let component: ReactElement;
    if (props.startTime) {
        component = <span className={"duration"}>{format(props.now.since(props.startTime))}</span>;
    }
    else {
        component = <UnsetTime/>;
    }

    return (
        <div className={"clock"}>
            <FaSteam className={"icon"}/>
            {component}
        </div>
    );
}
