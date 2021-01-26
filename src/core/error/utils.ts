import {CrossResponseErr} from "../../types";
import CrossFormResponseError from "./CrossFormResponseError";

export function createCrossResponseError(err: CrossResponseErr): CrossFormResponseError {
    return new CrossFormResponseError(err);
}