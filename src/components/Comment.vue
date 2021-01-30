<template>
  <div class="comment">
    <p v-html="commentText"></p>
    <button @click="deleteComment">Удалить комментарий</button>

    <div v-if="showInnerComment" class="inner">
      <Comment :comment-text="innerComment.text"></Comment>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Comment',
  props: {
    commentText: {
      type: String,
      default: '',
    },
    innerComment: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    showInnerComment() {
      return this.innerComment && this.innerComment.text && this.innerComment.text.length > 0;
    },
  },
  methods: {
    deleteComment() {
      console.log('delete comment with text:', this.commentText);
    },
  },
};
</script>

<style lang="scss" scoped>
  .comment {
    border: 1px solid #30363d;
    border-radius: 10px;
    .inner {
      padding: 15px;
    }
    p {
      padding: 10px;
    }
    button {
      border: 1px solid #30363d;
      border-radius: 10px;
      background: #fff;
      cursor: pointer;
      margin: 10px;
      padding: 5px 10px;
    }
  }

</style>
