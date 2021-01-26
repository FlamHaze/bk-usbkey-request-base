import { CrossResponse, CrossResponseMap, CrossSendData } from "./types";
/**
 * 对外暴露入口
 * @param params 请求参数
 * @param errorJudgeFun 错误回调
 */
export default function (params: CrossSendData | Array<CrossSendData>, errorJudgeFun?: (jsonData: any, strData: string) => boolean): Promise<CrossResponseMap<CrossResponse>> | null;
