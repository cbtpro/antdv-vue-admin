export interface WebSocketRequestPayload {
  requestId: string;
  url: string;
  method?: string;
  data?: unknown;
  params?: unknown;
}

export interface WebSocketResponse<T = unknown> {
  requestId: string;
  success: boolean;
  data?: T;
  error?: WebSocketResponseError;
}

export interface WebSocketResponseError {
  code?: number | string;
  message: string;
  details?: unknown;
}

export interface WebSocketFetcherParams {
  url: string;
  method?: string;
  data?: unknown;
  params?: unknown;
}

export function createWebSocketFetcher(wsInstance: WebSocket) {
  return function websocketFetcher<T = unknown>({
    url,
    method,
    data,
    params,
  }: WebSocketFetcherParams): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const requestId = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const payload: WebSocketRequestPayload = {
        requestId,
        url,
        method,
        data,
        params,
      };

      function onMessage(event: MessageEvent<string>) {
        let response: WebSocketResponse<T>;
        try {
          response = JSON.parse(event.data) as WebSocketResponse<T>;
        } catch (parseError: unknown) {
          // 非本请求或格式异常，忽略
          console.error('消息解析失败:', parseError);
          return;
        }
        if (response.requestId === requestId) {
          wsInstance.removeEventListener('message', onMessage);
          if (response.success) {
            resolve(response.data as T);
          } else {
            reject(response.error);
          }
        }
      }

      wsInstance.addEventListener('message', onMessage);

      wsInstance.send(JSON.stringify(payload));
    });
  };
}
