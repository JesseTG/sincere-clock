import {Temporal} from "temporal-polyfill";
import {format} from "../../utils/timeUtils";
import {LuSquarePower} from "react-icons/lu";
import {ReactElement} from "react";
import UnsetTime from "./UnsetTime";

export interface TimeSinceBootProps {
    bootTime: Temporal.Instant | null;
    now: Temporal.Instant;
}

export default function TimeSinceBoot(props: TimeSinceBootProps) {
    let component: ReactElement;
    if (props.bootTime) {
        component = <span className={"duration"}>{format(props.now.since(props.bootTime))}</span>;
    }
    else {
        component = <UnsetTime/>;
    }

    return (
        <div className={"clock"}>
            <LuSquarePower className={"icon"}/>
            {component}
        </div>
    );
}
