<template>
  <div class="about">
    <h1>Server Side Events</h1>
    <p>Спецификация <a
      href="https://html.spec.whatwg.org/multipage/comms.html#the-eventsource-interface">Server-Sent
      Events</a> описывает встроенный класс <code>EventSource</code>, который позволяет поддерживать
      соединение с сервером и получать от него события.</p>

    <h2>Реализация</h2>
    <p>
      В данной реализации мы открываем подключение и ожидаем сообщения от сервера в формате
      <code>json</code>. Парсим данные и кладём в стор, откуда уже и отображаем на странице.
      В заголовках ответа от сервера на другом домене мы должны получить заголовок
      <code>Access-Control-Allow-Origin</code>. Обрабатываем 3 события по умолчанию:
      open, message, error. Так же можно обрабатывать события другого типа, для этого нужно серверу
      указать тип события перед отправкой данных. В данном примере реализована обработка события
      <code>join</code>.
    </p>

    <button @click="sseEnabled = !sseEnabled">{{buttonText}}</button>
    <p>Статус подключения = {{sseStatus}}</p>
    <div class="messages">
      <Message
        v-for="(message, index) in messages"
        :key="'message-' + index"
        :message="message"
      ></Message>
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex';
import Message from '@/components/Message.vue';

export default {
  components: { Message },
  data() {
    return {
      eventSource: null,
      eventSourceUrl: '',
      sseEnabled: false,
    };
  },
  computed: {
    ...mapGetters({
      logMessages: 'sse/getMessages',
    }),
    messages() {
      return this.logMessages.filter((message) => !message.hidden);
    },
    buttonText() {
      return this.sseEnabled ? 'Close connection' : 'Open connection';
    },
    sseStatus() {
      if (!this.sseEnabled) {
        return 'Not connected';
      }
      if (this.eventSource.readyState === 0) {
        return 'Connecting';
      }
      if (this.eventSource.readyState === 1) {
        return 'Opened';
      }
      return 'Closed';
    },
  },
  methods: {
    listenSource() {
      this.eventSource = new EventSource(this.eventSourceUrl);

      this.eventSource.onopen = this.connected;
      this.eventSource.onerror = this.error;
      this.eventSource.onmessage = this.incomingMessage;
      this.eventSource.addEventListener('join', this.joinEvent);
    },
    connected() {
      this.addMessage({
        type: 'log',
        message: 'Connection was opened',
      });
    },
    incomingMessage(event) {
      const parsedData = JSON.parse(event.data);
      this.addMessage(parsedData);
    },
    error(event) {
      this.addMessage({
        type: 'error',
        message: `Error was ocured: ${JSON.stringify(event)}`,
      });
    },
    joinEvent(event) {
      this.addMessage({
        type: 'join',
        message: JSON.parse(event.data),
      });
    },
    ...mapActions({
      addMessage: 'sse/loadMessage',
    }),
  },
  watch: {
    sseEnabled() {
      if (this.sseEnabled) {
        this.listenSource();
      }
    },
  },
};
</script>
<style scoped>
button {
  margin-bottom: 10px;
  padding: 10px;
}
</style>
