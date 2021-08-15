<template>
  <div
    :class="message.type"
    class="message">
    <p v-html="message.message"></p>
    <button @click="hideMessage(+message.id)" class="delete">Скрыть</button>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'Message',
  props: {
    message: {
      type: Object,
      default: () => {
      },
    },
  },
  methods: {
    ...mapActions({
      hideMessage: 'sse/hideMessage',
    }),
  },
};
</script>

<style lang="scss" scoped>
.message {
  border: 1px solid #30363d;
  border-radius: 10px;
  margin-bottom: 10px;

  &.join {
    background-color: rgba(87, 212, 37, 0.8);
    font-weight: bold;
  }
  &.warning {
    background-color: #d48825;
    font-weight: bold;
  }
  &.error {
    background-color: #fa9090;
    font-weight: bold;
  }
  &.open {
    background-color: #dcb968;
    font-weight: bold;
  }

  p {
    padding: 10px;
  }

  button {
    border: 1px solid red;
    border-radius: 10px;
    background: #fff;
    cursor: pointer;
    margin: 10px;
    padding: 5px 10px;

    &.delete {
      color: red;
    }
  }
}
</style>
