<template>
  <div class="about">
    <h1>Тестовое задание #1</h1>
    <p>
      You need to create a Vue.js component which contains a property of type String
      and some method (say, foo ). The component may be used inside itself (or may
      not). If foo method was called in the parent component, it should be
      automatically called in all child components. To illustrate the structure, render
      string-type property in component. Pretty visualisation of the structure is welcome.
    </p>
    <p>
      If foo was called in component 1, it must automatically be called in 2, 3, 4, 5.
      If the method was called in 2, it must be called only in 3.
      Depth can be unlimited. The method should be called by mouse click.
      To illustrate that method was really called, you can render something or simply log
      to console.
    </p>
    <h2>Реализация</h2>
    <div>
      <Comment comment-text="text" :innerComment="innerComment"></Comment>
    </div>
  </div>
</template>
<script>
import Comment from '../components/Comment.vue';

export default {
  components: { Comment },
  data() {
    return {
      innerComment: {
        text: 'inner',
      },
    };
  },
};
</script>
