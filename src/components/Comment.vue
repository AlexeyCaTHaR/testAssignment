<template>
  <div
    v-bind:class="{'deleted': isDeleted}"
    class="comment">
      <p v-html="commentText"></p>
      <button @click="deleteComment" class="delete">Удалить комментарий</button>

      <div v-if="showInnerComment" class="inner">
        <Comment
          :comment-text="innerComment.commentText"
          :inner-comment="innerComment.innerComment"
        >
        </Comment>
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
  data() {
    return {
      isDeleted: false,
    };
  },
  computed: {
    showInnerComment() {
      return this.innerComment
        && this.innerComment.commentText
        && this.innerComment.commentText.length > 0;
    },
  },
  methods: {
    deleteComment() {
      this.isDeleted = true;
      console.log('delete comment with text:', this.commentText);
    },
  },
};
</script>

<style lang="scss" scoped>
  .comment {
    border: 1px solid #30363d;
    border-radius: 10px;
    margin-bottom: 10px;

    &.deleted {
      border-color: red;
    }
    .inner {
      padding: 10px;
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
