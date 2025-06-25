import { ref, type Ref } from 'vue';

interface WebSocketOptions {
  /**
   * websocket地址
   */
  url: string;
  /**
   * 心跳开关
   */
  enableHeartBeat: boolean;
  /**
   * 心跳数据
   */
  heartBeatData: string;
  /**
   * 心跳间隔
   */
  heartBeatInterval: number;
  /**
   * 重连间隔
   */
  reconnectInterval: number;
  /**
   * 最大重连次数
   */
  maxReconnectAttempts: number;
}

const DEFAULT_OPTIONS: WebSocketOptions = {
  /**
   * websocket地址
   */
  url: '',
  /**
   * 心跳开关
   */
  enableHeartBeat: false,
  /**
   * 心跳数据
   */
  heartBeatData: 'ping',
  /**
   * 心跳间隔
   */
  heartBeatInterval: 60 * 1000,
  /**
   * 重连间隔
   */
  reconnectInterval: 5000,
  /**
   * 最大重连次数
   */
  maxReconnectAttempts: 10,
};

export const SocketStatus = {
  Connecting: '正在连接...',
  Connected: '连接已建立',
  Disconnecting: '连接正在关闭',
  Disconnected: '连接已断开',
} as const;

type SocketStatusType = (typeof SocketStatus)[keyof typeof SocketStatus];

const SocketCloseCode = 1000;

export default function useWebSocket(customOptions: Partial<WebSocketOptions> = {}) {
  const options: WebSocketOptions = { ...DEFAULT_OPTIONS, ...customOptions };

  const status: Ref<SocketStatusType> = ref(SocketStatus.Disconnected);
  const message: Ref<unknown> = ref(null);
  const error: Ref<Event | null> = ref(null);

  const state = {
    options,
    socket: null as WebSocket | null,
    reconnectAttempts: 0,
    reconnectTimeout: null as ReturnType<typeof setTimeout> | null,
    heartBetaSendTimer: null as ReturnType<typeof setTimeout> | null,
    heartBetaTimeoutTimer: null as ReturnType<typeof setTimeout> | null,
  };

  const connect = () => {
    disconnect();

    status.value = SocketStatus.Connecting;

    if (!window.navigator.onLine) {
      setTimeout(() => {
        status.value = SocketStatus.Disconnected;
      }, 500);
      return;
    }

    state.socket = new WebSocket(state.options.url);

    state.socket.onopen = (openEvent: Event) => {
      console.log('socket连接:', openEvent);
      state.reconnectAttempts = 0;
      status.value = SocketStatus.Connected;
      error.value = null;
      startHeartBeat();
    };

    state.socket.onmessage = (msgEvent: MessageEvent<string>) => {
      // console.log('socket消息:', msgEvent);
      startHeartBeat();

      try {
        const data = JSON.parse(msgEvent.data);
        message.value = data;
      } catch (e) {
        console.warn('消息解析失败:', e);
      }
    };

    state.socket.onclose = (closeEvent: CloseEvent) => {
      console.log('socket关闭:', closeEvent);
      status.value = SocketStatus.Disconnected;
      if (closeEvent.code !== SocketCloseCode) {
        reconnect();
      }
    };

    state.socket.onerror = (errEvent: Event) => {
      console.log('socket报错:', errEvent);
      status.value = SocketStatus.Disconnected;
      error.value = errEvent;
      reconnect();
    };
  };

  const send = (data: unknown) => {
    if (state.socket && state.socket.readyState === WebSocket.OPEN) {
      try {
        const json = typeof data === 'string' ? data : JSON.stringify(data);
        state.socket.send(json);
        // console.log('发送消息:', json);
      } catch (err) {
        console.error('发送消息失败:', err);
      }
    } else {
      console.warn('WebSocket 未连接，消息未发送');
    }
  };
  const disconnect = () => {
    if (
      state.socket &&
      (state.socket.readyState === WebSocket.OPEN ||
        state.socket.readyState === WebSocket.CONNECTING)
    ) {
      console.log('socket断开连接');
      status.value = SocketStatus.Disconnecting;
      state.socket.onmessage = null;
      state.socket.onerror = null;
      state.socket.onclose = null;
      state.socket.close(SocketCloseCode, '正常关闭');
      status.value = SocketStatus.Disconnected;
      state.socket = null;
    }

    stopHeartBeat();
    stopReconnect();
  };

  const startHeartBeat = () => {
    stopHeartBeat();
    if (!state.options.enableHeartBeat) {
      return; // 🚫 不启用心跳
    }
    onHeartBeat(() => {
      if (status.value === SocketStatus.Connected && state.socket?.readyState === WebSocket.OPEN) {
        state.socket.send(state.options.heartBeatData);
        console.log('发送心跳:', state.options.heartBeatData);
      }
    });
  };

  const onHeartBeat = (callback: () => void) => {
    state.heartBetaSendTimer = setTimeout(() => {
      callback();
      state.heartBetaTimeoutTimer = setTimeout(() => {
        state.socket?.close(4000, '心跳超时');
      }, state.options.heartBeatInterval);
    }, state.options.heartBeatInterval);
  };

  const stopHeartBeat = () => {
    if (state.heartBetaSendTimer) clearTimeout(state.heartBetaSendTimer);
    if (state.heartBetaTimeoutTimer) clearTimeout(state.heartBetaTimeoutTimer);
  };

  const reconnect = () => {
    if (status.value === SocketStatus.Connected || status.value === SocketStatus.Connecting) return;

    stopHeartBeat();

    if (state.reconnectAttempts < state.options.maxReconnectAttempts) {
      console.log('尝试重连:', state.reconnectAttempts);

      const interval = Math.max(state.options.reconnectInterval, state.reconnectAttempts * 1000);
      console.log('间隔时间：', interval);

      state.reconnectTimeout = setTimeout(() => {
        if (status.value !== SocketStatus.Connected && status.value !== SocketStatus.Connecting) {
          connect();
        }
      }, interval);

      state.reconnectAttempts += 1;
    } else {
      status.value = SocketStatus.Disconnected;
      stopReconnect();
    }
  };

  const stopReconnect = () => {
    if (state.reconnectTimeout) clearTimeout(state.reconnectTimeout);
  };

  return {
    status,
    message,
    send,
    error,
    connect,
    disconnect,
  };
}
